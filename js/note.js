/* Single-note page (notes/<slug>/index.html). Renders ./index.md.
   Title/date come from ../index.json (falls back to the markdown itself).
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

  // slug = the folder name, e.g. /notes/my-slug/ -> "my-slug"
  var parts = location.pathname.replace(/\/+$/, "").split("/");
  var slug = decodeURIComponent(parts[parts.length - 1] || "");

  var metaPromise = fetch("../index.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (list) {
      return list.filter(function (n) { return n.slug === slug; })[0] || null;
    })
    .catch(function () { return null; });

  var mdPromise = fetch("index.md", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw 0; return r.text(); });

  Promise.all([metaPromise, mdPromise]).then(function (res) {
    var meta = res[0], md = res[1];

    var titleFromMd = (md.match(/^\s*#\s+(.+)$/m) || [])[1];
    var dateFromMd = (md.match(/date:\s*(\d{4}-\d{2}-\d{2})/) || [])[1];
    var title = (meta && meta.title) || (titleFromMd && titleFromMd.trim()) || slug;
    var date = (meta && meta.date) || dateFromMd || "";

    document.title = title + " — Notes";

    var body = md
      .replace(/^\s*(<!--[\s\S]*?-->\s*)+/, "")  // drop leading comments (date)
      .replace(/^\s*#\s+.*(\r?\n)+/, "");         // drop leading H1 (shown in header)

    content.innerHTML =
      '<div class="note-head"><h1>' + esc(title) + "</h1>" +
      (date ? '<div class="date">' + esc(fmtDate(date)) + "</div>" : "") +
      "</div>" +
      '<article class="markdown">' + marked.parse(body) + "</article>" +
      '<p style="margin-top:40px"><a class="note-date" href="../">← all notes</a></p>';
  }).catch(function () {
    content.innerHTML = '<p class="empty">Could not load this note. <a href="../">Back to notes</a></p>';
  });
})();
