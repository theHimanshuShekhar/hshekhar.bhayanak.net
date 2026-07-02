---
title: "Grilling agent harnesses"
description: "Notes from poking at coding agents until the seams show."
pubDate: 2026-07-01
tags:
  - agents
  - tooling
  - workflows
---

A good agent harness should feel boring in the places where work is expensive: file reads, test runs, edits, and verification. The interesting part is not the chat box. The interesting part is whether the harness keeps enough state, gives the model sharp tools, and refuses to let a plausible answer outrun evidence.

## What I prod first

I start with the boring loop: ask it to find a route, change one behavior, run the narrowest check, and explain what actually changed. Weak harnesses drift here. They read too much, edit too broadly, or declare victory after a command they did not inspect.

Strong harnesses make the right thing cheaper than the clever thing. Search is structured. Edits are anchored. Tests are visible. The model can still be wrong, but the workflow keeps the mistake close to the source.

## The useful seams

The most useful failures are not hallucinations. They are coordination failures: stale file context, over-wide patches, ambiguous ownership between agents, and tests that pass without covering the behavior. Those seams tell you where the harness needs guardrails instead of another prompt paragraph.

```ts
const usefulHarness = {
  reads: 'grounded',
  edits: 'anchored',
  checks: 'fresh',
  claims: 'evidence-first',
};
```

## The bar

If the harness makes it easier to verify than to bluff, it is doing real engineering work. Everything else is interface theater.
