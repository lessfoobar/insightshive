// js/modules/theme-manager.js - Updated to use BEM classes

export class ThemeManager {
  constructor() {
    this.initializeTheme();
    this.createThemeToggle();
    this.bindEvents();
  }

  createThemeToggle() {
    // Check if theme toggle already exists
    if (document.querySelector('.btn--theme-toggle')) {
      return;
    }

    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn--theme-toggle';  // ✅ Using BEM classes
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
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
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

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

    // Add a subtle animation effect
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
  }

  updateToggleIcon() {
    const themeToggle = document.querySelector('.btn--theme-toggle');  // ✅ Using BEM class
    if (themeToggle) {
      themeToggle.innerHTML = this.getThemeIcon();
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

  animateThemeChange() {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  bindEvents() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
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
  }
}