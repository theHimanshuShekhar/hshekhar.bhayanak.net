---
title: "Automating the boring bits"
description: "Why small workflow scripts often beat large productivity systems."
pubDate: 2026-05-24
tags:
  - automation
  - linux
  - workflows
---

The best automation usually starts as irritation, not architecture. A command takes seven steps. A report needs the same cleanup every week. A deployment checklist has one line everyone forgets. That is enough signal to automate.

Small scripts win because they stay close to the work. They do not need a platform name. They need predictable input, honest failure, and a way to be deleted when the process changes.

## Keep the loop short

My favorite workflow tools are boring on purpose: read a file, transform the thing, print exactly what changed, exit with the right code. The operator should never have to wonder whether the tool succeeded.

```sh
run-checks
if [ "$?" -ne 0 ]; then
  echo "stop: evidence missing"
fi
```

## Automation taste

Automate the repeated decision, not the entire job. The goal is not to remove thinking. The goal is to spend thinking on the part that actually changes.
