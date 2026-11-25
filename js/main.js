/* ============================================
   Lumen Demo — 交互脚本
   每段功能独立，可单独删除。
   ============================================ */
(function () {
  "use strict";

  /* ---------- 1. 主题切换 ---------- */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  // 某些隐私模式或 file:// 下 localStorage 会抛错，统一兜底
  function readTheme() {
    try { return localStorage.getItem("lumen-theme"); } catch (e) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem("lumen-theme", value); } catch (e) { /* 忽略 */ }
  }

  const stored = readTheme(); // "light" | "dark" | null
  if (stored === "light" || stored === "dark") {
    root.dataset.theme = stored;
  }

  function isDark() {
    const explicit = root.dataset.theme;
    if (explicit) return explicit === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function syncToggle() {
    const dark = isDark();
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
  }

  toggle.addEventListener("click", function () {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    saveTheme(next);
    syncToggle();
  });

  syncToggle();

  /* ---------- 2. 实时时钟 ---------- */
  const clock = document.getElementById("clock");

  function renderClock() {
    clock.textContent = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  }

  renderClock();
  setInterval(renderClock, 1000);

  /* ---------- 3. 计数器与进度条 ---------- */
  const countEl = document.getElementById("count");
  const plusBtn = document.getElementById("plusBtn");
  const minusBtn = document.getElementById("minusBtn");
  const meter = document.getElementById("meter");
  const meterFill = document.getElementById("meterFill");
  const hint = document.getElementById("hint");
  const MAX = 10;

  let count = 0;

  function renderCount() {
    countEl.textContent = String(count);
    meterFill.style.width = (count / MAX) * 100 + "%";
    meter.setAttribute("aria-valuenow", String(count));

    if (count === 0) hint.textContent = "点一点，看看 JS 在工作。";
    else if (count >= MAX) hint.textContent = "到顶了，这就是上限。";
    else hint.textContent = "再来 " + (MAX - count) + " 次就满了。";
  }

  plusBtn.addEventListener("click", function () {
    count = Math.min(count + 1, MAX);
    renderCount();
  });

  minusBtn.addEventListener("click", function () {
    count = Math.max(count - 1, 0);
    renderCount();
  });

  renderCount();

  /* ---------- 4. 滚动出现 ---------- */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 5. 页脚年份 ---------- */
  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
