(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      if (q) q.addEventListener("click", function () { item.classList.toggle("open"); });
    });
  });
})();