/**
 * Legacy Home Investment — Main JavaScript
 * Navigation, smooth scroll, reveal animations, active nav state
 */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll("section[id], footer[id]");
  const revealElements = document.querySelectorAll(".reveal");

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "true");
    navMenu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      if (navMenu.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top: top, behavior: "smooth" });
      closeNav();
    });
  });

  document.addEventListener("click", function (event) {
    if (!navMenu || !navMenu.classList.contains("is-open")) return;
    if (
      !navMenu.contains(event.target) &&
      navToggle &&
      !navToggle.contains(event.target)
    ) {
      closeNav();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  function initRevealAnimations() {
    if (!revealElements.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initRevealAnimations();

  function setActiveNav() {
    if (!navLinks.length || !sections.length) return;

    const offset = (header ? header.offsetHeight : 0) + 100;
    let currentId = "home";

    sections.forEach(function (section) {
      if (section.offsetTop <= window.scrollY + offset) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const id = (link.getAttribute("href") || "").replace("#", "");
      link.classList.toggle("is-active", id === currentId);
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();
})();
