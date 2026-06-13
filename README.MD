# Personal site

A tiny static personal site: a homepage plus two content sections — **notes**
(informal) and **writings** (technical, with subtitles). Pure HTML/CSS/JS, no server,
no framework, no build pipeline beyond one little Node script. Hostable on GitHub Pages
as-is.

> **Found this and want it for yourself?** Feel free to take it — it's a few HTML files
> and some vanilla JS, not rocket science. Swap the content in `config.js` and the
> `notes/` + `blog/` folders, change the colors in `css/style.css`, and it's yours. No
> attribution needed, though I won't stop you from telling people a donut 🍩 led you here.

## How it works (the 30-second version)
- **No backend.** Every page is a static file. A bit of vanilla JS reads small JSON
  manifests and renders Markdown in the browser with [marked.js](https://marked.js.org/)
  (vendored in `lib/`, so nothing is fetched from a CDN at runtime).
- **Content is just folders.** Each note/post is a folder with an `index.md` and any
  images beside it. `build.mjs` scans those folders and regenerates the manifests plus a
  tiny `index.html` per item (so URLs like `/blog/my-post/` are real, refreshable links).
- **You edit Markdown and one config file.** That's the whole authoring loop:
  write `index.md` → `node build.mjs` → push.

## Structure

```
index.html               Homepage (renders from config.js)
config.js                ← EDIT: name, bio, links, footer, bio-toggle label
css/style.css            Shared dark theme (Roboto Mono) — used by everything
js/home.js               Homepage renderer + bio toggle
js/lightbox.js           Click-to-zoom for images in notes/posts
lib/marked.min.js        Markdown parser (vendored, MIT)
build.mjs                Regenerates index.json + per-item index.html for BOTH sections

notes/  — informal notes                     blog/   — technical writings
  js: js/notes-list.js, js/note.js             js: js/blog-list.js, js/post.js
  index.html      list page  ->  /notes/       index.html      list page  ->  /blog/
  index.json      auto-generated manifest      index.json      auto-generated manifest
  <slug>/index.md      ← your markdown         <slug>/index.md      ← your markdown
  <slug>/index.html    auto-generated stub     <slug>/index.html    auto-generated stub
  <slug>/*.png|jpg     ← images here           <slug>/*.png|jpg     ← images here

.nojekyll                Tells GitHub Pages to serve files as-is
CNAME                    Custom domain (do not delete)
```

The two sections share the same theme and the same machinery, but live in separate
folders with separate JS so they're easy to manage independently. **notes** = casual
journal entries; **blog/writings** = technical posts that also carry a subtitle.

## Built-in niceties (all automatic)
- **Share previews** — `build.mjs` bakes Open Graph + Twitter meta into every
  post/note page (title, an auto-excerpt description, and the first image as the
  card). Absolute URLs come from `CNAME`.
- **Table of Contents** — posts with 3+ headings get an auto ToC at the top that
  links to each section. Nothing to maintain; it reads your headings.
- **Click-to-zoom** — any image in a note/post opens a lightbox on click
  (Esc or click to close).

## URLs
- Notes:    list `/notes/`  ·  a note  `/notes/<slug>/`
- Writings: list `/blog/`   ·  a post  `/blog/<slug>/`

These are real folders with real `index.html` files, so the URLs refresh and
share correctly with no server and no `#` hacks.

## Edit the homepage (`config.js`)
This is the ONLY file you edit for the homepage. Inside it:
- `profile.name` / `profile.bio` → shown on the left.
- `links[]` → the sections on the right. Each is one object — add, remove, reorder.
  Set `external: true` for outbound links (new tab + ↗). **Notes** points to `notes/`
  and **Blog** points to `blog/` (both internal).
- `footer` → the line at the bottom.

## Add a note or a writing (each is its own folder, can hold images)
A static site can't auto-scan folders, so each section reads a manifest
(`<section>/index.json`). `build.mjs` keeps both in sync — you never edit them by hand.

1. **Make a folder** under the section you want:
   - a note     → `notes/my-slug/`   (URL becomes `/notes/my-slug/`)
   - a writing  → `blog/my-slug/`    (URL becomes `/blog/my-slug/`)
   Use lowercase + hyphens for the slug.
2. **Write** `index.md` inside it:
   ```markdown
   <!-- date: 2026-06-13 -->
   <!-- subtitle: a short one-line tagline -->
   # My title

   Body text…

   ![alt text](photo.jpg)
   ```
   - First `#` heading = the title (auto-hidden in the body).
   - `<!-- subtitle: ... -->` is shown under the title. It's mainly for **writings**;
     notes can skip it.
   - `<!-- date: YYYY-MM-DD -->` is optional; without it the file's last-modified
     date is used. Newest sorts to the top.
3. **Add images** by dropping them into the same folder and referencing them with a
   bare filename — `![](photo.jpg)`, not a path. (Use `subdir/pic.jpg` if nested.)
4. **Regenerate** both manifests:
   ```
   node build.mjs
   ```
5. **Commit and push.**

Example layout for a writing with images:
```
blog/
  exploring-oauth/
    index.md
    flow-diagram.png
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
