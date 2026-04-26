/* ===========================================================
   EduPulse — Shell Builder
   Injects the sidebar, mobile nav, and topbar into pages
   that include <div data-shell page-title="..." page-crumbs="...">.
   =========================================================== */

(function () {
  const NAV = [
    { group: "Main", items: [
      { label: "Dashboard",   icon: "layout-dashboard", page: "dashboard.html" },
      { label: "Students",    icon: "users",            page: "students.html" },
      { label: "Teachers",    icon: "graduation-cap",   page: "teachers.html" },
      { label: "Classes",     icon: "book-open",        page: "classes.html" },
    ]},
    { group: "Academics", items: [
      { label: "Attendance",  icon: "clipboard-check",  page: "attendance.html" },
      { label: "Timetable",   icon: "calendar-days",    page: "timetable.html" },
      { label: "Grades",      icon: "award",            page: "grades.html" },
    ]},
    { group: "Admin", items: [
      { label: "Fees",        icon: "credit-card",      page: "fees.html" },
      { label: "Messages",    icon: "message-circle",   page: "messages.html", badge: "4" },
      { label: "Settings",    icon: "settings",         page: "settings.html" },
    ]},
  ];

  const MOBILE = [
    { label: "Home",     icon: "layout-dashboard", page: "dashboard.html" },
    { label: "Students", icon: "users",            page: "students.html" },
    { label: "Class",    icon: "book-open",        page: "classes.html" },
    { label: "Chat",     icon: "message-circle",   page: "messages.html" },
    { label: "Me",       icon: "user-round",       page: "settings.html" },
  ];

  function buildSidebar() {
    const groups = NAV.map(g => `
      <div class="nav-section">
        <div class="nav-label">${g.group}</div>
        ${g.items.map(it => `
          <a class="nav-item" href="${it.page}" data-page="${it.page}">
            <span class="icon"><i data-lucide="${it.icon}"></i></span>
            <span>${it.label}</span>
            ${it.badge ? `<span class="nav-badge">${it.badge}</span>` : ""}
          </a>
        `).join("")}
      </div>
    `).join("");

    return `
      <aside class="sidebar">
        <a class="brand" href="dashboard.html">
          <div class="brand-mark">EP</div>
          <div>
            <div class="brand-name">EduPulse</div>
            <div class="brand-sub">School OS</div>
          </div>
        </a>
        ${groups}
        <div class="sidebar-footer">
          <h4>Upgrade to Pro</h4>
          <p>Unlock advanced analytics and unlimited storage.</p>
          <a href="#" class="btn-up"><i data-lucide="sparkles"></i> Upgrade</a>
        </div>
      </aside>
    `;
  }

  function buildTopbar(title, crumbs) {
    const crumbHtml = (crumbs || "Home / Page")
      .split("/").map(s => `<span>${s.trim()}</span>`).join("");
    return `
      <header class="topbar">
        <button class="menu-toggle icon-btn" aria-label="Open menu">
          <i data-lucide="menu"></i>
        </button>
        <div class="page-title">
          <h1>${title}</h1>
          <div class="crumbs">${crumbHtml}</div>
        </div>
        <div class="search">
          <span class="ic"><i data-lucide="search"></i></span>
          <input type="text" placeholder="Search students, classes, fees…" />
          <kbd>⌘K</kbd>
        </div>
        <div class="topbar-actions">
          <button class="icon-btn" title="Help"><i data-lucide="circle-help"></i></button>
          <button class="icon-btn" title="Notifications">
            <i data-lucide="bell"></i>
            <span class="dot"></span>
          </button>
          <button class="theme-toggle" aria-label="Toggle theme">
            <span class="knob"><i data-lucide="sun"></i></span>
          </button>
          <a class="user-chip" href="settings.html" title="Profile">
            <span class="avatar">SM</span>
            <span class="who">
              <span class="name">Sarah Mitchell</span>
              <span class="role">Administrator</span>
            </span>
          </a>
        </div>
      </header>
    `;
  }

  function buildMobileNav() {
    return `
      <nav class="mobile-nav">
        <ul>
          ${MOBILE.map(m => `
            <li><a href="${m.page}" data-page="${m.page}">
              <i data-lucide="${m.icon}"></i><span>${m.label}</span>
            </a></li>
          `).join("")}
        </ul>
      </nav>
    `;
  }

  function init() {
    const host = document.querySelector("[data-shell]");
    if (!host) return;

    const title  = host.getAttribute("page-title")  || "Dashboard";
    const crumbs = host.getAttribute("page-crumbs") || "Home / Dashboard";

    const contentHTML = host.innerHTML;
    host.innerHTML = `
      <div class="bg-decor"></div>
      <div class="app">
        ${buildSidebar()}
        <main class="main">
          ${buildTopbar(title, crumbs)}
          <section class="content">${contentHTML}</section>
        </main>
      </div>
      ${buildMobileNav()}
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
