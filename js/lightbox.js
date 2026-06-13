/* Click-to-zoom for images inside rendered markdown.
   Pure JS/CSS, no dependencies. Uses event delegation so it works on
   images that are injected after load (notes/posts render client-side). */
(function () {
  var overlay = null;

  function close() {
    if (!overlay) return;
    overlay.classList.remove("open");
    var el = overlay;
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 180);
    overlay = null;
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) { if (e.key === "Escape") close(); }

  function open(src, alt) {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    // next frame -> trigger fade/scale transition
    requestAnimationFrame(function () { overlay.classList.add("open"); });
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.closest && t.closest(".markdown")) {
      open(t.currentSrc || t.src, t.alt);
    }
  });
})();
