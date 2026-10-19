(function () {
  "use strict";
  function init() {
    if (!window.PK || !window.PK.PRODUCTS) { setTimeout(init, 50); return; }
    var PK = window.PK;
    var products = PK.PRODUCTS;
    var cats = PK.CATEGORIES;

    // stat
    var sp = document.getElementById("stat-products");
    if (sp) sp.textContent = products.length;

    // categories
    var catHost = document.getElementById("home-cats");
    if (catHost) {
      var icons = { "الديكور والهدايا": "fa-palette", "ملابس ورفعات": "fa-tshirt", "تذكارية": "fa-landmark", "إكسسوارات": "fa-gem", "قرطاسية": "fa-pen", "هدايا": "fa-gift" };
      var counts = {};
      products.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
      catHost.innerHTML = cats.filter(function (c) { return c.key !== "all"; }).map(function (c) {
        return '<div class="cat-card reveal" onclick="location.href=\'shop.html?cat=' + encodeURIComponent(c.key) + '\'">' +
          '<i class="fas ' + (icons[c.key] || "fa-tag") + '"></i>' +
          '<h3>' + PK.escapeHtml(c.label) + '</h3>' +
          '<p style="color:var(--clay);font-size:0.85rem;">' + (counts[c.key] || 0) + ' منتج</p>' +
          '</div>';
      }).join("");
      if (PK.revealIn) PK.revealIn(catHost);
    }

    // featured
    var fg = document.getElementById("featured-grid");
    if (fg) {
      var featured = products.filter(function (p) { return p.featured; }).slice(0, 6);
      fg.innerHTML = featured.map(cardHtml).join("");
      wireCards(fg);
      if (PK.revealIn) PK.revealIn(fg);
    }

    // testimonials
    var th = document.getElementById("testimonials");
    if (th) {
      var t = [
        { q: "منتجات رائعة وخدمة واتساب سريعة. أنصح بشدة!", a: "أحمد — بغداد" },
        { q: "القناع (يوزيد) مكتمل جميل جداً، جودة عالية.", a: "سارة — البصرة" },
        { q: "قميص فينكس مريح والطبعة واضحة. سأطلب مرة أخرى.", a: "محمد — أربيل" }
      ];
      th.innerHTML = t.map(function (x) {
        return '<div class="testimonial reveal"><div class="stars">★★★★★</div><p class="quote">"' + PK.escapeHtml(x.q) + '"</p><div class="author">' + PK.escapeHtml(x.a) + '</div></div>';
      }).join("");
      if (PK.revealIn) PK.revealIn(th);
    }
  }

  function cardHtml(p) {
    var PK = window.PK;
    var wish = PK.isWished(p.id) ? "fas" : "far";
    var stockTxt = p.stock <= 5 ? '<span class="pro-stock low">متبقي ' + p.stock + '</span>' : '<span class="pro-stock">متوفر</span>';
    return '<div class="product reveal" data-id="' + p.id + '">' +
      '<div class="product-img">' + PK.imgOrIcon(p) + (p.featured ? '<span class="badge-new">مميز</span>' : '') + '</div>' +
      '<div class="product-body">' +
      '<h3>' + PK.escapeHtml(p.name) + '</h3>' +
      '<p>' + PK.escapeHtml(p.desc) + '</p>' +
      '<div class="pro-rating"><span class="stars">' + stars(p.rating) + '</span> <small>(' + p.reviews + ')</small></div>' +
      '<div class="price">' + PK.formatPrice(p.price) + '</div>' +
      stockTxt +
      '<div class="pro-actions-inline">' +
      '<button class="pro-view" data-action="view" data-id="' + p.id + '"><i class="fas fa-eye"></i> عرض سريع</button>' +
      '<button class="pro-add" data-action="add" data-id="' + p.id + '"><i class="fas fa-cart-plus"></i> أضف للسلة</button>' +
      '<button class="pro-wish" data-action="wish" data-id="' + p.id + '" aria-label="مفضلة"><i class="' + wish + ' fa-heart"></i></button>' +
      '</div></div></div>';
  }

  function stars(r) {
    var full = Math.floor(r);
    var half = r - full >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  }

  function wireCards(host) {
    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) {
        var card = e.target.closest(".product");
        if (card && card.dataset.id) { location.href = "product.html?id=" + card.dataset.id; }
        return;
      }
      var action = btn.dataset.action;
      var id = Number(btn.dataset.id);
      var p = PK.getProduct(id);
      if (action === "add") { PK.addToCart(p, 1, "—"); }
      else if (action === "wish") {
        var wished = PK.toggleWish(id);
        btn.querySelector("i").className = (wished ? "fas" : "far") + " fa-heart";
      } else if (action === "view") {
        openQuickView(p);
      }
    });
  }

  function openQuickView(p) {
    var modal = document.getElementById("quickview-modal");
    var content = document.getElementById("qv-content");
    if (!modal || !content) return;
    content.innerHTML = '<div class="qv-grid">' +
      '<div class="qv-img">' + PK.imgOrIcon(p) + '</div>' +
      '<div>' +
      '<h2 style="color:var(--green);">' + PK.escapeHtml(p.name) + '</h2>' +
      '<div class="pro-rating"><span class="stars">' + stars(p.rating) + '</span> <small>(' + p.reviews + ' تقييم)</small></div>' +
      '<div style="font-size:1.6rem;font-weight:800;color:var(--green);margin:10px 0;">' + PK.formatPrice(p.price) + '</div>' +
      '<p style="color:var(--clay);">' + PK.escapeHtml(p.desc) + '</p>' +
      '<div style="margin:14px 0;"><label>الكمية: </label><div class="qty-stepper"><button onclick="qvQty(-1)">−</button><span id="qv-qty">1</span><button onclick="qvQty(1)">+</button></div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">' +
      '<button class="btn" onclick="qvAdd(' + p.id + ')">أضف للسلة</button>' +
      '<a class="btn ghost" href="product.html?id=' + p.id + '">عرض التفاصيل</a>' +
      '</div></div></div>';
    modal.classList.add("open");
    window.qvQty = function (d) {
      var el = document.getElementById("qv-qty");
      var v = Math.max(1, parseInt(el.textContent) + d);
      el.textContent = v;
    };
    window.qvAdd = function (id) {
      var q = parseInt(document.getElementById("qv-qty").textContent);
      PK.addToCart(PK.getProduct(id), q, "—");
      modal.classList.remove("open");
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var mc = document.getElementById("qv-close");
    if (mc) mc.addEventListener("click", function () { document.getElementById("quickview-modal").classList.remove("open"); });
    var mo = document.getElementById("quickview-modal");
    if (mo) mo.addEventListener("click", function (e) { if (e.target === mo) mo.classList.remove("open"); });
    init();
  });
})();