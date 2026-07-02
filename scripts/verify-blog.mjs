import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = path => readFileSync(join(root, path), 'utf8');

function assertIncludes(path, expected, message) {
  assert.ok(existsSync(join(root, path)), `${path} should exist`);
  assert.ok(read(path).includes(expected), message ?? `${path} should include ${expected}`);
}

assertIncludes('src/content.config.ts', "defineCollection", 'blog content collection should be configured');
assertIncludes('src/content.config.ts', "blog", 'blog collection should be named blog');
assertIncludes('src/content.config.ts', "loader: glob", 'Astro 6 content collections should use an explicit glob loader');
assert.ok(!read('src/content.config.ts').includes("type: 'content'"), 'Astro 6 content collections should not use legacy type fields');
assertIncludes('src/pages/blog/index.astro', "getCollection('blog'", 'blog index should read Markdown posts from the blog collection');
assertIncludes('src/pages/blog/[slug].astro', "getStaticPaths", 'post route should statically generate blog slugs');
assert.ok(!read('src/pages/blog/index.astro').includes('post.slug'), 'blog index should use Astro 6 content entry ids, not legacy slugs');
assert.ok(!read('src/pages/blog/[slug].astro').includes('post.slug'), 'blog post route should use Astro 6 content entry ids, not legacy slugs');
assertIncludes('src/pages/blog/index.astro', "toISOString().slice(0, 10)", 'blog index should render dates in terminal-friendly YYYY-MM-DD format');
assertIncludes('src/pages/index.astro', "href=\"/blog/\"", 'home page should link to the blog');
assertIncludes('src/styles/global.css', '.command-label', 'shared command-label styling should be available outside the homepage');
assertIncludes('src/pages/index.astro', 'class="blog-link"', 'homepage blog link should use a touch-sized link class');

const postsDir = join(root, 'src/content/blog');
assert.ok(existsSync(postsDir), 'src/content/blog should exist');
const posts = readdirSync(postsDir).filter(file => file.endsWith('.md'));
assert.ok(posts.length >= 2, 'blog should include at least two Markdown posts for realistic index states');
const postSources = posts.map(post => read(join('src/content/blog', post)));
assert.ok(postSources.some(source => source.includes('title: "HomeLab Setup Documentation"')), 'blog should include the HomeLab setup stub');
assert.ok(postSources.some(source => source.includes('title: "My Journey switching AI Harnesses"')), 'blog should include the AI harnesses journey stub');


for (const post of posts) {
  const source = read(join('src/content/blog', post));
  assert.match(source, /^title: .+/m, `${post} should define a title`);
  assert.match(source, /^description: .+/m, `${post} should define a description`);
  assert.match(source, /^pubDate: .+/m, `${post} should define a pubDate`);
  assert.match(source, /^tags:/m, `${post} should define tags`);
  assert.match(source, /^## /m, `${post} should include section headings for article typography`);
}

console.log(`Verified blog surface with ${posts.length} Markdown posts.`);
