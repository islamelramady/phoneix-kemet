(function () {
  "use strict";
  function init() {
    if (!window.PK) { setTimeout(init, 50); return; }
    render();
  }
  function render() {
    var PK = window.PK;
    var grid = document.getElementById("wish-grid");
    var empty = document.getElementById("wish-empty");
    var ids = PK.state.wishlist;
    if (ids.length === 0) {
      if (grid) grid.innerHTML = "";
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";
    var products = ids.map(function (id) { return PK.getProduct(id); }).filter(Boolean);
    if (grid) {
      grid.innerHTML = products.map(function (p) {
        return '<div class="product" data-id="' + p.id + '">' +
          '<div class="product-img">' + PK.imgOrIcon(p) + '</div>' +
          '<div class="product-body">' +
          '<h3>' + PK.escapeHtml(p.name) + '</h3>' +
          '<p>' + PK.escapeHtml(p.desc) + '</p>' +
          '<div class="price">' + PK.formatPrice(p.price) + '</div>' +
          '<div class="pro-actions-inline">' +
          '<button class="pro-add" data-action="add" data-id="' + p.id + '"><i class="fas fa-cart-plus"></i> أضف للسلة</button>' +
          '<button class="pro-wish" data-action="remove" data-id="' + p.id + '" aria-label="حذف من المفضلة" title="حذف من المفضلة"><i class="fas fa-trash"></i></button>' +
          '</div></div></div>';
      }).join("");
      grid.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-action]");
        if (!btn) { var card = e.target.closest(".product"); if (card && card.dataset.id) location.href = "product.html?id=" + card.dataset.id; return; }
        var id = Number(btn.dataset.id);
        var p = PK.getProduct(id);
        if (btn.dataset.action === "add") PK.addToCart(p, 1, "—");
        else if (btn.dataset.action === "remove") { PK.toggleWish(id); render(); PK.toast("تم الحذف من المفضلة", "info"); }
      });
    }
  }
  document.addEventListener("DOMContentLoaded", function () { init(); });
})();