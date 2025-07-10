/**
 * Application Configuration
 * Centralized configuration management
 */

// Environment detection
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.includes('localhost');

const isProduction = !isDevelopment;

/**
 * Main application configuration
 */
export const config = {
  // Environment
  environment: isDevelopment ? 'development' : 'production',
  isDevelopment,
  isProduction,
  
  // Debug settings
  debug: isDevelopment,
  verboseLogging: isDevelopment,
  
  // Application metadata
  app: {
    name: 'InsightsHive',
    version: '1.0.0',
    description: 'AI-Powered Retail Intelligence Platform',
    author: 'InsightsHive Team',
    website: 'https://insightshive.com'
  },
  
  // Theme configuration
  theme: {
    default: 'dark',
    storageKey: 'insightshive-theme',
    transitions: true
  },
  
  // Animation settings
  animation: {
    duration: 300,
    easing: 'ease-in-out',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Responsive breakpoints (in pixels)
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
    large: 1440
  },
  
  // Performance settings
  performance: {
    enableTracking: isProduction,
    imageOptimization: true,
    lazyLoading: true,
    preloadCritical: true
  },
  
  // Error tracking
  errorTracking: {
    enabled: isProduction,
    autoReport: isProduction,
    showUserNotification: false,
    endpoint: isDevelopment ? null : '/api/errors'
  },
  
  // Analytics
  analytics: {
    enabled: isProduction,
    trackPageViews: true,
    trackUserInteractions: true,
    trackErrors: true,
    trackPerformance: true
  },
  
  // API endpoints
  api: {
    baseUrl: isDevelopment ? 'http://localhost:3001' : 'https://api.insightshive.com',
    timeout: 10000,
    retries: 3
  },
  
  // Feature flags
  features: {
    darkMode: true,
    mobileMenu: true,
    analytics: isProduction,
    errorTracking: isProduction,
    performanceMonitoring: isProduction,
    imageOptimization: true,
    serviceWorker: isProduction
  },
  
  // Contact information
  contact: {
    email: 'info@insightshive.com',
    businessEmail: 'info@insightshive.com',
    linkedIn: {
      nikola: 'https://www.linkedin.com/in/nikola-k-393b18104/',
      ognyan: 'https://www.linkedin.com/in/ognyan-v-vasilev/'
    }
  },
  
  // Content settings
  content: {
    maxImageSize: 2 * 1024 * 1024, // 2MB
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    fallbackImages: {
      teamMember: '/images/team/placeholder.jpg',
      hero: '/images/hero-fallback.jpg'
    }
  },
  
  // Security settings
  security: {
    enableCSP: isProduction,
    enableHTTPS: isProduction,
    enableHSTS: isProduction,
    enableXSSProtection: true
  },
  
  // Cache settings
  cache: {
    staticAssets: isProduction ? 86400 : 0, // 24 hours in production
    apiResponses: 300, // 5 minutes
    images: isProduction ? 604800 : 0 // 7 days in production
  },
  
  // External services
  services: {
    googleAnalytics: {
      enabled: isProduction,
      trackingId: process.env.GA_TRACKING_ID || null
    },
    plausible: {
      enabled: isProduction,
      domain: process.env.PLAUSIBLE_DOMAIN || null
    },
    sentry: {
      enabled: isProduction,
      dsn: process.env.SENTRY_DSN || null
    }
  },
  
  // UI settings
  ui: {
    toast: {
      duration: 5000,
      position: 'top-right'
    },
    modal: {
      closeOnBackdropClick: true,
      closeOnEscape: true
    },
    navigation: {
      stickyHeader: true,
      mobileBreakpoint: 768
    }
  },
  
  // Accessibility settings
  accessibility: {
    skipLinks: true,
    focusVisible: true,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches
  }
};

/**
 * Get configuration value by path
 * @param {string} path - Dot-separated path to config value
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Configuration value
 */
export function getConfig(path, defaultValue = null) {
  try {
    return path.split('.').reduce((obj, key) => obj?.[key], config) ?? defaultValue;
  } catch (error) {
    console.warn(`Failed to get config value for path: ${path}`, error);
    return defaultValue;
  }
}

/**
 * Set configuration value by path
 * @param {string} path - Dot-separated path to config value
 * @param {*} value - Value to set
 */
export function setConfig(path, value) {
  try {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!(key in obj)) {
        obj[key] = {};
      }
      return obj[key];
    }, config);
    
    target[lastKey] = value;
  } catch (error) {
    console.warn(`Failed to set config value for path: ${path}`, error);
  }
}

/**
 * Check if feature is enabled
 * @param {string} featureName - Name of the feature
 * @returns {boolean} True if feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return getConfig(`features.${featureName}`, false);
}

/**
 * Get breakpoint value
 * @param {string} breakpointName - Name of the breakpoint
 * @returns {number} Breakpoint value in pixels
 */
export function getBreakpoint(breakpointName) {
  return getConfig(`breakpoints.${breakpointName}`, 768);
}

/**
 * Check if current viewport matches breakpoint
 * @param {string} breakpointName - Name of the breakpoint
 * @param {string} operator - Comparison operator ('>', '<', '>=', '<=', '=')
 * @returns {boolean} True if viewport matches condition
 */
export function matchesBreakpoint(breakpointName, operator = '<=') {
  const breakpoint = getBreakpoint(breakpointName);
  const viewportWidth = window.innerWidth;
  
  switch (operator) {
    case '>':
      return viewportWidth > breakpoint;
    case '<':
      return viewportWidth < breakpoint;
    case '>=':
      return viewportWidth >= breakpoint;
    case '<=':
      return viewportWidth <= breakpoint;
    case '=':
    case '==':
      return viewportWidth === breakpoint;
    default:
      return viewportWidth <= breakpoint;
  }
}

/**
 * Check if we're on mobile device
 * @returns {boolean} True if mobile
 */
export function isMobile() {
  return matchesBreakpoint('mobile', '<=');
}

/**
 * Check if we're on tablet device
 * @returns {boolean} True if tablet
 */
export function isTablet() {
  return matchesBreakpoint('tablet', '<=') && matchesBreakpoint('mobile', '>');
}

/**
 * Check if we're on desktop device
 * @returns {boolean} True if desktop
 */
export function isDesktop() {
  return matchesBreakpoint('tablet', '>');
}

/**
 * Get environment-specific configuration
 * @returns {Object} Environment config
 */
export function getEnvironmentConfig() {
  return {
    isDevelopment,
    isProduction,
    debug: config.debug,
    apiBaseUrl: config.api.baseUrl
  };
}

/**
 * Update configuration based on user preferences or runtime conditions
 */
export function updateRuntimeConfig() {
  try {
    // Update reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    config.animation.reducedMotion = reducedMotionQuery.matches;
    config.accessibility.reducedMotion = reducedMotionQuery.matches;
    
    // Update high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    config.accessibility.highContrast = highContrastQuery.matches;
    
    // Listen for changes
    reducedMotionQuery.addEventListener('change', (e) => {
      config.animation.reducedMotion = e.matches;
      config.accessibility.reducedMotion = e.matches;
    });
    
    highContrastQuery.addEventListener('change', (e) => {
      config.accessibility.highContrast = e.matches;
    });
    
    // Update viewport-based settings
    const updateViewportConfig = () => {
      config.ui.navigation.isMobile = isMobile();
      config.ui.navigation.isTablet = isTablet();
      config.ui.navigation.isDesktop = isDesktop();
    };
    
    updateViewportConfig();
    window.addEventListener('resize', updateViewportConfig);
    
  } catch (error) {
    console.warn('Failed to update runtime config:', error);
  }
}

/**
 * Validate configuration on initialization
 */
export function validateConfig() {
  try {
    const required = [
      'app.name',
      'theme.default',
      'breakpoints.mobile'
    ];
    
    const missing = required.filter(path => getConfig(path) === null);
    
    if (missing.length > 0) {
      console.warn('Missing required configuration:', missing);
    }
    
    // Validate breakpoints are numbers
    Object.entries(config.breakpoints).forEach(([key, value]) => {
      if (typeof value !== 'number') {
        console.warn(`Invalid breakpoint value for ${key}: ${value}`);
      }
    });
    
    console.log('Configuration validated successfully');
  } catch (error) {
    console.warn('Configuration validation failed:', error);
  }
}

/**
 * Export configuration as read-only proxy (prevents accidental mutations)
 */
export function getReadOnlyConfig() {
  return new Proxy(config, {
    set() {
      console.warn('Configuration is read-only. Use setConfig() to modify values.');
      return false;
    },
    deleteProperty() {
      console.warn('Configuration properties cannot be deleted.');
      return false;
    }
  });
}

/**
 * Initialize configuration
 */
export function initializeConfig() {
  try {
    validateConfig();
    updateRuntimeConfig();
    
    if (config.debug) {
      console.log('Configuration initialized:', config);
    }
  } catch (error) {
    console.error('Failed to initialize configuration:', error);
  }
}

// Auto-initialize if not in test environment
if (typeof window !== 'undefined' && !window.__TESTING__) {
  initializeConfig();
}

// Export default config for convenience
export default config;