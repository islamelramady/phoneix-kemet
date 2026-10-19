(function () {
  "use strict";
  var selectedVariant = "M";
  var qty = 1;

  function init() {
    if (!window.PK || !window.PK.PRODUCTS) { setTimeout(init, 50); return; }
    var PK = window.PK;
    var params = new URLSearchParams(location.search);
    var id = Number(params.get("id"));
    var p = PK.getProduct(id);
    if (!p) { document.getElementById("product-detail").innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>المنتج غير موجود.</p><a class="btn" href="shop.html">العودة للمتجر</a></div>'; return; }

    PK.pushRecent(p.id);

    var bc = document.getElementById("breadcrumbs");
    if (bc) bc.innerHTML = '<a href="index.html">الرئيسية</a><span>›</span><a href="shop.html">المتجر</a><span>›</span><span>' + PK.escapeHtml(p.name) + '</span>';

    var host = document.getElementById("product-detail");
    var sizes = ["S", "M", "L", "XL"];
    host.innerHTML =
      '<div class="pro-detail">' +
      '<div class="detail-gallery">' +
      '<div class="detail-main" id="detail-main">' + PK.imgOrIcon(p) + '</div>' +
      '</div>' +
      '<div class="info">' +
      '<h1>' + PK.escapeHtml(p.name) + '</h1>' +
      '<div class="pro-rating" style="margin:6px 0;"><span class="stars">' + stars(p.rating) + '</span> <small>(' + p.reviews + ' تقييم)</small></div>' +
      '<div class="price-big">' + PK.formatPrice(p.price) + '</div>' +
      '<p class="desc">' + PK.escapeHtml(p.desc) + '</p>' +
      '<div class="select-wrap">' +
      '<div style="flex:1;min-width:200px;"><label style="font-weight:700;display:block;margin-bottom:6px;">الحجم</label>' +
      '<div class="variant-row" id="variant-row">' + sizes.map(function (s) { return '<button class="variant-btn' + (s === selectedVariant ? " active" : "") + '" data-size="' + s + '">' + s + '</button>'; }).join("") + '</div></div>' +
      '<div style="flex:1;min-width:200px;"><label style="font-weight:700;display:block;margin-bottom:6px;">الكمية</label>' +
      '<div class="qty-stepper"><button id="qty-dec">−</button><span id="qty-val">1</span><button id="qty-inc">+</button></div></div>' +
      '</div>' +
      '<div class="pro-actions" style="margin-top:18px;">' +
      '<button class="btn" id="add-cart-btn">أضف لسلة الشراء <i class="fas fa-shopping-bag"></i></button>' +
      '<button class="wa-btn" id="buy-now-btn">اشترِ الآن (واتساب)</button>' +
      '<button class="pro-wish" id="wish-btn" aria-label="مفضلة" style="flex:0 0 48px;"><i class="' + (PK.isWished(p.id) ? "fas" : "far") + ' fa-heart"></i></button>' +
      '</div>' +
      '<div style="margin-top:18px;color:var(--clay);font-size:0.9rem;">' +
      '<p><strong>التصنيف:</strong> ' + PK.escapeHtml(p.category) + '</p>' +
      '<p><strong>المخزون:</strong> ' + p.stock + ' قطعة</p>' +
      '<p><strong>الشحن:</strong> 1-3 أيام عمل داخل العراق/المنطقة</p>' +
      '</div></div></div>';

    // variants
    document.getElementById("variant-row").addEventListener("click", function (e) {
      var b = e.target.closest(".variant-btn");
      if (!b) return;
      selectedVariant = b.dataset.size;
      document.querySelectorAll(".variant-btn").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
    });
    // qty
    document.getElementById("qty-dec").addEventListener("click", function () { qty = Math.max(1, qty - 1); document.getElementById("qty-val").textContent = qty; });
    document.getElementById("qty-inc").addEventListener("click", function () { qty = Math.min(p.stock, qty + 1); document.getElementById("qty-val").textContent = qty; });
    // add cart
    document.getElementById("add-cart-btn").addEventListener("click", function () { PK.addToCart(p, qty, selectedVariant); });
    // buy now
    document.getElementById("buy-now-btn").addEventListener("click", function () {
      var text = "🎁 طلب: " + p.name + "\nالحجم: " + selectedVariant + "\nالكمية: " + qty + "\nالسعر: " + PK.formatPrice(p.price) + "\nالإجمالي: " + PK.formatPrice(p.price * qty) + "\n\nأرسل لنا.";
      window.open("https://wa.me/" + PK.WA_PHONE + "?text=" + encodeURIComponent(text), "_blank");
    });
    // wish
    document.getElementById("wish-btn").addEventListener("click", function () {
      var wished = PK.toggleWish(p.id);
      this.querySelector("i").className = (wished ? "fas" : "far") + " fa-heart";
    });

    // related
    var related = PK.PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    var rg = document.getElementById("related-grid");
    if (rg) {
      rg.innerHTML = related.map(function (x) {
        return '<div class="product" data-id="' + x.id + '" style="cursor:pointer;" onclick="location.href=\'product.html?id=' + x.id + '\'">' +
          '<div class="product-img">' + PK.imgOrIcon(x) + '</div>' +
          '<div class="product-body"><h3>' + PK.escapeHtml(x.name) + '</h3>' + PK.formatPrice(x.price) + '</div></div>';
      }).join("");
    }
  }

  function stars(r) {
    var full = Math.floor(r);
    var half = r - full >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  }

  document.addEventListener("DOMContentLoaded", function () { init(); });
})();