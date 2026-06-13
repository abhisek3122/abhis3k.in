/* Notes list page (notes/index.html): renders titles + dates from index.json. */
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
    .then(function (notes) {
      notes.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!notes.length) { content.innerHTML = '<p class="empty">No notes yet.</p>'; return; }
      content.innerHTML = '<div class="note-list">' + notes.map(function (n) {
        return '<a class="note-item" href="' + encodeURIComponent(n.slug) + '/">' +
          '<span class="note-title">' + esc(n.title) + "</span>" +
          '<span class="note-date">' + esc(fmtDate(n.date)) + "</span></a>";
      }).join("") + "</div>";
    })
    .catch(function () { content.innerHTML = '<p class="empty">Could not load notes.</p>'; });
})();
