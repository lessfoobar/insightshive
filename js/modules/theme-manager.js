// js/modules/theme-manager.js - Enhanced with better animations and features

export class ThemeManager {
  constructor() {
    this.initializeTheme();
    this.createThemeToggle();
    this.bindEvents();
    this.initScrollEffects();
  }

  createThemeToggle() {
    // Check if theme toggle already exists
    if (document.querySelector('.btn--theme-toggle')) {
      return;
    }

    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn--theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    themeToggle.innerHTML = this.getThemeIcon();

    // Add event listener
    themeToggle.addEventListener('click', () => this.toggleTheme());

    // Append to body
    document.body.appendChild(themeToggle);
  }

  getThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    return currentTheme === 'dark' ? '☀️' : '🌙';
  }

  initializeTheme() {
    // Remove any existing class-based theme
    document.body.classList.remove('dark-theme', 'light-theme');

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    let initialTheme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = systemPrefersDark ? 'dark' : 'light';
    }

    this.setTheme(initialTheme);
    this.updateToggleIcon();
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    this.setTheme(newTheme);
    this.updateToggleIcon();

    // Enhanced animation effect
    this.animateThemeChange();
  }

  setTheme(theme) {
    // Set the data-theme attribute on html element
    document.documentElement.setAttribute('data-theme', theme);

    // Remove any old class-based themes
    document.body.classList.remove('dark-theme', 'light-theme');

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);

    // Update CSS custom properties for better performance
    this.updateCSSProperties(theme);
  }

  updateToggleIcon() {
    const themeToggle = document.querySelector('.btn--theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.getThemeIcon();

      // Add a subtle rotation animation
      themeToggle.style.transform = 'rotate(180deg) scale(1.1)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 300);
    }
  }

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    // Set theme color based on current theme
    metaThemeColor.content = theme === 'dark' ? '#2d2d2d' : '#ffffff';
  }

  updateCSSProperties(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.style.setProperty('--nav-bg-rgb', '45, 45, 45');
    } else {
      root.style.setProperty('--nav-bg-rgb', '255, 255, 255');
    }
  }

  animateThemeChange() {
    // Create a more sophisticated theme transition
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, transparent 0%, rgba(163, 89, 188, 0.1) 100%);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      document.body.style.transition =
        'background-color 0.3s ease, color 0.3s ease';
    });

    // Clean up
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.style.transition = '';
      }, 300);
    }, 150);
  }

  initScrollEffects() {
    // Add scroll effect to navigation
    const handleScroll = () => {
      const nav = document.querySelector('.nav');
      if (!nav) {
        return;
      }

      const currentScrollY = window.scrollY;

      // Add scrolled class when scrolling down
      if (currentScrollY > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  bindEvents() {
    // Listen for system theme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          this.setTheme(newTheme);
          this.updateToggleIcon();
        }
      });

    // Keyboard accessibility for theme toggle
    document.addEventListener('keydown', (e) => {
      // Toggle theme with Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // Handle visibility change to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause any animations when tab is not visible
        document.body.style.setProperty('--transition-base', 'none');
      } else {
        // Resume animations when tab becomes visible
        document.body.style.removeProperty('--transition-base');
      }
    });
  }
}
