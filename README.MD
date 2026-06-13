# Personal site

Static personal homepage + notes. Pure HTML/CSS/JS — no build step, no server. Hostable on GitHub Pages as-is.

## Structure

```
index.html               Homepage (renders from config.js)
config.js                ← EDIT: name, bio, links, footer, bio-toggle label
css/style.css            Dark theme (Roboto Mono)
js/home.js               Homepage renderer + bio toggle
js/notes-list.js         Renders the notes list (notes/index.html)
js/note.js               Renders a single note (notes/<slug>/index.html)
lib/marked.min.js        Markdown parser (vendored, MIT)
build-notes.mjs          Regenerates index.json + per-note index.html stubs
notes/index.html         Notes list page  ->  URL: /notes/
notes/index.json         Auto-generated list of notes (slug, title, date)
notes/<slug>/index.md    ← one folder per note, markdown lives here
notes/<slug>/index.html  Auto-generated stub  ->  URL: /notes/<slug>/
notes/<slug>/*.jpg       ← images for that note live in the same folder
.nojekyll                Tells GitHub Pages to serve files as-is
```

## URLs
- Notes list: `/notes/`
- A single note: `/notes/<slug>/`  (the `<slug>` is the folder name)

These are real folders with real `index.html` files, so the URLs refresh and
share correctly with no server and no `#` hacks.

## Edit the homepage (`config.js`)
This is the ONLY file you edit for the homepage. Inside it:
- `profile.name` / `profile.bio` → shown on the left.
- `links[]` → the sections on the right. Each is one object — add, remove, reorder.
  Set `external: true` for outbound links (new tab + ↗). Your **Blog** link just
  points to wherever your blog is already hosted.
- `footer` → the line at the bottom.

## Add a note (each note = its own folder, can hold images)
A static site can't auto-scan folders, so the notes page reads a manifest
(`notes/index.json`). The generator script keeps it in sync — you never edit it by hand.

1. **Make a folder** for the note: `notes/my-slug/`
   (`my-slug` becomes the URL: `/notes/my-slug/` — use lowercase, hyphens.)
2. **Write** `notes/my-slug/index.md`:
   ```markdown
   <!-- date: 2026-06-13 -->
   # My title

   Body text…

   ![alt text](photo.jpg)
   ```
   - First `#` heading = the note's title (and is auto-hidden in the body).
   - `<!-- date: YYYY-MM-DD -->` is optional; without it the file's
     last-modified date is used. Newest sorts to the top.
3. **Add images** by dropping them straight into `notes/my-slug/` and referencing
   them with a bare filename — `![](photo.jpg)`, not a path. They resolve inside
   the folder automatically. (Use `subdir/pic.jpg` if you nest them.)
4. **Regenerate** the manifest:
   ```
   node build-notes.mjs
   ```
5. **Commit and push.**

Example layout for a note with images:
```
notes/
  my-trip/
    index.md
    sunrise.jpg
    map.png
```

## Run locally
Browsers block `fetch()` on `file://`, so use a tiny server:
```
python3 -m http.server 8000
```
Then open http://localhost:8000

## Deploy (GitHub Pages)
Push to a repo → Settings → Pages → deploy from branch (root). Done. No build runs
on GitHub's side — it just serves the files. (`.nojekyll` guarantees that.)
