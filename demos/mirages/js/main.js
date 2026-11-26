/* ============================================================
   蜃楼小记 — 交互
   主题（自动 + 手动）/ 抽屉 / 搜索过滤 / 滚动出现 / 返回顶部
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "mirages-theme";

  function saveTheme(value) {
    try { localStorage.setItem(THEME_KEY, value); } catch (e) { /* 忽略 */ }
  }

  /* ---------- 1. 夜间模式开关 ---------- */
  var themeSwitch = document.getElementById("themeSwitch");

  function syncThemeSwitch() {
    if (themeSwitch) themeSwitch.checked = root.dataset.theme === "dark";
  }

  syncThemeSwitch();

  if (themeSwitch) {
    themeSwitch.addEventListener("change", function () {
      var next = themeSwitch.checked ? "dark" : "light";
      root.dataset.theme = next;
      saveTheme(next);
    });
  }

  /* ---------- 2. 抽屉导航 ---------- */
  var nav = document.getElementById("nav");
  var menuToggle = document.getElementById("menuToggle");
  var backdrop = document.getElementById("navBackdrop");
  var lastFocus = null;
  var pageRegions = document.querySelectorAll("main, .masthead, .site-footer");

  function setBackgroundInert(on) {
    Array.prototype.forEach.call(pageRegions, function (region) {
      if (on) region.setAttribute("inert", "");
      else region.removeAttribute("inert");
    });
  }

  function navIsOpen() {
    return document.body.classList.contains("nav-open");
  }

  function openNav() {
    lastFocus = document.activeElement;
    document.body.classList.add("nav-open");
    nav.removeAttribute("inert");
    nav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "关闭菜单");
    if (backdrop) backdrop.classList.add("show");
    setBackgroundInert(true);
    var firstLink = nav.querySelector(".nav-menu a");
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    nav.setAttribute("inert", "");
    nav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开菜单");
    if (backdrop) backdrop.classList.remove("show");
    setBackgroundInert(false);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  if (nav && menuToggle) {
    menuToggle.addEventListener("click", function () {
      navIsOpen() ? closeNav() : openNav();
    });

    if (backdrop) backdrop.addEventListener("click", closeNav);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navIsOpen()) closeNav();
    });

    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        if (navIsOpen()) closeNav();
      });
    });
  }

  /* ---------- 3. 首页搜索过滤 ---------- */
  function applySearch(query) {
    var box = document.getElementById("searchResult");
    var posts = Array.prototype.slice.call(document.querySelectorAll(".post"));
    if (!box || !posts.length) return;

    var term = query.trim();
    var key = term.toLowerCase();

    if (!key) {
      posts.forEach(function (post) { post.hidden = false; });
      box.classList.remove("show");
      box.textContent = "";
      document.body.classList.remove("is-searching");
      return;
    }

    document.body.classList.add("is-searching");

    var hits = 0;
    posts.forEach(function (post) {
      var haystack = (post.getAttribute("data-search") || "") +
                     " " + (post.textContent || "");
      var match = haystack.toLowerCase().indexOf(key) !== -1;
      post.hidden = !match;
      if (match) hits += 1;
    });

    box.textContent = "";
    var text = document.createElement("span");
    text.appendChild(document.createTextNode("搜索“"));
    var strong = document.createElement("strong");
    strong.textContent = term;
    text.appendChild(strong);
    text.appendChild(document.createTextNode(
      "” · " + (hits ? "找到 " + hits + " 篇文章" : "没有找到相关文章")
    ));

    var clear = document.createElement("a");
    clear.href = "index.html";
    clear.textContent = "清除";

    box.appendChild(text);
    box.appendChild(clear);
    box.classList.add("show");

    var input = document.querySelector(".search input[name='q']");
    if (input) input.value = term;
  }

  var searchForm = document.querySelector(".search");
  var isIndex = document.querySelectorAll(".post").length > 0;

  if (searchForm && isIndex) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = searchForm.querySelector("input[name='q']");
      var query = input ? input.value : "";
      var url = new URL(window.location.href);
      url.search = query.trim() ? "?q=" + encodeURIComponent(query.trim()) : "";
      window.history.replaceState(null, "", url.toString());
      applySearch(query);
      if (navIsOpen()) closeNav();
      var box = document.getElementById("searchResult");
      if (box) box.scrollIntoView({ block: "start" });
    });
  }

  var queryParam = new URLSearchParams(window.location.search).get("q") || "";
  if (queryParam) {
    applySearch(queryParam);
    var searchInput = document.querySelector(".search input[name='q']");
    if (searchInput) searchInput.value = queryParam;
  }

  /* ---------- 4. 滚动出现 ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    Array.prototype.forEach.call(revealItems, function (item, index) {
      item.style.setProperty("--delay", Math.min(index, 5) * 70 + "ms");
      observer.observe(item);
    });
  } else {
    Array.prototype.forEach.call(revealItems, function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- 5. 返回顶部 ---------- */
  var backtop = document.getElementById("backtop");

  function toggleBacktop() {
    if (!backtop) return;
    backtop.classList.toggle("show", window.scrollY > 200);
  }

  if (backtop) {
    window.addEventListener("scroll", toggleBacktop, { passive: true });
    toggleBacktop();
    backtop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- 6. 页脚年份 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
