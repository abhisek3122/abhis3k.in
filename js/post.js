/* Single writing page (blog/<slug>/index.html). Renders ./index.md.
   Title/subtitle/date come from ../index.json (falls back to the markdown).
   Images use bare filenames and resolve to this folder automatically. */
(function () {
  var content = document.getElementById("content");

  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Build an in-page Table of Contents from the post's headings.
  function buildTOC() {
    var article = content.querySelector(".markdown");
    if (!article) return;
    var hs = article.querySelectorAll("h2, h3, h4");
    if (hs.length < 3) return; // not worth a ToC for short posts

    // Use the shallowest heading level present as the ToC's top level.
    var minLevel = 6;
    hs.forEach(function (h) { minLevel = Math.min(minLevel, +h.tagName[1]); });

    var used = {};
    var items = [];
    hs.forEach(function (h) {
      var text = h.textContent.trim();
      if (!text) return;
      var id = text.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
      if (used[id]) id += "-" + (used[id]++); else used[id] = 1;
      h.id = id;
      items.push({ id: id, text: text, level: +h.tagName[1] - minLevel });
    });

    var nav = document.createElement("nav");
    nav.className = "toc";
    nav.innerHTML =
      '<div class="toc-title">Contents</div>' +
      items.map(function (it) {
        return '<a class="toc-l' + it.level + '" href="#' + it.id + '">' + esc(it.text) + "</a>";
      }).join("");

    var head = content.querySelector(".note-head");
    head.parentNode.insertBefore(nav, head.nextSibling);
  }

  var parts = location.pathname.replace(/\/+$/, "").split("/");
  var slug = decodeURIComponent(parts[parts.length - 1] || "");

  var metaPromise = fetch("../index.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (list) {
      return list.filter(function (p) { return p.slug === slug; })[0] || null;
    })
    .catch(function () { return null; });

  var mdPromise = fetch("index.md", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw 0; return r.text(); });

  Promise.all([metaPromise, mdPromise]).then(function (res) {
    var meta = res[0], md = res[1];

    var titleFromMd = (md.match(/^\s*#\s+(.+)$/m) || [])[1];
    var subFromMd = (md.match(/subtitle:\s*(.+?)\s*(?:-->|\r?\n|$)/) || [])[1];
    var dateFromMd = (md.match(/date:\s*(\d{4}-\d{2}-\d{2})/) || [])[1];

    var title = (meta && meta.title) || (titleFromMd && titleFromMd.trim()) || slug;
    var subtitle = (meta && meta.subtitle) || (subFromMd && subFromMd.trim()) || "";
    var date = (meta && meta.date) || dateFromMd || "";

    document.title = title + " — Writings";

    var body = md
      .replace(/^\s*(<!--[\s\S]*?-->\s*)+/, "")  // drop leading comments (date/subtitle)
      .replace(/^\s*#\s+.*(\r?\n)+/, "");         // drop leading H1 (shown in header)

    content.innerHTML =
      '<div class="note-head"><h1>' + esc(title) + "</h1>" +
      (subtitle ? '<div class="subtitle">' + esc(subtitle) + "</div>" : "") +
      (date ? '<div class="date">' + esc(fmtDate(date)) + "</div>" : "") +
      "</div>" +
      '<article class="markdown">' + marked.parse(body) + "</article>" +
      '<p style="margin-top:40px"><a class="note-date" href="../">← all writings</a></p>';

    buildTOC();
  }).catch(function () {
    content.innerHTML = '<p class="empty">Could not load this writing. <a href="../">Back to writings</a></p>';
  });
})();
