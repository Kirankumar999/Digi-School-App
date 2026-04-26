/* ===========================================================
   EduPulse — Shared App Script
   - Theme toggle (persisted)
   - Mobile sidebar
   - Reveal-on-scroll animations
   - Counter animations
   - Active nav highlight
   =========================================================== */

(function () {
  const STORAGE_KEY = "edupulse-theme";

  // ---------- Theme ----------
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch (_) {}
    const knobIcon = document.querySelector(".theme-toggle .knob i");
    if (knobIcon) {
      knobIcon.setAttribute("data-lucide", t === "dark" ? "moon" : "sun");
      if (window.lucide) window.lucide.createIcons();
    }
  }
  const savedTheme = (() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  })() || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", savedTheme);

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(savedTheme);

    // Toggle theme
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(cur === "light" ? "dark" : "light");
        // Re-init charts with new colors if available
        if (window.__rebuildCharts) window.__rebuildCharts();
      });
    }

    // Mobile sidebar
    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.querySelector(".menu-toggle");
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    document.body.appendChild(backdrop);
    function openSidebar() {
      sidebar.classList.add("open");
      backdrop.style.display = "block";
    }
    function closeSidebar() {
      sidebar.classList.remove("open");
      backdrop.style.display = "none";
    }
    if (menuBtn) menuBtn.addEventListener("click", openSidebar);
    backdrop.addEventListener("click", closeSidebar);

    // Highlight active nav based on current page filename
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-item").forEach((a) => {
      const target = (a.getAttribute("data-page") || "").toLowerCase();
      if (target && file.includes(target)) a.classList.add("active");
      else a.classList.remove("active");
    });
    document.querySelectorAll(".mobile-nav a").forEach((a) => {
      const target = (a.getAttribute("data-page") || "").toLowerCase();
      if (target && file.includes(target)) a.classList.add("active");
      else a.classList.remove("active");
    });

    // Reveal-on-scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.transition = "opacity .6s ease, transform .6s ease";
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transitionDelay = (i * 40) + "ms";
      io.observe(el);
    });

    // Animated counters
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      const dur = 1100;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = target * eased;
        el.textContent = prefix + v.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    // Lucide icons
    if (window.lucide) window.lucide.createIcons();
  });

  // Helpers used by chart pages
  window.__themeColors = function () {
    const css = getComputedStyle(document.documentElement);
    return {
      text: css.getPropertyValue("--text").trim(),
      mute: css.getPropertyValue("--text-mute").trim(),
      grid: getComputedStyle(document.body).getPropertyValue("color-scheme").trim() === "dark"
        ? "rgba(255,255,255,.08)" : "rgba(15,23,42,.08)",
      brand1: css.getPropertyValue("--brand-1").trim(),
      brand2: css.getPropertyValue("--brand-2").trim(),
      brand3: css.getPropertyValue("--brand-3").trim(),
      brand4: css.getPropertyValue("--brand-4").trim(),
      success: css.getPropertyValue("--success").trim(),
      warning: css.getPropertyValue("--warning").trim(),
      danger:  css.getPropertyValue("--danger").trim(),
      info:    css.getPropertyValue("--info").trim(),
      surface: css.getPropertyValue("--surface").trim()
    };
  };
})();
