/* ═════ XNTROVA REDESIGN — script.js ═════
   Vanilla JS only (no dependencies): nav, scrollspy, reveal,
   counters, slider, filters, FAQ, forms, back-to-top. */
(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  var backTop = document.getElementById("backTop");
  function onScroll() {
    var y = window.scrollY || 0;
    header.classList.toggle("is-scrolled", y > 8);
    backTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu (guarded: menu must work even if other widgets fail) ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  var backdrop = document.getElementById("menuBackdrop");
  if (menuBtn && mobileMenu) {
    var menuOpen = false;
    var focusBefore = null;
    function setMenu(open) {
      menuOpen = open;
      mobileMenu.classList.toggle("open", open);
      if (backdrop) backdrop.classList.toggle("show", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileMenu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        focusBefore = document.activeElement;
        var first = mobileMenu.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      } else if (focusBefore && focusBefore.focus) {
        focusBefore.focus({ preventScroll: true });
      }
    }
    menuBtn.addEventListener("click", function () { setMenu(!menuOpen); });
    if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOpen) setMenu(false);
    });
    // If the drawer is open and the viewport grows to desktop, reset to nav bar.
    window.addEventListener("resize", function () {
      if (menuOpen && window.innerWidth > 1020) setMenu(false);
    });
  }

  /* ---------- Scrollspy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = ["services", "about", "why", "work", "testimonials", "faq"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle("is-active",
              l.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var dur = 1400, t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById("sliderTrack");
  var dotsWrap = document.getElementById("sliderDots");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  if (track && dotsWrap && prevBtn && nextBtn) {
    var cards = Array.prototype.slice.call(track.children);
    var idx = 0, timer = null;
    var dots = cards.map(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      d.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(d);
      return d;
    });
    // Paint active dot only — never scrolls the page (no scrollIntoView on init).
    function paint() {
      dots.forEach(function (d, j) { d.classList.toggle("is-active", j === idx); });
    }
    function goTo(i) {
      idx = (i + cards.length) % cards.length;
      // Scroll the horizontal track only; page position is untouched.
      track.scrollTo({ left: idx * (cards[0].offsetWidth + 20), behavior: "smooth" });
      paint();
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(idx + 1); }, 5000);
    }
    prevBtn.addEventListener("click", function () { goTo(idx - 1); restart(); });
    nextBtn.addEventListener("click", function () { goTo(idx + 1); restart(); });
    track.addEventListener("scroll", function () {
      var w = cards[0].offsetWidth + 20;
      var n = Math.round(track.scrollLeft / w);
      if (n !== idx && n >= 0 && n < cards.length) { idx = n; paint(); }
    }, { passive: true });
    paint(); restart();
  }

  /* ---------- Portfolio filters ---------- */
  var filterBtns = document.querySelectorAll(".filter");
  var workCards = document.querySelectorAll(".work-card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      var f = btn.getAttribute("data-filter");
      workCards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-cat") === f;
        c.classList.toggle("hide", !show);
        if (show) { c.classList.remove("in"); requestAnimationFrame(function () { c.classList.add("in"); }); }
      });
    });
  });

  /* ---------- FAQ accordion (single-open) ---------- */
  var items = document.querySelectorAll(".faq__item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (it) {
        it.classList.remove("open");
        it.querySelector(".faq__a").style.maxHeight = null;
        it.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });
  if (items.length) items[0].querySelector(".faq__q").click();

  /* ---------- Form validation + fake submit ---------- */
  function wireForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    var phoneRe = /^[+\d][\d\s\-()]{6,16}$/;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var wrap = input.closest(".field");
        var val = input.value.trim();
        var valid = val.length > 0;
        if (input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (input.type === "tel") valid = phoneRe.test(val);
        if (input.tagName === "TEXTAREA") valid = val.length >= 10;
        if (input.tagName === "SELECT") valid = val !== "";
        wrap.classList.toggle("field--invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        var firstBad = form.querySelector(".field--invalid input, .field--invalid select, .field--invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Sending…";
      setTimeout(function () {
        var success = form.querySelector(".form-success");
        if (success) success.hidden = false;
        form.querySelectorAll("input, select, textarea").forEach(function (i) { i.value = ""; });
        btn.disabled = false;
        btn.innerHTML = formId === "contactForm" ? "Send enquiry →" : "Claim my free audit";
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 900);
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("field--invalid");
      });
    });
  }
  wireForm("heroForm");
  wireForm("contactForm");

  /* ---------- Hero rotating word ---------- */
  var rotator = document.getElementById("rotator");
  if (rotator) {
    var words = ["D2C skincare brands", "B2B SaaS companies", "restaurant chains", "ed-tech platforms", "local clinics", "fashion labels"];
    var wi = 0;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      setInterval(function () {
        rotator.classList.add("out");
        setTimeout(function () {
          wi = (wi + 1) % words.length;
          rotator.textContent = words[wi];
          rotator.classList.remove("out");
        }, 230);
      }, 2600);
    }
  }

  /* ---------- ROI calculator ---------- */
  var cTraffic = document.getElementById("calc-traffic");
  if (cTraffic) {
    var cRate = document.getElementById("calc-rate");
    var cValue = document.getElementById("calc-value");
    var oTraffic = document.getElementById("out-traffic");
    var oRate = document.getElementById("out-rate");
    var oValue = document.getElementById("out-value");
    var oLeads = document.getElementById("calc-leads");
    var oProj = document.getElementById("calc-proj");
    var oRev = document.getElementById("calc-rev");
    var UPLIFT = 2.4; // average client uplift — stated next to the number
    function fmtIN(n) { return Math.round(n).toLocaleString("en-IN"); }
    function fmtMoney(n) {
      if (n >= 10000000) return "₹" + (n / 10000000).toFixed(1) + " Cr";
      if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + " L";
      return "₹" + fmtIN(n);
    }
    function paintRange(el) {
      var pct = ((el.value - el.min) / (el.max - el.min)) * 100;
      el.style.setProperty("--fill", pct + "%");
    }
    function recalc() {
      var t = +cTraffic.value, r = +cRate.value, v = +cValue.value;
      [cTraffic, cRate, cValue].forEach(paintRange);
      oTraffic.textContent = fmtIN(t);
      oRate.textContent = r + "%";
      oValue.textContent = "₹" + fmtIN(v);
      var leads = t * (r / 100);
      oLeads.textContent = fmtIN(leads);
      oProj.textContent = fmtIN(leads * UPLIFT);
      oRev.textContent = fmtMoney(leads * UPLIFT * v);
    }
    [cTraffic, cRate, cValue].forEach(function (el) {
      el.addEventListener("input", recalc);
    });
    recalc();
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
