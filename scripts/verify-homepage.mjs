#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = resolve(root, 'src/pages/index.astro');
const cssPath = resolve(root, 'src/styles/global.css');

const page = readFileSync(pagePath, 'utf8');
const globalCss = readFileSync(cssPath, 'utf8');
const inlineStyles = [...page.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join('\n');
const css = `${globalCss}\n${inlineStyles}`;
const failures = [];

function assertContract(condition, message) {
  if (!condition) failures.push(message);
}

function stripComments(source) {
  return source.replace(/<!--([\s\S]*?)-->/g, '').replace(/\/\*([\s\S]*?)\*\//g, '');
}

function getThemeColor(name) {
  const pattern = new RegExp(`--color-${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})\\b`);
  return globalCss.match(pattern)?.[1];
}

function expandHex(hex) {
  const raw = hex.replace('#', '').trim();
  if (raw.length === 3 || raw.length === 4) {
    return raw.slice(0, 3).split('').map((ch) => Number.parseInt(`${ch}${ch}`, 16));
  }
  if (raw.length === 6 || raw.length === 8) {
    return [raw.slice(0, 2), raw.slice(2, 4), raw.slice(4, 6)].map((part) => Number.parseInt(part, 16));
  }
  throw new Error(`Unsupported hex color: ${hex}`);
}

function luminance(hex) {
  return expandHex(hex)
    .map((channel) => channel / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function hasRule(source, selectorPattern, declarationPattern) {
  const rules = stripComments(source).match(/[^{}]+\{[^{}]*\}/g) ?? [];
  return rules.some((rule) => {
    const [selector, declarations = ''] = rule.split('{');
    return selectorPattern.test(selector.trim()) && declarationPattern.test(declarations);
  });
}

function getScriptBody(source) {
  return [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join('\n');
}

function getContactSection(source) {
  return source.match(/<(?:h[1-6])\b[^>]*>\s*Contact\s*<\/(?:h[1-6])>[\s\S]*?<ul\b[^>]*>([\s\S]*?)<\/ul>/i)?.[1] ?? '';
}

const bgColor = getThemeColor('tn-bg');
const outputColor = getThemeColor('tn-output');
const outputContrast = bgColor && outputColor ? contrastRatio(outputColor, bgColor) : 0;
const script = getScriptBody(page);
const contactSection = getContactSection(page);
const contactLinks = [...contactSection.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
const contactLinksHaveTouchClass = contactLinks.length > 0 && contactLinks.every((tag) => /class\s*=\s*["'][^"']*(?:contact-link|touch-target|tap-target|hit-area)[^"']*["']/i.test(tag));
const cssHasTouchRule = hasRule(
  css,
  /(?:\.contact-link|\.touch-target|\.tap-target|\.hit-area|contact[^,{]*a|a\s*)/i,
  /(?:min-(?:height|width)\s*:\s*(?:44px|2\.75rem)|padding(?:-[\w-]+)?\s*:\s*(?:0\.5rem|[1-9]\d*px|[.\d]+em))/i,
);

assertContract(/<main\b/i.test(page), 'Expected homepage to expose a <main> landmark.');
assertContract(/<h1\b/i.test(page), 'Expected homepage to expose one primary <h1>.');
assertContract(/@media[^{}]*prefers-reduced-motion\s*:\s*reduce/i.test(css), 'Expected CSS reduced-motion media query.');
assertContract(
  /@media[^{}]*prefers-reduced-motion\s*:\s*reduce[\s\S]*?(?:animation\s*:\s*none|animation-duration\s*:\s*(?:0(?:\.0+)?m?s|1ms))/i.test(css),
  'Expected reduced-motion CSS to neutralize animations so content is not gated by motion.',
);
assertContract(Boolean(bgColor), 'Expected --color-tn-bg token.');
assertContract(Boolean(outputColor), 'Expected --color-tn-output token.');
assertContract(
  outputContrast >= 4.5,
  `Expected --color-tn-output (${outputColor ?? 'missing'}) contrast on --color-tn-bg (${bgColor ?? 'missing'}) to be >= 4.5, got ${outputContrast.toFixed(2)}.`,
);
assertContract(/:focus-visible/i.test(css), 'Expected visible :focus-visible styles for keyboard focus.');
assertContract(/document\.getElementById\(['"]bad-cmd['"]\)/.test(script), 'Expected cursor script to look up #bad-cmd explicitly.');
assertContract(
  /(?:if\s*\(\s*!\s*el\s*\)|if\s*\(\s*el\s*={0,2}\s*null\s*\)|el\?\.)/.test(script),
  'Expected cursor script to guard a missing #bad-cmd element before mutating textContent.',
);
assertContract(
  /matchMedia\([^)]*prefers-reduced-motion\s*:\s*reduce/i.test(script),
  'Expected cursor script to respect prefers-reduced-motion.',
);
assertContract(
  /(?:document\.visibilityState|document\.hidden|visibilitychange)/.test(script),
  'Expected cursor script to pause or skip work when the document is hidden.',
);
assertContract(contactLinks.length > 0, 'Expected contact links to be present in the Contact section.');
assertContract(
  contactLinksHaveTouchClass || cssHasTouchRule,
  'Expected contact links to declare an enlarged touch target via explicit class or CSS rule.',
);

if (failures.length > 0) {
  console.error(`Homepage verification failed (${failures.length} contract${failures.length === 1 ? '' : 's'}):`);
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Homepage verification passed. Output contrast: ${outputContrast.toFixed(2)}:1.`);
}
