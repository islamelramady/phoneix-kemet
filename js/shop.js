(function () {
  "use strict";
  var PAGE_SIZE = 9;
  var currentPage = 1;
  var filtered = [];
  var activeCat = "all";
  var searchQuery = "";
  var sortBy = "featured";

  function init() {
    if (!window.PK || !window.PK.PRODUCTS) { setTimeout(init, 50); return; }
    var PK = window.PK;
    var cats = PK.CATEGORIES;

    // read URL params
    var params = new URLSearchParams(location.search);
    activeCat = params.get("cat") || "all";
    searchQuery = (params.get("q") || "").trim();

    var pills = document.getElementById("shop-cats");
    if (pills) {
      pills.innerHTML = cats.map(function (c) {
        return '<button class="cat-pill' + (c.key === activeCat ? " active" : "") + '" data-cat="' + c.key + '">' + PK.escapeHtml(c.label) + '</button>';
      }).join("");
      pills.addEventListener("click", function (e) {
        var b = e.target.closest(".cat-pill");
        if (!b) return;
        activeCat = b.dataset.cat;
        pills.querySelectorAll(".cat-pill").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        applyFilters();
      });
    }

    var searchInput = document.getElementById("shop-search");
    if (searchInput) {
      searchInput.value = searchQuery;
      searchInput.addEventListener("input", function () { searchQuery = searchInput.value.trim(); applyFilters(); });
    }
    var sortSel = document.getElementById("shop-sort");
    if (sortSel) sortSel.addEventListener("change", function () { sortBy = sortSel.value; applyFilters(); });

    applyFilters();

    // quickview modal
    var mc = document.getElementById("qv-close");
    if (mc) mc.addEventListener("click", function () { document.getElementById("quickview-modal").classList.remove("open"); });
    var mo = document.getElementById("quickview-modal");
    if (mo) mo.addEventListener("click", function (e) { if (e.target === mo) mo.classList.remove("open"); });
  }

  function applyFilters() {
    var PK = window.PK;
    var products = PK.PRODUCTS.slice();
    var q = searchQuery.toLowerCase();

    filtered = products.filter(function (p) {
      if (activeCat !== "all" && p.category !== activeCat) return false;
      if (q) {
        var hay = (p.name + " " + p.desc + " " + p.tags.join(" ") + " " + p.category).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") filtered.sort(function (a, b) { return a.price - b.price; });
    else if (sortBy === "price-desc") filtered.sort(function (a, b) { return b.price - a.price; });
    else if (sortBy === "rating") filtered.sort(function (a, b) { return b.rating - a.rating; });
    else if (sortBy === "newest") filtered.sort(function (a, b) { return b.id - a.id; });
    else filtered.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });

    currentPage = 1;
    renderPage();
  }

  function renderPage() {
    var PK = window.PK;
    var host = document.getElementById("shop-grid");
    var empty = document.getElementById("shop-empty");
    var countEl = document.getElementById("shop-count");
    var pag = document.getElementById("shop-pagination");
    if (!host) return;

    if (countEl) countEl.textContent = filtered.length + " منتج";

    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > pages) currentPage = pages;
    var start = (currentPage - 1) * PAGE_SIZE;
    var slice = filtered.slice(start, start + PAGE_SIZE);

    if (slice.length === 0) {
      host.innerHTML = "";
      if (empty) empty.style.display = "";
    } else {
      if (empty) empty.style.display = "none";
      host.innerHTML = slice.map(cardHtml).join("");
      wireCards(host);
      if (PK.revealIn) PK.revealIn(host);
    }

    if (pag) {
      if (pages <= 1) { pag.innerHTML = ""; }
      else {
        var html = "";
        for (var i = 1; i <= pages; i++) {
          html += '<button class="' + (i === currentPage ? "active" : "") + '" data-page="' + i + '">' + i + '</button>';
        }
        pag.innerHTML = html;
        pag.querySelectorAll("button").forEach(function (b) {
          b.addEventListener("click", function () {
            currentPage = Number(b.dataset.page);
            renderPage();
            window.scrollTo({ top: 150, behavior: "smooth" });
          });
        });
      }
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

  document.addEventListener("DOMContentLoaded", function () { init(); });
})();