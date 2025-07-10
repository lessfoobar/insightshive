/**
 * Error Handler Utility
 * Centralized error handling and logging
 */

import { config } from './config.js';

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories
 */
export const ErrorCategory = {
  JAVASCRIPT: 'javascript',
  NETWORK: 'network',
  USER_INTERACTION: 'user_interaction',
  THIRD_PARTY: 'third_party',
  PERFORMANCE: 'performance',
  SECURITY: 'security'
};

/**
 * Handle and log errors with context
 * @param {Error|string} error - The error to handle
 * @param {string} context - Context where the error occurred
 * @param {string} severity - Error severity level
 * @param {string} category - Error category
 * @param {Object} additionalData - Additional error data
 */
export function handleError(error, context = 'Unknown', severity = ErrorSeverity.MEDIUM, category = ErrorCategory.JAVASCRIPT, additionalData = {}) {
  try {
    const errorInfo = createErrorInfo(error, context, severity, category, additionalData);
    
    // Log to console
    logToConsole(errorInfo);
    
    // Send to error tracking service (if available and enabled)
    sendToErrorTracker(errorInfo);
    
    // Store in session for debugging
    storeErrorInSession(errorInfo);
    
    // Handle critical errors
    if (severity === ErrorSeverity.CRITICAL) {
      handleCriticalError(errorInfo);
    }
    
    return errorInfo;
  } catch (handlingError) {
    // Fallback error handling
    console.error('Error in error handler:', handlingError);
    console.error('Original error:', error);
  }
}

/**
 * Create standardized error information object
 * @param {Error|string} error - Original error
 * @param {string} context - Error context
 * @param {string} severity - Error severity
 * @param {string} category - Error category
 * @param {Object} additionalData - Additional data
 * @returns {Object} Standardized error info
 */
function createErrorInfo(error, context, severity, category, additionalData) {
  const errorInfo = {
    id: generateErrorId(),
    timestamp: new Date().toISOString(),
    context,
    severity,
    category,
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewportSize: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    ...additionalData
  };

  // Handle different error types
  if (error instanceof Error) {
    errorInfo.message = error.message;
    errorInfo.stack = error.stack;
    errorInfo.name = error.name;
  } else if (typeof error === 'string') {
    errorInfo.message = error;
    errorInfo.name = 'StringError';
  } else {
    errorInfo.message = 'Unknown error type';
    errorInfo.name = 'UnknownError';
    errorInfo.originalError = error;
  }

  return errorInfo;
}

/**
 * Generate unique error ID
 * @returns {string} Unique error identifier
 */
function generateErrorId() {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log error to console with appropriate level
 * @param {Object} errorInfo - Error information
 */
function logToConsole(errorInfo) {
  const logLevel = getConsoleLogLevel(errorInfo.severity);
  const prefix = `[${errorInfo.severity.toUpperCase()}] ${errorInfo.context}:`;
  
  console[logLevel](prefix, errorInfo.message);
  
  if (config.debug && errorInfo.stack) {
    console[logLevel]('Stack trace:', errorInfo.stack);
  }
  
  if (config.debug) {
    console[logLevel]('Error details:', errorInfo);
  }
}

/**
 * Get appropriate console log level for severity
 * @param {string} severity - Error severity
 * @returns {string} Console method name
 */
function getConsoleLogLevel(severity) {
  switch (severity) {
    case ErrorSeverity.LOW:
      return 'log';
    case ErrorSeverity.MEDIUM:
      return 'warn';
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      return 'error';
    default:
      return 'warn';
  }
}

/**
 * Send error to tracking service
 * @param {Object} errorInfo - Error information
 */
function sendToErrorTracker(errorInfo) {
  try {
    // Check if error tracking is enabled and service is available
    if (!config.errorTracking.enabled) return;
    
    // Sentry integration
    if (window.Sentry && typeof window.Sentry.captureException === 'function') {
      window.Sentry.captureException(new Error(errorInfo.message), {
        tags: {
          context: errorInfo.context,
          severity: errorInfo.severity,
          category: errorInfo.category
        },
        extra: errorInfo
      });
    }
    
    // Custom error tracker
    if (window.errorTracker && typeof window.errorTracker.log === 'function') {
      window.errorTracker.log(errorInfo);
    }
    
    // LogRocket integration
    if (window.LogRocket && typeof window.LogRocket.captureException === 'function') {
      window.LogRocket.captureException(new Error(errorInfo.message));
    }
    
    // Bugsnag integration
    if (window.Bugsnag && typeof window.Bugsnag.notify === 'function') {
      window.Bugsnag.notify(new Error(errorInfo.message), {
        context: errorInfo.context,
        severity: errorInfo.severity,
        metadata: errorInfo
      });
    }
    
  } catch (trackingError) {
    console.warn('Failed to send error to tracking service:', trackingError);
  }
}

/**
 * Store error in session storage for debugging
 * @param {Object} errorInfo - Error information
 */
function storeErrorInSession(errorInfo) {
  try {
    if (!window.sessionStorage) return;
    
    const storageKey = 'insightshive_errors';
    const maxErrors = 50; // Limit stored errors
    
    let errors = [];
    try {
      const stored = sessionStorage.getItem(storageKey);
      errors = stored ? JSON.parse(stored) : [];
    } catch (parseError) {
      errors = [];
    }
    
    // Add new error
    errors.unshift(errorInfo);
    
    // Limit array size
    if (errors.length > maxErrors) {
      errors = errors.slice(0, maxErrors);
    }
    
    // Store back
    sessionStorage.setItem(storageKey, JSON.stringify(errors));
    
  } catch (storageError) {
    console.warn('Failed to store error in session:', storageError);
  }
}

/**
 * Handle critical errors that might break the application
 * @param {Object} errorInfo - Error information
 */
function handleCriticalError(errorInfo) {
  try {
    // Log critical error
    console.error('CRITICAL ERROR:', errorInfo);
    
    // Could show user notification for critical errors
    if (config.errorTracking.showUserNotification) {
      showErrorNotification('A critical error occurred. Please refresh the page or contact support.');
    }
    
    // Could trigger automatic error reporting
    if (config.errorTracking.autoReport) {
      reportCriticalError(errorInfo);
    }
    
  } catch (criticalHandlingError) {
    console.error('Failed to handle critical error:', criticalHandlingError);
  }
}

/**
 * Show error notification to user
 * @param {string} message - Error message to show
 */
function showErrorNotification(message) {
  try {
    // Create simple notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 300px;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
    `;
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    closeButton.addEventListener('click', () => {
      notification.remove();
    });
    
    notification.appendChild(closeButton);
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
    
  } catch (notificationError) {
    console.warn('Failed to show error notification:', notificationError);
  }
}

/**
 * Report critical error to external service
 * @param {Object} errorInfo - Error information
 */
function reportCriticalError(errorInfo) {
  try {
    // Could send to monitoring service
    if (config.errorTracking.endpoint) {
      fetch(config.errorTracking.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'critical_error',
          ...errorInfo
        })
      }).catch(fetchError => {
        console.warn('Failed to report critical error:', fetchError);
      });
    }
  } catch (reportError) {
    console.warn('Failed to report critical error:', reportError);
  }
}

/**
 * Get stored errors from session
 * @returns {Array} Array of stored error objects
 */
export function getStoredErrors() {
  try {
    if (!window.sessionStorage) return [];
    
    const stored = sessionStorage.getItem('insightshive_errors');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to get stored errors:', error);
    return [];
  }
}

/**
 * Clear stored errors
 */
export function clearStoredErrors() {
  try {
    if (window.sessionStorage) {
      sessionStorage.removeItem('insightshive_errors');
    }
  } catch (error) {
    console.warn('Failed to clear stored errors:', error);
  }
}

/**
 * Create error boundary for React-like error handling
 * @param {Function} fn - Function to wrap
 * @param {string} context - Error context
 * @returns {Function} Wrapped function
 */
export function createErrorBoundary(fn, context) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      handleError(error, context, ErrorSeverity.HIGH);
      return null;
    }
  };
}

/**
 * Async error boundary
 * @param {Function} fn - Async function to wrap
 * @param {string} context - Error context
 * @returns {Function} Wrapped async function
 */
export function createAsyncErrorBoundary(fn, context) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      handleError(error, context, ErrorSeverity.HIGH);
      return null;
    }
  };
}

// Global error handlers
window.addEventListener('error', (event) => {
  handleError(
    event.error || event.message,
    `Global Error: ${event.filename}:${event.lineno}:${event.colno}`,
    ErrorSeverity.HIGH,
    ErrorCategory.JAVASCRIPT,
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  );
});

window.addEventListener('unhandledrejection', (event) => {
  handleError(
    event.reason,
    'Unhandled Promise Rejection',
    ErrorSeverity.HIGH,
    ErrorCategory.JAVASCRIPT,
    {
      promise: event.promise
    }
  );
});

// Export default handler for convenience
export default handleError;