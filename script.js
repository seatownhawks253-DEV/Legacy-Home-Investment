/**
 * Legacy Home Investment — Main JavaScript
 * Vanilla JS: navigation, scroll effects, reveal animations, form validation
 */

(function () {
  "use strict";

  /* --- DOM references ----------------------------------------------------- */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll("section[id], footer[id]");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.querySelector(".form-success");

  /* --- Sticky header on scroll -------------------------------------------- */
  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* --- Mobile navigation toggle ------------------------------------------- */
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
      const isOpen = navMenu.classList.contains("is-open");
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  /* --- Smooth scroll + close mobile nav on link click --------------------- */
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

  /* Close nav when clicking outside */
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

  /* Close nav on escape key */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  /* --- Intersection Observer: fade-in sections ---------------------------- */
  function initRevealAnimations() {
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
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

  /* --- Contact form validation & submit ----------------------------------- */
  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    if (!value.trim()) return true;
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  }

  function setFieldError(group, message) {
    if (!group) return;
    group.classList.add("form-group--error");
    const errorEl = group.querySelector(".form-error");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".form-group--error").forEach(function (group) {
      group.classList.remove("form-group--error");
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFieldErrors(contactForm);

      if (formSuccess) {
        formSuccess.classList.remove("is-visible");
      }

      const name = contactForm.querySelector("#name");
      const email = contactForm.querySelector("#email");
      const phone = contactForm.querySelector("#phone");
      const message = contactForm.querySelector("#message");

      let isValid = true;

      if (!name.value.trim()) {
        setFieldError(
          name.closest(".form-group"),
          "Please enter your name."
        );
        isValid = false;
      }

      if (!email.value.trim() || !validateEmail(email.value)) {
        setFieldError(
          email.closest(".form-group"),
          "Please enter a valid email address."
        );
        isValid = false;
      }

      if (!validatePhone(phone.value)) {
        setFieldError(
          phone.closest(".form-group"),
          "Please enter a valid phone number."
        );
        isValid = false;
      }

      if (!message.value.trim()) {
        setFieldError(
          message.closest(".form-group"),
          "Please tell us how we can help."
        );
        isValid = false;
      }

      if (!isValid) return;

      /* Static site: show success UI. Replace with Formspree/Netlify endpoint as needed. */
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      /* Optional mailto fallback for immediate use without backend */
      const subject = encodeURIComponent(
        "Legacy Home Investment — Website Inquiry"
      );
      const body = encodeURIComponent(
        "Name: " +
          name.value.trim() +
          "\nEmail: " +
          email.value.trim() +
          "\nPhone: " +
          phone.value.trim() +
          "\n\nMessage:\n" +
          message.value.trim()
      );

      /* Simulate brief send delay for UX */
      window.setTimeout(function () {
        if (formSuccess) {
          formSuccess.classList.add("is-visible");
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }

        /* Uncomment to open mail client on submit:
        window.location.href =
          "mailto:Doug@legacyhomeinvestment.com?subject=" +
          subject +
          "&body=" +
          body;
        */
      }, 600);
    });

    /* Clear errors on input */
    contactForm.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        const group = field.closest(".form-group");
        if (group) group.classList.remove("form-group--error");
      });
    });
  }

  /* --- Highlight active nav on scroll ------------------------------------- */
  function setActiveNav() {
    if (!navLinks.length || !sections.length) return;

    const offset = (header ? header.offsetHeight : 0) + 100;
    let currentId = "";

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
