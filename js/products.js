// بيانات المنتجات — Phoenix & Kemet
// يمكن تعديل الأسعار/الصور لاحقاً من هذا الملف.
(function () {
  "use strict";

  var CATEGORIES = [
    { key: "all", label: "الكل" },
    { key: "الديكور والهدايا", label: "الديكور والهدايا" },
    { key: "ملابس ورفعات", label: "ملابس ورفعات" },
    { key: "تذكارية", label: "تذكارية" },
    { key: "إكسسوارات", label: "إكسسوارات" },
    { key: "قرطاسية", label: "قرطاسية" },
    { key: "هدايا", label: "هدايا" }
  ];

  var PRODUCTS = [
    { id: 1, name: "جناح طائر أكشن", category: "الديكور والهدايا", price: 320.00, image: "WhatsApp Image 2026-10-07 at 11.08.38 PM.jpeg", icon: "fa-feather-alt", desc: "جناح طائر (أكشن) مستوحى من الرموز المصرية، مناسب للعرض والهدايا.", stock: 12, rating: 4.6, reviews: 18, featured: true, tags: ["جناح","ديكور","هدايا"] },
    { id: 2, name: "درع أكشن", category: "الديكور والهدايا", price: 450.00, image: "WhatsApp Image 2026-10-07 at 11.08.39 PM.jpeg", icon: "fa-shield-alt", desc: "درع تذكاري بتفاصيل فرعونية، مثالي لعرض المقتنيات.", stock: 8, rating: 4.8, reviews: 24, featured: true, tags: ["درع","تذكاري"] },
    { id: 3, name: "نحلة كبيرة أكشن", category: "الديكور والهدايا", price: 290.00, image: "WhatsApp Image 2026-10-07 at 11.08.40 PM.jpeg", icon: "fa-bug", desc: "قطعة ديكور (نحلة) بأسلوب مصري قديم.", stock: 15, rating: 4.5, reviews: 11, featured: false, tags: ["ديكور"] },
    { id: 4, name: "سترة إنكريما", category: "ملابس ورفعات", price: 490.00, image: "WhatsApp Image 2026-10-07 at 10.37.33 PM (1).jpeg", icon: "fa-tshirt", desc: "سترة بتفاصيل مصرية، مريحة وعملية.", stock: 20, rating: 4.7, reviews: 31, featured: true, tags: ["ملابس","سترة"] },
    { id: 5, name: "قميص فينكس", category: "ملابس ورفعات", price: 420.00, image: "WhatsApp Image 2026-10-07 at 10.37.32 PM.jpeg", icon: "fa-tshirt", desc: "قميص بطبعة Phoenix & Kemet.", stock: 25, rating: 4.6, reviews: 27, featured: true, tags: ["قميص","فينكس"] },
    { id: 6, name: "رفعة على شكل عين", category: "ملابس ورفعات", price: 180.00, image: "WhatsApp Image 2026-10-07 at 10.37.32 PM (1).jpeg", icon: "fa-hat-cowboy", desc: "رفعة (قبعة) برمز العين.", stock: 18, rating: 4.4, reviews: 9, featured: false, tags: ["رفعة","عين"] },
    { id: 7, name: "قناع يوزيد مكتمل", category: "تذكارية", price: 600.00, image: "WhatsApp Image 2026-09-13 at 1.38.08 AM.jpeg", icon: "fa-mask", desc: "قناع (يوزيد) مكتمل، قطعة تذكارية مميزة.", stock: 5, rating: 4.9, reviews: 14, featured: true, tags: ["قناع","تذكاري"] },
    { id: 8, name: "شارة هواري تاج", category: "تذكارية", price: 90.00, image: null, icon: "fa-certificate", desc: "شارة (بادج) برمز هواري تاج.", stock: 40, rating: 4.3, reviews: 6, featured: false, tags: ["شارة"] },
    { id: 9, name: "سوار عين حورس (Wedjat)", category: "إكسسوارات", price: 250.00, image: null, icon: "fa-eye", desc: "سوار برمز عين حورس (Wedjat) — رمز الحماية.", stock: 22, rating: 4.7, reviews: 19, featured: true, tags: ["سوار","عين حورس"] },
    { id: 10, name: "تعليق مفاتيح أنوبيس", category: "إكسسوارات", price: 75.00, image: null, icon: "fa-key", desc: "تعليق مفاتيح بشكل أنوبيس.", stock: 35, rating: 4.5, reviews: 12, featured: false, tags: ["مفاتيح","أنوبيس"] },
    { id: 11, name: "دفتر كيميت A5", category: "قرطاسية", price: 120.00, image: null, icon: "fa-book", desc: "دفتر بأغلفة مستوحاة من نقوش المعابد.", stock: 30, rating: 4.6, reviews: 8, featured: false, tags: ["دفتر","قرطاسية"] },
    { id: 12, name: "فاصل كتب فرعوني", category: "قرطاسية", price: 45.00, image: null, icon: "fa-bookmark", desc: "فاصل كتب برسومات فرعونية.", stock: 50, rating: 4.4, reviews: 5, featured: false, tags: ["فاصل","كتاب"] },
    { id: 13, name: "كوب Phoenix Kemet", category: "هدايا", price: 150.00, image: null, icon: "fa-mug-hot", desc: "كوب مطبوع بشعار Phoenix Kemet.", stock: 28, rating: 4.7, reviews: 16, featured: true, tags: ["كوب","هدية"] },
    { id: 14, name: "قلم هوية Phoenix Kemet", category: "قرطاسية", price: 60.00, image: null, icon: "fa-pen-fancy", desc: "قلم بتصميم يحمل روح الهوية المصرية.", stock: 45, rating: 4.3, reviews: 7, featured: false, tags: ["قلم"] },
    { id: 15, name: "طقم التخرج", category: "هدايا", price: 850.00, image: null, icon: "fa-graduation-cap", desc: "طقم تخرج بروح مصرية: روب، وشاح، وكاب.", stock: 10, rating: 4.8, reviews: 21, featured: true, tags: ["تخرج","طقم"] },
    { id: 16, name: "مغناطيس رموز مصرية (3 قطع)", category: "هدايا", price: 95.00, image: null, icon: "fa-magnet", desc: "مغناطيس (3 قطع) برموز مصرية.", stock: 60, rating: 4.5, reviews: 13, featured: false, tags: ["مغناطيس"] },
    { id: 17, name: "پاپیروس مرسوم يدوياً", category: "الديكور والهدايا", price: 350.00, image: null, icon: "fa-scroll", desc: "پاپیروس مرسوم برسومات فرعونية.", stock: 14, rating: 4.8, reviews: 10, featured: true, tags: ["پاپیروس","رسم"] },
    { id: 18, name: "تمثال سخمت (ريپليكا)", category: "تذكارية", price: 720.00, image: null, icon: "fa-paw", desc: "ريپليكا لتمثال سخمت (الأسد).", stock: 6, rating: 4.9, reviews: 9, featured: true, tags: ["تمثال","سخمت"] }
  ];

  window.PK = window.PK || {};
  window.PK.CATEGORIES = CATEGORIES;
  window.PK.PRODUCTS = PRODUCTS;
  window.PK.WA_PHONE = "201050166795";
  window.PK.WA_DISPLAY = "+20 10 50166795";
  window.PK.formatPrice = function (n) { return (Number(n).toFixed(2) + " ج.م"); };
  window.PK.getProduct = function (id) { return PRODUCTS.find(function (p) { return p.id === Number(id); }); };
})();