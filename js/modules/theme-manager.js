// Theme Manager Module - ES6 Module for dark/light theme switching
export class ThemeManager {
  constructor() {
    this.initializeTheme();
    this.createThemeToggle();
    this.bindEvents();
  }

  createThemeToggle() {
    // Check if theme toggle already exists
    if (document.querySelector('.theme-toggle')) {
      return;
    }

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  updateToggleIcon() {
    const themeToggle = document.querySelector('.theme-toggle');
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
    document.body.style.transition = 'none';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 50);
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