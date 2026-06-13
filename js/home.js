/* Renders the homepage from config.js (window.SITE). */
(function () {
  var S = window.SITE || { profile: {}, links: [] };

  document.getElementById("name").textContent = S.profile.name || "";
  document.getElementById("bioText").textContent = S.profile.bio || "";
  document.title = S.profile.name || "Home";

  var contact = document.getElementById("contact");
  if (S.contactEmail) {
    contact.appendChild(document.createTextNode("Feel free to reach out at "));
    var mail = document.createElement("a");
    mail.href = "mailto:" + S.contactEmail;
    mail.textContent = S.contactEmail;
    contact.appendChild(mail);
  } else {
    contact.remove();
  }

  // Bio toggle: open by default on wide screens, closed on small ones.
  var bio = document.getElementById("bio");
  var toggle = document.getElementById("bioToggle");
  var label = S.bioToggle || "bio";
  function setBio(open) {
    bio.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = (open ? "▾ " : "▸ ") + label;
  }
  setBio(window.matchMedia("(min-width: 720px)").matches);
  toggle.addEventListener("click", function () {
    setBio(bio.classList.contains("hidden"));
  });

  var wrap = document.getElementById("links");
  (S.links || []).forEach(function (l) {
    var a = document.createElement("a");
    a.className = "link";
    a.href = l.url || "#";
    if (l.external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }

    var t = document.createElement("span");
    t.className = "title";
    t.textContent = l.title || "";
    if (l.external) {
      var arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "↗";
      t.appendChild(arrow);
    }
    a.appendChild(t);

    if (l.subtitle) {
      var s = document.createElement("span");
      s.className = "subtitle";
      s.textContent = l.subtitle;
      a.appendChild(s);
    }

    wrap.appendChild(a);
  });

  var year = new Date().getFullYear();
  var credit = S.footer || ("© " + year + " " + (S.profile.name || ""));
  document.getElementById("footer").textContent = "© " + year + " — " + credit;
})();
