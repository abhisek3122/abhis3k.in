<!--
  ┌─────────────────────────────────────────────────────────────────┐
  │  BLOG / WRITING TEMPLATE — copy this folder, don't edit in place. │
  └─────────────────────────────────────────────────────────────────┘

  BEFORE PUBLISHING — checklist:
   1. Copy this whole folder into  blog/<your-slug>/
        (slug = lowercase-with-hyphens; it becomes the URL /blog/<your-slug>/)
   2. Set the date below (or delete the line to use today's file date).
   3. Set the subtitle — it shows under the title AND becomes the search/
      share-preview tagline. Keep it short.
   4. Replace the "# Title" line with your real title.
   5. Write your content. Drop images INTO this folder and reference them by
      bare filename:  ![alt](diagram.png)  (no paths). Images auto-center and
      are click-to-zoom. The FIRST image becomes the social share-card image.
   6. Use ## / ### headings for sections — 3+ headings auto-build a Table of
      Contents at the top of the post.
   7. From the project root run:   node build.mjs
   8. Preview locally:             python3 -m http.server 8000
        → open  http://localhost:8000/blog/<your-slug>/
        → check: ToC, images centered + zoomable, subtitle under title.
   9. Looks good? Commit + copy the site over and push.

  Tip: keep it em-dash-free if you want to match the site's style.
-->

<!-- date: 2026-01-01 -->
<!-- subtitle: a short one-line tagline for this post -->
# Title of the writing

A short intro paragraph that sets up what this post is about. This first
paragraph also becomes the share-preview description, so make it count.

## Section one

Explain something. Use `inline code` for commands and identifiers.

```bash
# fenced code blocks render in a dark panel
curl -s https://example.com/api | jq .
```

## Section two

- a point
- another point

> A callout or quote.

![describe the diagram](diagram.png)

## Conclusion

Wrap it up.
