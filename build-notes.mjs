#!/usr/bin/env node
/* Regenerates notes/index.json by scanning the notes/ folder.
 *
 *   node build-notes.mjs
 *
 * Each note is a folder: notes/<slug>/index.md  (+ any images alongside it).
 * For each one it reads:
 *   - title: the first "# Heading" line (falls back to the slug)
 *   - date:  a "date: YYYY-MM-DD" line anywhere (e.g. inside an HTML comment
 *            like <!-- date: 2026-05-28 -->), otherwise the file's mtime.
 * Notes are sorted newest-first. No dependencies, pure Node.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "notes");

const notes = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "index.md")))
  .map((d) => {
    const slug = d.name;
    const file = join(dir, slug, "index.md");
    const raw = readFileSync(file, "utf8");

    const titleMatch = raw.match(/^\s*#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : slug;

    const dateMatch = raw.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch
      ? dateMatch[1]
      : statSync(file).mtime.toISOString().slice(0, 10);

    return { slug, title, date };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

writeFileSync(join(dir, "index.json"), JSON.stringify(notes, null, 2) + "\n");

// Each note folder gets a tiny index.html so /notes/<slug>/ is a real URL.
// It's identical for every note (it figures out its own slug from the path),
// so we just (re)write it into every folder. Never edit these by hand.
const STUB = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Note</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../css/style.css" />
</head>
<body>
  <main class="wrap">
    <nav class="subnav">
      <h1>notes</h1>
      <span class="sep">/</span>
      <a href="../">all notes</a>
      <span class="sep">/</span>
      <a href="../../">home</a>
    </nav>
    <div id="content"><p class="empty">Loading…</p></div>
  </main>
  <script src="../../lib/marked.min.js"></script>
  <script src="../../js/note.js"></script>
</body>
</html>
`;
for (const n of notes) writeFileSync(join(dir, n.slug, "index.html"), STUB);

console.log(`Wrote ${notes.length} note(s) to notes/index.json (+ per-note index.html)`);
notes.forEach((n) => console.log(`  ${n.date}  ${n.slug}  —  ${n.title}`));
