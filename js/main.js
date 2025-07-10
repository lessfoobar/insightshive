/*
 * Main Application Entry Point - ES6 Module
 * Initializes all application modules
 */

import { ThemeManager } from './modules/theme-manager.js';
import { MobileMenu } from './modules/mobile-menu.js';
import { ImageFallback } from './modules/image-fallback.js';

class InsightsHiveApp {
  constructor() {
    this.themeManager = null;
    this.mobileMenu = null;
    this.imageFallback = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeModules());
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      // Initialize theme management
      this.themeManager = new ThemeManager();
      
      // Initialize mobile navigation
      this.mobileMenu = new MobileMenu();
      
      // Initialize image fallback handling
      this.imageFallback = new ImageFallback();

    } catch (error) {
      console.error('Error initializing InsightsHive app:', error);
    }
  }
}

// Initialize the application
const app = new InsightsHiveApp();