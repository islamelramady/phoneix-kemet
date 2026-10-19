(function () {
  "use strict";
  var couponApplied = false;

  function init() {
    if (!window.PK) { setTimeout(init, 50); return; }
    var PK = window.PK;
    render();
    var clearBtn = document.getElementById("clear-cart-btn");
    if (clearBtn) clearBtn.addEventListener("click", function () { PK.clearCart(); render(); PK.toast("تم تفريغ السلة", "info"); });
    var checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
    var couponBtn = document.getElementById("coupon-btn");
    if (couponBtn) couponBtn.addEventListener("click", applyCoupon);
  }

  function render() {
    var PK = window.PK;
    var list = document.getElementById("cart-list");
    var empty = document.getElementById("cart-empty");
    var cart = PK.state.cart;
    if (cart.length === 0) {
      if (list) list.innerHTML = "";
      if (empty) empty.style.display = "";
      updateTotals();
      return;
    }
    if (empty) empty.style.display = "none";
    if (list) {
      list.innerHTML = cart.map(function (i) {
        return '<div class="cart-item">' +
          '<div style="width:80px;height:80px;border-radius:8px;overflow:hidden;background:var(--papyrus-soft);display:grid;place-items:center;">' +
          (i.image ? '<img src="images/products/' + encodeURIComponent(i.image) + '" alt="' + PK.escapeHtml(i.name) + '" style="width:100%;height:100%;object-fit:cover;">' : '<i class="fas ' + i.icon + '" style="font-size:2rem;color:var(--clay);"></i>') +
          '</div>' +
          '<div class="info">' +
          '<h4>' + PK.escapeHtml(i.name) + '</h4>' +
          '<div class="price">الحجم: ' + PK.escapeHtml(i.variant) + ' — سعر الوحدة: ' + PK.formatPrice(i.price) + '</div>' +
          '</div>' +
          '<div class="controls">' +
          '<button class="qty-btn" onclick="cartQty(' + i.id + ',\'' + i.variant + '\',-1)" aria-label="تقليل">−</button>' +
          '<span class="qty">' + i.qty + '</span>' +
          '<button class="qty-btn" onclick="cartQty(' + i.id + ',\'' + i.variant + '\',1)" aria-label="زيادة">+</button>' +
          '<span class="price">الإجمالي: ' + PK.formatPrice(i.price * i.qty) + '</span>' +
          '<button class="cart-remove" onclick="cartRemove(' + i.id + ',\'' + i.variant + '\')" aria-label="حذف المنتج" title="حذف المنتج"><i class="fas fa-trash"></i></button>' +
          '</div></div>';
      }).join("");
    }
    updateTotals();
  }

  window.cartQty = function (id, variant, d) {
    var PK = window.PK;
    PK.updateQty(id, variant, d);
    render();
  };
  window.cartRemove = function (id, variant) {
    var PK = window.PK;
    PK.removeFromCart(id, variant);
    render();
    PK.toast("تم حذف المنتج", "info");
  };

  function updateTotals() {
    var PK = window.PK;
    var total = PK.cartTotal();
    if (couponApplied) total = total * 0.9;
    var sub = document.getElementById("sub-total");
    var grand = document.getElementById("grand-total");
    if (sub) sub.textContent = PK.formatPrice(PK.cartTotal());
    if (grand) grand.textContent = PK.formatPrice(total);
  }

  function applyCoupon() {
    var PK = window.PK;
    var input = document.getElementById("coupon-input");
    var msg = document.getElementById("coupon-msg");
    var code = (input.value || "").trim().toUpperCase();
    if (code === "KEMET10") {
      couponApplied = true;
      if (msg) { msg.textContent = "تم تطبيق خصم 10% ✓"; msg.style.color = "#27ae60"; }
      updateTotals();
      PK.toast("تم تطبيق الخصم", "success");
    } else {
      couponApplied = false;
      if (msg) { msg.textContent = "كود غير صالح."; msg.style.color = "#c0392b"; }
      updateTotals();
    }
  }

  function checkout() {
    var PK = window.PK;
    var cart = PK.state.cart;
    if (cart.length === 0) { PK.toast("السلة فارغة، أضف منتجاً أولاً.", "info"); return; }
    var lines = cart.map(function (i) {
      return "- " + i.name + " × " + i.qty + " (" + i.variant + ") = " + PK.formatPrice(i.price * i.qty);
    }).join("\n");
    var total = PK.cartTotal();
    if (couponApplied) total = total * 0.9;
    var text = "📦 طلب من Phoenix Kemet\n\n" + lines + "\n\nالمجموع: " + PK.formatPrice(total) +
      "\n\nالاسم: ___\nالعنوان: ___\nالهاتف: ___\n\nأرسل لنا وسنتواصل معك.";
    window.open("https://wa.me/" + PK.WA_PHONE + "?text=" + encodeURIComponent(text), "_blank");
  }

  document.addEventListener("DOMContentLoaded", function () { init(); });
})();