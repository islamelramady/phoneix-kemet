// حالة المتجر: سلة، مفضلة، مشاهدات، ثيم، إشعارات
(function () {
  "use strict";

  var CART_KEY = "pk_cart";
  var WISH_KEY = "pk_wish";
  var RECENT_KEY = "pk_recent";
  var THEME_KEY = "pk_theme";

  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  var state = {
    cart: read(CART_KEY, []),
    wishlist: read(WISH_KEY, []),
    recent: read(RECENT_KEY, []),
    theme: read(THEME_KEY, "light")
  };

  function saveCart() { write(CART_KEY, state.cart); }
  function saveWish() { write(WISH_KEY, state.wishlist); }
  function saveRecent() { write(RECENT_KEY, state.recent); }
  function saveTheme() { write(THEME_KEY, state.theme); }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveTheme();
    applyTheme();
    updateThemeIcon();
  }

  function updateThemeIcon() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.innerHTML = state.theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  // Toast
  function toast(msg, type) {
    type = type || "info";
    var host = document.getElementById("toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "toast-host";
      host.className = "toast-host";
      document.body.appendChild(host);
    }
    var el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.textContent = msg;
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }, 2600);
  }

  // Cart
  function addToCart(product, qty, variant) {
    qty = qty || 1;
    var found = state.cart.find(function (i) { return i.id === product.id && i.variant === variant; });
    if (found) { found.qty += qty; }
    else { state.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, icon: product.icon, variant: variant || "—", qty: qty }); }
    saveCart();
    updateCartBadge();
    toast("أُضيف «" + product.name + "» إلى السلة ✓", "success");
  }

  function removeFromCart(id, variant) {
    state.cart = state.cart.filter(function (i) { return !(i.id === id && i.variant === variant); });
    saveCart();
    updateCartBadge();
  }

  function updateQty(id, variant, delta) {
    var it = state.cart.find(function (i) { return i.id === id && i.variant === variant; });
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) removeFromCart(id, variant);
    else { saveCart(); updateCartBadge(); }
  }

  function clearCart() { state.cart = []; saveCart(); updateCartBadge(); }

  function cartCount() { return state.cart.reduce(function (a, c) { return a + c.qty; }, 0); }
  function cartTotal() { return state.cart.reduce(function (a, c) { return a + c.price * c.qty; }, 0); }

  function updateCartBadge() {
    document.querySelectorAll(".cart-badge").forEach(function (el) { el.textContent = cartCount(); });
    document.querySelectorAll(".cart-count-text").forEach(function (el) { el.textContent = "سلة الشراء (" + cartCount() + ")"; });
  }

  // Wishlist
  function toggleWish(id) {
    var idx = state.wishlist.indexOf(id);
    if (idx === -1) { state.wishlist.push(id); toast("أُضيف إلى المفضلة ♥", "success"); }
    else { state.wishlist.splice(idx, 1); toast("أُزيل من المفضلة", "info"); }
    saveWish();
    updateWishBadge();
    return state.wishlist.indexOf(id) !== -1;
  }
  function isWished(id) { return state.wishlist.indexOf(id) !== -1; }
  function updateWishBadge() {
    document.querySelectorAll(".wish-badge").forEach(function (el) { el.textContent = state.wishlist.length; });
  }

  // Recently viewed
  function pushRecent(id) {
    state.recent = state.recent.filter(function (x) { return x !== id; });
    state.recent.unshift(id);
    if (state.recent.length > 8) state.recent = state.recent.slice(0, 8);
    saveRecent();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function imgOrIcon(p, cls) {
    if (p.image) {
      return '<img class="' + (cls || "pro-img") + '" src="images/products/' + encodeURIComponent(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy">';
    }
    return '<div class="pro-icon ' + (cls || "") + '"><i class="fas ' + p.icon + '"></i></div>';
  }

  // Expose
  window.PK = window.PK || {};
  var PK = window.PK;
  PK.state = state;
  PK.saveCart = saveCart; PK.saveWish = saveWish;
  PK.addToCart = addToCart;
  PK.removeFromCart = removeFromCart;
  PK.updateQty = updateQty;
  PK.clearCart = clearCart;
  PK.cartCount = cartCount;
  PK.cartTotal = cartTotal;
  PK.updateCartBadge = updateCartBadge;
  PK.toggleWish = toggleWish;
  PK.isWished = isWished;
  PK.updateWishBadge = updateWishBadge;
  PK.pushRecent = pushRecent;
  PK.toast = toast;
  PK.toggleTheme = toggleTheme;
  PK.applyTheme = applyTheme;
  PK.updateThemeIcon = updateThemeIcon;
  PK.escapeHtml = escapeHtml;
  PK.imgOrIcon = imgOrIcon;

  // Init theme on load
  applyTheme();
})();