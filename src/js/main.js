/**
 * InsightsHive Website - Main JavaScript Entry Point
 * Week 2: Refactored with ES6 modules and improved architecture
 */

// Import modules
import { ThemeManager } from './modules/theme-manager.js';
import { MobileMenu } from './modules/mobile-menu.js';
import { config } from './utils/config.js';
import { handleError, ErrorSeverity, ErrorCategory } from './utils/error-handler.js';

/**
 * Application class - manages all site functionality
 */
class InsightsHiveApp {
  constructor() {
    this.themeManager = null;
    this.mobileMenu = null;
    this.isInitialized = false;
    this.startTime = performance.now();
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('InsightsHive App - Starting initialization...');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await this.waitForDOMReady();
      }
      
      // Initialize core modules
      await this.initializeModules();
      
      // Initialize image fallbacks
      this.initializeImageFallbacks();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Setup analytics
      this.setupAnalytics();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Calculate and log initialization time
      const initTime = performance.now() - this.startTime;
      console.log(`InsightsHive App - Initialized successfully in ${initTime.toFixed(2)}ms`);
      
      // Dispatch ready event
      this.dispatchReadyEvent();
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.init', ErrorSeverity.CRITICAL);
    }
  }

  /**
   * Wait for DOM to be ready
   */
  waitForDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState !== 'loading') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve);
      }
    });
  }

  /**
   * Initialize core modules
   */
  async initializeModules() {
    try {
      // Initialize theme manager
      if (config.features.darkMode) {
        this.themeManager = new ThemeManager();
      }
      
      // Initialize mobile menu
      if (config.features.mobileMenu) {
        this.mobileMenu = new MobileMenu();
      }
      
      console.log('Core modules initialized successfully');
    } catch (error) {
      handleError(error, 'InsightsHiveApp.initializeModules', ErrorSeverity.HIGH);
    }
  }

  /**
   * Initialize image fallback handling
   */
  initializeImageFallbacks() {
    try {
      const teamImages = document.querySelectorAll('.team-photo img');
      
      teamImages.forEach(img => {
        // Handle loading errors
        img.addEventListener('error', (event) => {
          this.handleImageError(event.target);
        });
        
        // Add loading animation
        img.addEventListener('load', (event) => {
          this.handleImageLoad(event.target);
        });
      });
      
      // Preload important images
      this.preloadImages();
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.initializeImageFallbacks', ErrorSeverity.MEDIUM);
    }
  }

  /**
   * Handle image loading errors
   * @param {HTMLImageElement} img - Failed image element
   */
  handleImageError(img) {
    try {
      const container = img.parentNode;
      const altText = img.getAttribute('alt') || 'User';
      
      // Hide the failed image
      img.style.display = 'none';
      
      // Add fallback styling
      container.classList.add('default');
      
      // Create initials from name
      const initials = altText
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
      
      container.innerHTML = initials;
      
      // Log for debugging
      if (config.debug) {
        console.warn(`Image failed to load: ${img.src}`);
      }
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.handleImageError', ErrorSeverity.LOW);
    }
  }

  /**
   * Handle successful image loading
   * @param {HTMLImageElement} img - Loaded image element
   */
  handleImageLoad(img) {
    try {
      // Add smooth fade-in animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.handleImageLoad', ErrorSeverity.LOW);
    }
  }

  /**
   * Preload important images for better performance
   */
  preloadImages() {
    try {
      const imageUrls = [
        'images/team/nikola-kalev.jpg',
        'images/team/ognyan-vasilev.jpg',
        'images/team/ivan-ivanov.jpg'
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        
        // Optional: Handle preload success/failure
        img.onload = () => {
          if (config.debug) {
            console.log(`Preloaded: ${url}`);
          }
        };
        
        img.onerror = () => {
          if (config.debug) {
            console.warn(`Failed to preload: ${url}`);
          }
        };
      });
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.preloadImages', ErrorSeverity.LOW);
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    try {
      if (!config.performance.enableTracking) return;
      
      // Monitor page load performance
      window.addEventListener('load', () => {
        this.measurePagePerformance();
      });
      
      // Monitor Core Web Vitals (if supported)
      this.monitorCoreWebVitals();
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.setupPerformanceMonitoring', ErrorSeverity.MEDIUM);
    }
  }

  /**
   * Measure page performance metrics
   */
  measurePagePerformance() {
    try {
      const perfData = performance.getEntriesByType('navigation')[0];
      
      if (perfData) {
        const metrics = {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstByte: perfData.responseStart - perfData.requestStart,
          domInteractive: perfData.domInteractive - perfData.navigationStart
        };
        
        console.log('Page Performance Metrics:', metrics);
        
        // Send to analytics if available
        if (window.analytics && typeof window.analytics.track === 'function') {
          window.analytics.track('page_performance', metrics);
        }
      }
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.measurePagePerformance', ErrorSeverity.LOW);
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    try {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      }
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.monitorCoreWebVitals', ErrorSeverity.LOW);
    }
  }

  /**
   * Setup analytics tracking
   */
  setupAnalytics() {
    try {
      if (!config.analytics.enabled) return;
      
      // Track page view
      this.trackPageView();
      
      // Setup interaction tracking
      this.setupInteractionTracking();
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.setupAnalytics', ErrorSeverity.MEDIUM);
    }
  }

  /**
   * Track page view
   */
  trackPageView() {
    try {
      const pageData = {
        page: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
        timestamp: Date.now()
      };
      
      // Send to analytics service
      if (window.plausible) {
        window.plausible('pageview', { props: pageData });
      }
      
      if (window.gtag) {
        window.gtag('event', 'page_view', pageData);
      }
      
      if (config.debug) {
        console.log('Page view tracked:', pageData);
      }
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.trackPageView', ErrorSeverity.LOW);
    }
  }

  /**
   * Setup interaction tracking
   */
  setupInteractionTracking() {
    try {
      // Track button clicks
      document.addEventListener('click', (event) => {
        const button = event.target.closest('button, .btn, .cta-button');
        if (button) {
          this.trackInteraction('button_click', {
            text: button.textContent?.trim(),
            class: button.className,
            id: button.id
          });
        }
      });
      
      // Track link clicks
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.href) {
          this.trackInteraction('link_click', {
            url: link.href,
            text: link.textContent?.trim(),
            external: !link.href.includes(window.location.hostname)
          });
        }
      });
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.setupInteractionTracking', ErrorSeverity.LOW);
    }
  }

  /**
   * Track user interaction
   * @param {string} action - Interaction action
   * @param {Object} data - Additional data
   */
  trackInteraction(action, data = {}) {
    try {
      if (!config.analytics.trackUserInteractions) return;
      
      const eventData = {
        action,
        ...data,
        timestamp: Date.now()
      };
      
      if (window.plausible) {
        window.plausible(action, { props: eventData });
      }
      
      if (window.gtag) {
        window.gtag('event', action, eventData);
      }
      
      if (config.debug) {
        console.log('Interaction tracked:', eventData);
      }
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.trackInteraction', ErrorSeverity.LOW);
    }
  }

  /**
   * Dispatch app ready event
   */
  dispatchReadyEvent() {
    try {
      const event = new CustomEvent('insightshive:ready', {
        detail: {
          app: this,
          config: config,
          timestamp: Date.now(),
          initTime: performance.now() - this.startTime
        }
      });
      
      document.dispatchEvent(event);
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.dispatchReadyEvent', ErrorSeverity.LOW);
    }
  }

  /**
   * Get app status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      modules: {
        themeManager: !!this.themeManager,
        mobileMenu: !!this.mobileMenu
      },
      config: config,
      performance: {
        initTime: performance.now() - this.startTime
      }
    };
  }

  /**
   * Destroy the application (cleanup)
   */
  destroy() {
    try {
      // Destroy modules
      if (this.themeManager) {
        this.themeManager.destroy();
        this.themeManager = null;
      }
      
      if (this.mobileMenu) {
        this.mobileMenu.destroy();
        this.mobileMenu = null;
      }
      
      // Mark as not initialized
      this.isInitialized = false;
      
      console.log('InsightsHive App - Destroyed successfully');
      
    } catch (error) {
      handleError(error, 'InsightsHiveApp.destroy', ErrorSeverity.MEDIUM);
    }
  }
}

// Initialize the application
let app;

try {
  app = new InsightsHiveApp();
} catch (error) {
  handleError(error, 'App Initialization', ErrorSeverity.CRITICAL);
}

// Export for external access
window.InsightsHive = {
  app,
  config,
  modules: {
    ThemeManager,
    MobileMenu
  },
  utils: {
    handleError,
    ErrorSeverity,
    ErrorCategory
  }
};

// Export for module usage
export default app;/**
 * InsightsHive Website - Main JavaScript Entry Point
 * Initializes all core functionality and modules
 */

// Import modules (will be created in Week 2)
// import { ThemeManager } from './modules/theme-manager.js';
// import { MobileMenu } from './modules/mobile-menu.js';
// import { ImageFallback } from './modules/image-fallback.js';

// Temporary: Keep existing functionality until Week 2 refactor
// This maintains current functionality while we prepare for modular structure

document.addEventListener('DOMContentLoaded', function() {
    console.log('InsightsHive Website - Initializing...');
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize image fallbacks
    initializeImageFallbacks();
    
    console.log('InsightsHive Website - Ready!');
});

/**
 * Mobile Menu Functionality
 * TODO: Move to modules/mobile-menu.js in Week 2
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create menu toggle button if it doesn't exist
    if (!menuToggle) {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            const newMenuToggle = document.createElement('button');
            newMenuToggle.className = 'menu-toggle';
            newMenuToggle.innerHTML = '<span></span><span></span><span></span>';
            newMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navContainer.appendChild(newMenuToggle);
            
            // Add event listener to new button
            newMenuToggle.addEventListener('click', toggleMenu);
        }
    } else {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    function toggleMenu() {
        const toggle = document.querySelector('.menu-toggle');
        const links = document.querySelector('.nav-links');
        
        if (toggle && links) {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (links.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
    
    // Close menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            const toggle = document.querySelector('.menu-toggle');
            const links = document.querySelector('.nav-links');
            if (toggle && links) {
                toggle.classList.remove('active');
                links.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const toggle = document.querySelector('.menu-toggle');
        const links = document.querySelector('.nav-links');
        
        if (toggle && links && !toggle.contains(event.target) && !links.contains(event.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const toggle = document.querySelector('.menu-toggle');
            const links = document.querySelector('.nav-links');
            if (toggle && links && links.classList.contains('active')) {
                toggle.classList.remove('active');
                links.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

/**
 * Dark Mode Functionality
 * TODO: Move to modules/theme-manager.js in Week 2
 */
function initializeDarkMode() {
    // Create the dark mode toggle button
    createThemeToggle();
    
    // Initialize theme based on user preference or system preference
    initializeTheme();
    
    function createThemeToggle() {
        // Check if theme toggle already exists
        if (document.querySelector('.theme-toggle')) return;
        
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = getThemeIcon();
        
        // Add event listener
        themeToggle.addEventListener('click', toggleTheme);
        
        // Append to body
        document.body.appendChild(themeToggle);
    }
    
    function getThemeIcon() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        return currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    function initializeTheme() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('insightshive-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme;
        if (savedTheme) {
            initialTheme = savedTheme;
        } else {
            initialTheme = 'dark'; // Default to dark theme
        }
        
        setTheme(initialTheme);
        updateToggleIcon();
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        updateToggleIcon();
        
        // Add a subtle animation effect
        animateThemeChange();
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('insightshive-theme', theme);
        
        // Update meta theme-color for mobile browsers
        updateMetaThemeColor(theme);
    }
    
    function updateToggleIcon() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = getThemeIcon();
            
            // Add a small animation when toggling
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    function updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set theme color based on current theme
        metaThemeColor.content = theme === 'dark' ? '#2d2d2d' : '#ffffff';
    }
    
    function animateThemeChange() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('insightshive-theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            updateToggleIcon();
        }
    });
    
    // Keyboard accessibility for theme toggle
    document.addEventListener('keydown', function(e) {
        // Toggle theme with Ctrl+D or Cmd+D
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

/**
 * Image Fallback Functionality
 * TODO: Move to modules/image-fallback.js in Week 2
 */
function initializeImageFallbacks() {
    // Handle image loading errors for team photos
    const teamImages = document.querySelectorAll('.team-photo img');
    
    teamImages.forEach(img => {
        img.addEventListener('error', function() {
            const container = this.parentNode;
            const altText = this.getAttribute('alt');
            
            // Hide the image
            this.style.display = 'none';
            
            // Add fallback styling
            container.classList.add('default');
            
            // Create initials from name
            const initials = altText.split(' ').map(name => name.charAt(0)).join('');
            container.innerHTML = initials;
        });
        
        // Add loading animation
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
    
    // Preload team images for better performance
    preloadTeamImages();
}

/**
 * Preload team images for better performance
 */
function preloadTeamImages() {
    const imageUrls = [
        'images/team/nikola-kalev.jpg',
        'images/team/ognyan-vasilev.jpg',
        'images/team/ivan-ivanov.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

/**
 * Error handling utility
 * TODO: Move to utils/error-handler.js in Week 2
 */
function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    
    // Optional: Send to error tracking service in production
    if (window.errorTracker && typeof window.errorTracker.log === 'function') {
        window.errorTracker.log(error, context);
    }
}

/**
 * Performance monitoring
 * TODO: Move to utils/performance.js in Week 2
 */
function measurePageLoad() {
    window.addEventListener('load', () => {
        try {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Optional: Send to analytics
            if (window.analytics && typeof window.analytics.track === 'function') {
                window.analytics.track('page_load_time', { duration: loadTime });
            }
        } catch (error) {
            handleError(error, 'measurePageLoad');
        }
    });
}

// Initialize performance monitoring
measurePageLoad();

// Global error handler
window.addEventListener('error', function(event) {
    handleError(event.error, 'Global Error Handler');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    handleError(event.reason, 'Unhandled Promise Rejection');
});

/**
 * Export functions for potential external use
 * TODO: Remove in Week 2 when moving to proper modules
 */
window.InsightsHive = {
    initializeMobileMenu,
    initializeDarkMode,
    initializeImageFallbacks,
    handleError,
    measurePageLoad
};