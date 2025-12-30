/*
 * Main Application Entry Point - Enhanced with component system
 * Initializes all application modules including page components
 */

import { ThemeManager } from "./modules/theme-manager.js";
import { MobileMenu } from "./modules/mobile-menu.js";
import { ImageFallback } from "./modules/image-fallback.js";
import { AnimationManager } from "./modules/animation-manager.js";
import { PageRenderer } from "./components/page-components.js";
import { getCurrentPageConfig } from "./config/page-configs.js";

class InsightsHiveApp {
  constructor() {
    this.themeManager = null;
    this.mobileMenu = null;
    this.imageFallback = null;
    this.animationManager = null;
    this.pageRenderer = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeModules(),
      );
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      // Initialize page components first (injects header, nav, footer)
      this.pageRenderer = new PageRenderer(getCurrentPageConfig());

      // Initialize theme management after page components are rendered
      setTimeout(() => {
        this.themeManager = new ThemeManager();

        // Initialize mobile navigation
        this.mobileMenu = new MobileMenu();

        // Initialize image fallback handling
        this.imageFallback = new ImageFallback();

        // Initialize animations and scroll effects
        this.animationManager = new AnimationManager();

        // Initialize additional features
        this.initializeUtilities();

        console.log("🚀 InsightsHive app initialized successfully");
      }, 100); // Small delay to ensure DOM elements are rendered
    } catch (error) {
      console.error("Error initializing InsightsHive app:", error);
    }
  }

  initializeUtilities() {
    // Smooth scroll for anchor links
    this.initSmoothScroll();

    // Initialize form enhancements
    this.initFormEnhancements();

    // Initialize performance optimizations
    this.initPerformanceOptimizations();

    // Initialize accessibility improvements
    this.initAccessibilityFeatures();
  }

  initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  initFormEnhancements() {
    // Add loading states to buttons in forms
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        const submitButton = form.querySelector(
          'button[type="submit"], input[type="submit"]',
        );
        if (submitButton) {
          submitButton.classList.add("btn--loading");
          submitButton.disabled = true;
        }
      });
    });

    // Email validation for contact forms
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach((input) => {
      input.addEventListener("blur", this.validateEmail);
    });
  }

  validateEmail(e) {
    const email = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (email && !isValid) {
      e.target.style.borderColor = "var(--color-error, #dc3545)";
      e.target.setAttribute("aria-invalid", "true");
    } else {
      e.target.style.borderColor = "";
      e.target.removeAttribute("aria-invalid");
    }
  }

  initPerformanceOptimizations() {
    // Lazy load images if browser doesn't support it natively
    if (!("loading" in HTMLImageElement.prototype)) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach((img) => imageObserver.observe(img));
      }
    }

    // Preload critical resources
    this.preloadCriticalResources();
  }

  preloadCriticalResources() {
    // Preload team member images
    const teamImages = [
      "images/team/nikola-kalev.jpg",
      "images/team/ognyan-vasilev.jpg",
      "images/team/ivan-ivanov.jpg",
    ];

    teamImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  initAccessibilityFeatures() {
    // Skip to main content functionality
    this.addSkipToMain();

    // Improve focus management
    this.improveFocusManagement();

    // Add keyboard shortcuts
    this.addKeyboardShortcuts();
  }

  addSkipToMain() {
    if (!document.querySelector(".skip-to-main")) {
      const skipLink = document.createElement("a");
      skipLink.href = "#main";
      skipLink.className = "skip-to-main";
      skipLink.textContent = "Skip to main content";
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-primary);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 9999;
        transition: top 0.3s;
      `;

      skipLink.addEventListener("focus", () => {
        skipLink.style.top = "6px";
      });

      skipLink.addEventListener("blur", () => {
        skipLink.style.top = "-40px";
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }

  improveFocusManagement() {
    // Ensure focus is visible for keyboard users
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });

    // Add CSS for keyboard navigation
    if (!document.querySelector("#keyboard-nav-styles")) {
      const styles = document.createElement("style");
      styles.id = "keyboard-nav-styles";
      styles.textContent = `
        .keyboard-navigation *:focus {
          outline: 2px solid var(--accent-primary) !important;
          outline-offset: 2px !important;
        }
        
        .keyboard-navigation .card:focus,
        .keyboard-navigation .btn:focus {
          box-shadow: 0 0 0 3px rgba(163, 89, 188, 0.3) !important;
        }
      `;
      document.head.appendChild(styles);
    }
  }

  addKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Alt + H = Home
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        window.location.href = "index.html";
      }

      // Alt + C = Contact
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        window.location.href = "contact.html";
      }

      // Alt + T = Team
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        window.location.href = "team.html";
      }

      // Escape = Close mobile menu
      if (e.key === "Escape" && this.mobileMenu && this.mobileMenu.isMenuOpen) {
        this.mobileMenu.close();
      }
    });
  }

  // Public method to show loading state on any card
  showCardLoading(cardSelector) {
    if (this.animationManager) {
      return this.animationManager.showCardLoading(cardSelector);
    }
  }

  // Public method to animate new elements
  animateNewElement(element, delay = 0) {
    if (this.animationManager) {
      this.animationManager.animateNewElement(element, delay);
    }
  }

  // Cleanup method for SPA navigation (if needed)
  destroy() {
    if (this.animationManager) {
      this.animationManager.destroy();
    }
  }
}

// Initialize the application
const app = new InsightsHiveApp();

// Make app available globally for debugging
window.InsightsHiveApp = app;
