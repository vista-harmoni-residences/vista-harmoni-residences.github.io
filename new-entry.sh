#!/usr/bin/env bash
# Creates a new expedition log in _posts/ dated today.
#   ./new-entry.sh "The Mystery of the Garden Gate"
set -euo pipefail
cd "$(dirname "$0")"

if [ $# -lt 1 ]; then
  echo 'Usage: ./new-entry.sh "Title of the expedition"' >&2
  exit 1
fi

title="$*"
day=$(date +%Y-%m-%d)
slug=$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')
file="_posts/${day}-${slug}.md"

if [ -e "$file" ]; then
  echo "Already exists: $file" >&2
  exit 1
fi

cat > "$file" <<ENTRY
---
title: "${title//\"/\\\"}"
date: ${day}
location: ""
description: ""
tags: []
cover: ""
---

Write the story of the expedition here.

{% include media.html file="your-photo.jpg" caption="What we found" %}
ENTRY

echo "Created $file"
