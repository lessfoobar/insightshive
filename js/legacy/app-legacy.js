/*
 * Legacy Browser Support - Non-module version
 * Fallback for browsers that don't support ES6 modules
 */

/* eslint-disable prefer-arrow-callback */

(function () {
  'use strict';

  // Theme Manager
  function ThemeManager() {
    this.init();
  }

  ThemeManager.prototype.init = function () {
    this.initializeTheme();
    this.createThemeToggle();
    this.bindEvents();
  };

  ThemeManager.prototype.createThemeToggle = function () {
    if (document.querySelector('.theme-toggle')) {
      return;
    }

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = this.getThemeIcon();

    const self = this;
    themeToggle.addEventListener('click', function () {
      self.toggleTheme();
    });

    document.body.appendChild(themeToggle);
  };

  ThemeManager.prototype.getThemeIcon = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    return currentTheme === 'dark' ? '☀️' : '🌙';
  };

  ThemeManager.prototype.initializeTheme = function () {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialTheme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = systemPrefersDark ? 'dark' : 'light';
    }

    this.setTheme(initialTheme);
    this.updateToggleIcon();
  };

  ThemeManager.prototype.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    this.setTheme(newTheme);
    this.updateToggleIcon();
    this.animateThemeChange();
  };

  ThemeManager.prototype.setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateMetaThemeColor(theme);
  };

  ThemeManager.prototype.updateToggleIcon = function () {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.getThemeIcon();
    }
  };

  ThemeManager.prototype.updateMetaThemeColor = function (theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = theme === 'dark' ? '#2d2d2d' : '#ffffff';
  };

  ThemeManager.prototype.animateThemeChange = function () {
    document.body.style.transition = 'none';
    setTimeout(function () {
      document.body.style.transition = '';
    }, 50);
  };

  ThemeManager.prototype.bindEvents = function () {
    const self = this;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        self.setTheme(newTheme);
        self.updateToggleIcon();
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        self.toggleTheme();
      }
    });
  };

  // Mobile Menu
  function MobileMenu() {
    this.menuToggle = null;
    this.navLinks = null;
    this.init();
  }

  MobileMenu.prototype.init = function () {
    this.createMenuToggle();
    this.bindEvents();
  };

  MobileMenu.prototype.createMenuToggle = function () {
    const existingToggle = document.querySelector('.menu-toggle');

    if (!existingToggle) {
      const navContainer = document.querySelector('.nav-container');
      if (!navContainer) {
        return;
      }

      const newMenuToggle = document.createElement('button');
      newMenuToggle.className = 'menu-toggle';
      newMenuToggle.innerHTML = '<span></span><span></span><span></span>';
      newMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navContainer.appendChild(newMenuToggle);

      this.menuToggle = newMenuToggle;
    } else {
      this.menuToggle = existingToggle;
    }

    this.navLinks = document.querySelector('.nav-links');
  };

  MobileMenu.prototype.toggleMenu = function () {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.menuToggle.classList.toggle('active');
    this.navLinks.classList.toggle('active');

    if (this.navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  MobileMenu.prototype.closeMenu = function () {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.menuToggle.classList.remove('active');
    this.navLinks.classList.remove('active');
    document.body.style.overflow = '';
  };

  MobileMenu.prototype.bindEvents = function () {
    const self = this;

    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', function () {
        self.toggleMenu();
      });
    }

    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(function (link) {
      link.addEventListener('click', function () {
        self.closeMenu();
      });
    });

    document.addEventListener('click', function (event) {
      if (self.menuToggle && self.navLinks &&
          !self.menuToggle.contains(event.target) &&
          !self.navLinks.contains(event.target)) {
        self.closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.navLinks && self.navLinks.classList.contains('active')) {
        self.closeMenu();
      }
    });
  };

  // Initialize when DOM is ready
  function initApp() {
    /* eslint-disable no-new */
    new ThemeManager();
    new MobileMenu();
    /* eslint-enable no-new */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}());

/* eslint-enable prefer-arrow-callback */