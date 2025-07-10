/**
 * Theme Manager Module
 * Handles dark/light theme switching and persistence
 */

import { config } from '../utils/config.js';
import { handleError } from '../utils/error-handler.js';

export class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.toggleButton = null;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }

  /**
   * Initialize the theme manager
   */
  init() {
    try {
      this.createToggleButton();
      this.initializeTheme();
      this.bindEvents();
      console.log('ThemeManager: Initialized successfully');
    } catch (error) {
      handleError(error, 'ThemeManager.init');
    }
  }

  /**
   * Create the theme toggle button
   */
  createToggleButton() {
    // Check if toggle button already exists
    if (document.querySelector('.theme-toggle')) {
      this.toggleButton = document.querySelector('.theme-toggle');
      return;
    }

    // Create new toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'btn btn--theme-toggle theme-toggle';
    this.toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    this.toggleButton.setAttribute('title', 'Toggle theme');
    this.toggleButton.innerHTML = this.getThemeIcon();

    // Add to DOM
    document.body.appendChild(this.toggleButton);
  }

  /**
   * Get the appropriate icon for current theme
   * @returns {string} Theme icon emoji
   */
  getThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    return currentTheme === 'dark' ? '☀️' : '🌙';
  }

  /**
   * Initialize theme based on user preference or system preference
   */
  initializeTheme() {
    try {
      const savedTheme = localStorage.getItem(config.theme.storageKey);
      const systemPrefersDark = this.mediaQuery.matches;

      let initialTheme;
      if (savedTheme) {
        initialTheme = savedTheme;
      } else {
        initialTheme = config.theme.default;
      }

      this.setTheme(initialTheme);
      this.updateToggleButton();
    } catch (error) {
      handleError(error, 'ThemeManager.initializeTheme');
      // Fallback to default theme
      this.setTheme(config.theme.default);
    }
  }

  /**
   * Set the theme
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    try {
      if (!['light', 'dark'].includes(theme)) {
        throw new Error(`Invalid theme: ${theme}`);
      }

      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(config.theme.storageKey, theme);
      this.updateMetaThemeColor(theme);

      // Dispatch custom event for other components
      this.dispatchThemeChangeEvent(theme);
    } catch (error) {
      handleError(error, 'ThemeManager.setTheme');
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    try {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      this.updateToggleButton();
      this.animateThemeChange();

      // Analytics tracking (if available)
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('theme_toggle', { theme: newTheme });
      }
    } catch (error) {
      handleError(error, 'ThemeManager.toggleTheme');
    }
  }

  /**
   * Update the toggle button icon and state
   */
  updateToggleButton() {
    if (!this.toggleButton) return;

    try {
      this.toggleButton.innerHTML = this.getThemeIcon();
      this.toggleButton.setAttribute('aria-label', 
        `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`);
      
      // Add animation
      this.toggleButton.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.toggleButton.style.transform = 'scale(1)';
      }, config.animation.duration / 2);
    } catch (error) {
      handleError(error, 'ThemeManager.updateToggleButton');
    }
  }

  /**
   * Update meta theme-color for mobile browsers
   * @param {string} theme - Current theme
   */
  updateMetaThemeColor(theme) {
    try {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }

      // Set theme color based on current theme
      const colors = {
        dark: '#2d2d2d',
        light: '#ffffff'
      };
      
      metaThemeColor.content = colors[theme] || colors.light;
    } catch (error) {
      handleError(error, 'ThemeManager.updateMetaThemeColor');
    }
  }

  /**
   * Add subtle animation during theme changes
   */
  animateThemeChange() {
    try {
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        el.style.transition = `background-color ${config.animation.duration}ms ${config.animation.easing}, 
                              color ${config.animation.duration}ms ${config.animation.easing}, 
                              border-color ${config.animation.duration}ms ${config.animation.easing}`;
      });

      // Remove transition after animation completes
      setTimeout(() => {
        elements.forEach(el => {
          el.style.transition = '';
        });
      }, config.animation.duration);
    } catch (error) {
      handleError(error, 'ThemeManager.animateThemeChange');
    }
  }

  /**
   * Dispatch custom theme change event
   * @param {string} theme - New theme
   */
  dispatchThemeChangeEvent(theme) {
    try {
      const event = new CustomEvent('themechange', {
        detail: { theme, timestamp: Date.now() }
      });
      document.dispatchEvent(event);
    } catch (error) {
      handleError(error, 'ThemeManager.dispatchThemeChangeEvent');
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    try {
      // Toggle button click
      if (this.toggleButton) {
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
      }

      // Keyboard shortcut (Ctrl+D or Cmd+D)
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
          e.preventDefault();
          this.toggleTheme();
        }
      });

      // System theme changes
      this.mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem(config.theme.storageKey)) {
          const newTheme = e.matches ? 'dark' : 'light';
          this.setTheme(newTheme);
          this.updateToggleButton();
        }
      });

      // Handle visibility change (when tab becomes active)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          // Refresh theme state when tab becomes visible
          this.updateToggleButton();
        }
      });
    } catch (error) {
      handleError(error, 'ThemeManager.bindEvents');
    }
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Check if current theme is dark
   * @returns {boolean} True if dark theme is active
   */
  isDarkTheme() {
    return this.currentTheme === 'dark';
  }

  /**
   * Check if current theme is light
   * @returns {boolean} True if light theme is active
   */
  isLightTheme() {
    return this.currentTheme === 'light';
  }

  /**
   * Force a specific theme (useful for demos or testing)
   * @param {string} theme - Theme to force
   */
  forceTheme(theme) {
    if (!['light', 'dark'].includes(theme)) {
      throw new Error(`Invalid theme: ${theme}`);
    }
    
    this.setTheme(theme);
    this.updateToggleButton();
  }

  /**
   * Reset to system preference
   */
  resetToSystemPreference() {
    try {
      localStorage.removeItem(config.theme.storageKey);
      const systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
      this.setTheme(systemTheme);
      this.updateToggleButton();
    } catch (error) {
      handleError(error, 'ThemeManager.resetToSystemPreference');
    }
  }

  /**
   * Destroy the theme manager (cleanup)
   */
  destroy() {
    try {
      // Remove event listeners
      if (this.toggleButton) {
        this.toggleButton.removeEventListener('click', this.toggleTheme);
        this.toggleButton.remove();
      }

      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
      
      // Clear references
      this.toggleButton = null;
      this.currentTheme = null;
      
      console.log('ThemeManager: Destroyed successfully');
    } catch (error) {
      handleError(error, 'ThemeManager.destroy');
    }
  }
}