(function () {
  "use strict";
  var NAV = [
    { href: "index.html", label: "الرئيسية" },
    { href: "shop.html", label: "المتجر" },
    { href: "about.html", label: "من نحن" },
    { href: "faq.html", label: "الأسئلة الشائعة" },
    { href: "contact.html", label: "تواصل معنا" }
  ];

  var SOCIALS = [
    { icon: "facebook-f", label: "فيسبوك", url: "https://www.facebook.com/phoenixKemetegypt" },
    { icon: "instagram", label: "انستجرام", url: "https://www.instagram.com/phoenixkemetofficial/" },
    { icon: "whatsapp", label: "واتساب", url: "https://wa.me/201050166795" }
  ];

  var CONTACT_EMAIL = "phoenixkemetofficial@gmail.com";

  function currentPage() {
    var file = location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  function navLinks() {
    var page = currentPage();
    return NAV.map(function (item) {
      var cls = item.href === page ? ' class="active"' : "";
      return '<a href="' + item.href + '"' + cls + ">" + item.label + "</a>";
    }).join("");
  }

  function renderHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    host.className = "site-header";
    host.innerHTML =
      '<div class="container nav">' +
      '<a class="nav-logo" href="index.html"><img src="images/logo.png" alt="Phoenix Kemet Logo"></a>' +
      '<div class="nav-search"><input type="search" id="global-search" placeholder="ابحث عن منتج..." aria-label="بحث"><button id="global-search-btn" aria-label="بحث"><i class="fas fa-search"></i></button></div>' +
      '<button class="nav-toggle" aria-label="القائمة"><i class="fas fa-bars"></i></button>' +
      '<nav class="nav-links">' + navLinks() + "</nav>" +
      '<div class="nav-actions">' +
      '<button class="icon-btn theme-toggle" aria-label="تبديل الثيم" onclick="PK.toggleTheme()"><i class="fas fa-moon"></i></button>' +
      '<a class="icon-btn" href="wishlist.html" aria-label="المفضلة"><i class="fas fa-heart"></i><span class="wish-badge badge-count">0</span></a>' +
      '<a class="icon-btn" href="cart.html" aria-label="السلة"><i class="fas fa-shopping-bag"></i><span class="cart-badge badge-count">0</span></a>' +
      '</div></div>';
  }

  function renderFooter() {
    var host = document.getElementById("site-footer");
    if (!host) return;

    var links = NAV.map(function (item) {
      return "<li><a href=\"" + item.href + "\">" + item.label + "</a></li>";
    }).join("");

    var contact = [
      '<li><i class="fas fa-phone" style="margin-inline-end:8px;"></i><span dir="ltr">+20 10 50166795</span></li>',
      '<li><i class="fas fa-envelope" style="margin-inline-end:8px;"></i><a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a></li>',
      '<li><i class="fas fa-clock" style="margin-inline-end:8px;"></i>يومياً 9:00 - 18:00</li>'
    ].join("");

    var socials = SOCIALS.map(function (s) {
      return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.label + '" title="' + s.label + '"><i class="fab fa-' + s.icon + '"></i></a>';
    }).join("");

    var policies = [
      { href: "shipping.html", label: "الشحن والتوصيل" },
      { href: "returns.html", label: "الإرجاع والاستبدال" },
      { href: "privacy.html", label: "سياسة الخصوصية" },
      { href: "terms.html", label: "الشروط والأحكام" },
      { href: "faq.html", label: "الأسئلة الشائعة" }
    ].map(function (p) { return "<li><a href=\"" + p.href + "\">" + p.label + "</a></li>"; }).join("");

    host.className = "site-footer";
    host.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      "<div>" +
      '<img class="footer-logo" src="images/logo.png" alt="Phoenix Kemet">' +
      "<p>متجر منتجات مستوحاة من الحضارة المصرية — تسوّق الآن واستلم بسرعة.</p>" +
      '<div class="socials">' + socials + "</div>" +
      '<div class="newsletter">' +
      '<h4>اشترك في النشرة</h4>' +
      '<form id="newsletter-form" class="newsletter-form"><input type="email" placeholder="بريدك الإلكتروني" required><button type="submit" class="btn">اشترك</button></form>' +
      '</div>' +
      "</div>" +
      "<div><h4>روابط سريعة</h4><ul>" + links + "</ul></div>" +
      "<div><h4>السياسات</h4><ul>" + policies + "</ul></div>" +
      "<div><h4>تواصل معنا</h4><ul>" + contact + "</ul></div>" +
      '</div>' +
      '<div class="footer-bottom">' +
      '<p>جميع الحقوق محفوظة © <span class="heart">&#9825;</span> Phoenix Kemet — 2026</p>' +
      '<p class="footer-credit">تصميم وتطوير: <a href="mailto:islam.ashrf.elramady@gmail.com" title="للتواصل بخصوص تصميم المواقع">Islam Ashraf</a></p>' +
      '</div></div>';
  }

  function wireNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("open");
      });
    }
    // search
    var btn = document.getElementById("global-search-btn");
    var input = document.getElementById("global-search");
    function go() {
      var q = (input.value || "").trim();
      location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    }
    if (btn) btn.addEventListener("click", go);
    if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  }

  function wireReveal() {
    window.PK = window.PK || {};
    if (!("IntersectionObserver" in window)) {
      window.PK.revealIn = function (root) {
        (root || document).querySelectorAll(".reveal").forEach(function (el) { el.classList.add("show"); });
      };
      window.PK.revealCheck = window.PK.revealIn;
      window.PK.revealIn();
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    function observeAll(root) {
      (root || document).querySelectorAll(".reveal:not(.show)").forEach(function (el) {
        if (!el.dataset.revealObserved) {
          el.dataset.revealObserved = "1";
          observer.observe(el);
        }
      });
    }

    function checkViewport(root) {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      (root || document).querySelectorAll(".reveal:not(.show)").forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.95 && rect.bottom > 0) el.classList.add("show");
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { checkViewport(); ticking = false; });
    }

    observeAll();
    document.body.classList.add("reveal-ready");
    window.PK = window.PK || {};
    window.PK.revealIn = function (root) { observeAll(root); checkViewport(root); };
    window.PK.revealCheck = checkViewport;

    checkViewport();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Safety net: keep checking briefly after load in case scroll/IO events are missed
    var tries = 0;
    var timer = setInterval(function () {
      checkViewport();
      if (++tries >= 25 || !document.querySelector(".reveal:not(.show)")) clearInterval(timer);
    }, 800);
  }

  function wireForm() {
    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var fields = form.elements;
        var name = (fields.namedItem("name") || {}).value || "";
        name = name.trim();
        var email = ((fields.namedItem("email") || {}).value || "").trim();
        var topic = (fields.namedItem("topic") || {}).value || "";
        var message = ((fields.namedItem("message") || {}).value || "").trim();
        if (!name || !email || !message) {
          var note = document.getElementById("form-note");
          if (note) note.textContent = "من فضلك كمّل الاسم والبريد والرسالة قبل الإرسال.";
          return;
        }
        var text = "👋 رسالة من موقع Phoenix Kemet\n\nالاسم: " + name + "\nالبريد: " + email + "\nالموضوع: " + topic + "\n\nالرسالة:\n" + message;
        window.open("https://wa.me/" + (window.PK && PK.WA_PHONE ? PK.WA_PHONE : "201050166795") + "?text=" + encodeURIComponent(text), "_blank");
        var note = document.getElementById("form-note");
        if (note) note.textContent = "تم فتح واتساب لإرسال رسالتك ✓";
      });
    }
    var nf = document.getElementById("newsletter-form");
    if (nf) {
      nf.addEventListener("submit", function (e) {
        e.preventDefault();
        if (window.PK && PK.toast) PK.toast("شكراً لاشتراكك في النشرة ✓", "success");
        nf.reset();
      });
    }
  }

  renderHeader();
  renderFooter();
  wireNav();
  wireReveal();
  wireForm();

  // Floating WhatsApp button
  var wa = document.createElement("a");
  wa.href = "https://wa.me/" + (window.PK && PK.WA_PHONE ? PK.WA_PHONE : "201050166795");
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.className = "wa-float";
  wa.innerHTML = '<i class="fab fa-whatsapp"></i>';
  wa.setAttribute("aria-label", "واتساب");
  document.body.appendChild(wa);

  if (window.PK) {
    PK.applyTheme();
    PK.updateThemeIcon();
    PK.updateCartBadge();
    PK.updateWishBadge();
  }
})();