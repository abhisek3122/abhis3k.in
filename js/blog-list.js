/* Writings list page (blog/index.html): titles + subtitles + dates from index.json. */
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

  fetch("index.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (posts) {
      posts.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!posts.length) { content.innerHTML = '<p class="empty">Nothing here yet.</p>'; return; }
      content.innerHTML = '<div class="note-list">' + posts.map(function (p) {
        return '<a class="note-item post-item" href="' + encodeURIComponent(p.slug) + '/">' +
          '<span class="note-main">' +
            '<span class="note-title">' + esc(p.title) + "</span>" +
            (p.subtitle ? '<span class="post-sub">' + esc(p.subtitle) + "</span>" : "") +
          "</span>" +
          '<span class="note-date">' + esc(fmtDate(p.date)) + "</span></a>";
      }).join("") + "</div>";
    })
    .catch(function () { content.innerHTML = '<p class="empty">Could not load writings.</p>'; });
})();
