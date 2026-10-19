/*
 * Cache freshness helper.
 * Loaded WITHOUT defer so it runs before any stylesheet/script request.
 * Appends a build stamp to local css/js files only, so the browser always
 * fetches the latest version after you edit a file.
 *
 * Works both on a local server (http://) and when opened directly (file://).
 */
(function () {
  "use strict";
  if (window.__pkVersioned) return;
  window.__pkVersioned = true;

  var token = window.PK_CACHE_BUST || "7";

  function stamp(target) {
    if (!target) return;
    var attr = target.tagName === "LINK" ? "href" : "src";
    var url = target.getAttribute(attr);
    if (!url || /^(https?:)?\/\//i.test(url) || url.indexOf("data:") === 0) return;
    if (!/\.(css|js)$/i.test(url.split("?")[0])) return;
    var base = url.split("?")[0];
    target.setAttribute(attr, base + "?v=" + token);
  }

  var nodes = document.querySelectorAll("link[rel~='stylesheet'], script[src]");
  for (var i = 0; i < nodes.length; i++) stamp(nodes[i]);
})();
