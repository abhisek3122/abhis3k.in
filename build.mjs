#!/usr/bin/env node
/* Regenerates the index.json + per-item index.html stubs for each section.
 *
 *   node build.mjs
 *
 * Sections (each is a top-level folder of <slug>/index.md folders):
 *   - notes/  → informal notes        (renderer: js/note.js)
 *   - blog/   → technical writings     (renderer: js/post.js)
 *
 * For each <slug>/index.md it reads:
 *   - title:    first "# Heading" line (falls back to the slug)
 *   - subtitle: a "subtitle: ..." line, e.g. <!-- subtitle: a short tagline -->
 *   - date:     a "date: YYYY-MM-DD" line, otherwise the file's mtime.
 * It also derives a description excerpt + first image, and bakes per-item
 * Open Graph / Twitter meta tags into each generated index.html so shared
 * links show proper previews. Items are sorted newest-first. Pure Node.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

// Site origin for absolute URLs (from CNAME). Empty => relative-only.
const domain = existsSync(join(root, "CNAME"))
  ? readFileSync(join(root, "CNAME"), "utf8").trim()
  : "";
const ORIGIN = domain ? `https://${domain}` : "";

const escAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
           .replace(/</g, "&lt;").replace(/>/g, "&gt;");

function excerpt(body) {
  let t = body
    .replace(/^\s*(<!--[\s\S]*?-->\s*)+/, "")
    .replace(/^\s*#\s+.*(\r?\n)+/, "");
  let para = "";
  for (const ln of t.split(/\r?\n/)) {
    const s = ln.trim();
    const skip = !s || /^(#{1,6}\s|!\[|>|\||```|<|[-*+]\s|\d+\.\s)/.test(s);
    if (skip) { if (para) break; else continue; }
    para += (para ? " " : "") + s;
    if (para.length > 180) break;
  }
  para = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (para.length > 160) para = para.slice(0, 157).replace(/\s+\S*$/, "") + "…";
  return para;
}

function stub({ dir, plural, heading, script, slug, title, description, image }) {
  const url = ORIGIN ? `${ORIGIN}/${dir}/${slug}/` : "";
  const imgUrl = image && ORIGIN ? `${ORIGIN}/${dir}/${slug}/${image}` : "";
  const og = [
    `<meta name="description" content="${escAttr(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escAttr(title)}" />`,
    `<meta property="og:description" content="${escAttr(description)}" />`,
    url ? `<meta property="og:url" content="${escAttr(url)}" />` : "",
    imgUrl ? `<meta property="og:image" content="${escAttr(imgUrl)}" />` : "",
    `<meta name="twitter:card" content="${imgUrl ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escAttr(title)}" />`,
    `<meta name="twitter:description" content="${escAttr(description)}" />`,
    imgUrl ? `<meta name="twitter:image" content="${escAttr(imgUrl)}" />` : "",
  ].filter(Boolean).join("\n  ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escAttr(title)}</title>
  ${og}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../css/style.css" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</head>
<body>
  <main class="wrap">
    <nav class="subnav">
      <h1>${heading}</h1>
      <span class="sep">/</span>
      <a href="../">all ${plural}</a>
      <span class="sep">/</span>
      <a href="../../">home</a>
    </nav>
    <div id="content"><p class="empty">Loading…</p></div>
  </main>
  <script src="../../lib/marked.min.js"></script>
  <script src="../../js/${script}"></script>
  <script src="../../js/lightbox.js"></script>
</body>
</html>
`;
}

function buildSection({ dir, plural, heading, script }) {
  const base = join(root, dir);
  if (!existsSync(base)) { console.log(`(skipping ${dir}/ — folder not found)`); return; }

  const items = readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(base, d.name, "index.md")))
    .map((d) => {
      const slug = d.name;
      const raw = readFileSync(join(base, slug, "index.md"), "utf8");

      const title = (raw.match(/^\s*#\s+(.+)$/m) || [])[1]?.trim() || slug;
      const subtitle = (raw.match(/subtitle:\s*(.+?)\s*(?:-->|\r?\n|$)/) || [])[1]?.trim();
      const dateM = raw.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
      const date = dateM ? dateM[1] : statSync(join(base, slug, "index.md")).mtime.toISOString().slice(0, 10);
      const image = (raw.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1];
      const description = excerpt(raw) || subtitle || title;

      const entry = { slug, title, date };
      if (subtitle) entry.subtitle = subtitle;
      return { entry, slug, title, description, image };
    })
    .sort((a, b) => (a.entry.date < b.entry.date ? 1 : -1));

  writeFileSync(join(base, "index.json"), JSON.stringify(items.map((i) => i.entry), null, 2) + "\n");
  for (const it of items) {
    writeFileSync(
      join(base, it.slug, "index.html"),
      stub({ dir, plural, heading, script, slug: it.slug, title: it.title, description: it.description, image: it.image })
    );
  }

  console.log(`${dir}/: ${items.length} item(s) → ${dir}/index.json (+ per-item index.html w/ share meta)`);
  items.forEach((i) => console.log(`  ${i.entry.date}  ${i.slug}  —  ${i.title}`));
}

buildSection({ dir: "notes", plural: "notes", heading: "notes", script: "note.js" });
buildSection({ dir: "blog", plural: "writings", heading: "technical writings", script: "post.js" });
