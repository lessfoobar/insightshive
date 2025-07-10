/**
 * Mobile Menu Module
 * Handles mobile navigation menu functionality
 */

import { config } from '../utils/config.js';
import { handleError } from '../utils/error-handler.js';

export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navList = null;
    this.navLinks = [];
    this.isOpen = false;
    this.bodyScrollTop = 0;
    
    this.init();
  }

  /**
   * Initialize the mobile menu
   */
  init() {
    try {
      this.findElements();
      this.createMenuToggleIfNeeded();
      this.bindEvents();
      this.setupAccessibility();
      console.log('MobileMenu: Initialized successfully');
    } catch (error) {
      handleError(error, 'MobileMenu.init');
    }
  }

  /**
   * Find existing menu elements
   */
  findElements() {
    this.menuToggle = document.querySelector('.menu-toggle, .nav__toggle');
    this.navList = document.querySelector('.nav-links, .nav__list');
    this.navLinks = Array.from(document.querySelectorAll('.nav-links a, .nav__link'));
  }

  /**
   * Create menu toggle button if it doesn't exist
   */
  createMenuToggleIfNeeded() {
    if (this.menuToggle) return;

    try {
      const navContainer = document.querySelector('.nav-container, .nav__content');
      if (!navContainer) {
        console.warn('MobileMenu: No navigation container found');
        return;
      }

      // Create toggle button
      this.menuToggle = document.createElement('button');
      this.menuToggle.className = 'btn btn--menu-toggle menu-toggle nav__toggle';
      this.menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-controls', 'navigation-menu');

      // Create hamburger lines
      for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        line.className = 'btn--menu-toggle__line nav__toggle-line';
        line.setAttribute('aria-hidden', 'true');
        this.menuToggle.appendChild(line);
      }

      // Add to container
      navContainer.appendChild(this.menuToggle);

      // Set ID on nav list for accessibility
      if (this.navList) {
        this.navList.id = 'navigation-menu';
      }
    } catch (error) {
      handleError(error, 'MobileMenu.createMenuToggleIfNeeded');
    }
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility() {
    try {
      if (this.navList) {
        this.navList.setAttribute('role', 'navigation');
        this.navList.setAttribute('aria-label', 'Main navigation');
      }

      if (this.menuToggle) {
        this.menuToggle.setAttribute('type', 'button');
      }
    } catch (error) {
      handleError(error, 'MobileMenu.setupAccessibility');
    }
  }

  /**
   * Toggle menu open/closed state
   */
  toggleMenu() {
    try {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    } catch (error) {
      handleError(error, 'MobileMenu.toggleMenu');
    }
  }

  /**
   * Open the mobile menu
   */
  openMenu() {
    try {
      this.isOpen = true;
      
      // Store current scroll position
      this.bodyScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add active classes
      if (this.menuToggle) {
        this.menuToggle.classList.add('active', 'is-active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
      }
      
      if (this.navList) {
        this.navList.classList.add('active', 'nav__list--active');
      }

      // Prevent body scroll
      this.disableBodyScroll();

      // Focus management
      this.trapFocus();

      // Dispatch custom event
      this.dispatchMenuEvent('open');

      // Analytics tracking
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('mobile_menu_opened');
      }
    } catch (error) {
      handleError(error, 'MobileMenu.openMenu');
    }
  }

  /**
   * Close the mobile menu
   */
  closeMenu() {
    try {
      this.isOpen = false;

      // Remove active classes
      if (this.menuToggle) {
        this.menuToggle.classList.remove('active', 'is-active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
      }
      
      if (this.navList) {
        this.navList.classList.remove('active', 'nav__list--active');
      }

      // Restore body scroll
      this.enableBodyScroll();

      // Restore focus to toggle button
      if (this.menuToggle) {
        this.menuToggle.focus();
      }

      // Dispatch custom event
      this.dispatchMenuEvent('close');

      // Analytics tracking
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('mobile_menu_closed');
      }
    } catch (error) {
      handleError(error, 'MobileMenu.closeMenu');
    }
  }

  /**
   * Disable body scroll when menu is open
   */
  disableBodyScroll() {
    try {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.bodyScrollTop}px`;
      document.body.style.width = '100%';
    } catch (error) {
      handleError(error, 'MobileMenu.disableBodyScroll');
    }
  }

  /**
   * Enable body scroll when menu is closed
   */
  enableBodyScroll() {
    try {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, this.bodyScrollTop);
    } catch (error) {
      handleError(error, 'MobileMenu.enableBodyScroll');
    }
  }

  /**
   * Trap focus within the menu when open
   */
  trapFocus() {
    try {
      if (!this.isOpen || !this.navList) return;

      const focusableElements = this.navList.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Focus first element
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }

      // Handle tab navigation
      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);

      // Store reference to remove later
      this.focusTrapHandler = handleTabKey;
    } catch (error) {
      handleError(error, 'MobileMenu.trapFocus');
    }
  }

  /**
   * Remove focus trap
   */
  removeFocusTrap() {
    try {
      if (this.focusTrapHandler) {
        document.removeEventListener('keydown', this.focusTrapHandler);
        this.focusTrapHandler = null;
      }
    } catch (error) {
      handleError(error, 'MobileMenu.removeFocusTrap');
    }
  }

  /**
   * Handle clicks outside the menu
   * @param {Event} event - Click event
   */
  handleOutsideClick(event) {
    try {
      if (!this.isOpen) return;

      const isClickInsideMenu = this.navList && this.navList.contains(event.target);
      const isClickOnToggle = this.menuToggle && this.menuToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle) {
        this.closeMenu();
      }
    } catch (error) {
      handleError(error, 'MobileMenu.handleOutsideClick');
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboard(event) {
    try {
      switch (event.key) {
        case 'Escape':
          if (this.isOpen) {
            this.closeMenu();
            event.preventDefault();
          }
          break;
        
        case 'Enter':
        case ' ':
          if (event.target === this.menuToggle) {
            this.toggleMenu();
            event.preventDefault();
          }
          break;
      }
    } catch (error) {
      handleError(error, 'MobileMenu.handleKeyboard');
    }
  }

  /**
   * Handle menu link clicks
   * @param {Event} event - Click event
   */
  handleLinkClick(event) {
    try {
      // Close menu when a link is clicked
      if (this.isOpen) {
        // Small delay to allow navigation to start
        setTimeout(() => {
          this.closeMenu();
        }, 100);
      }
    } catch (error) {
      handleError(error, 'MobileMenu.handleLinkClick');
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    try {
      // Close menu on resize to desktop size
      if (window.innerWidth > config.breakpoints.mobile && this.isOpen) {
        this.closeMenu();
      }
    } catch (error) {
      handleError(error, 'MobileMenu.handleResize');
    }
  }

  /**
   * Dispatch custom menu event
   * @param {string} action - 'open' or 'close'
   */
  dispatchMenuEvent(action) {
    try {
      const event = new CustomEvent('mobilemenu', {
        detail: { 
          action, 
          isOpen: this.isOpen,
          timestamp: Date.now()
        }
      });
      document.dispatchEvent(event);
    } catch (error) {
      handleError(error, 'MobileMenu.dispatchMenuEvent');
    }
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    try {
      // Toggle button click
      if (this.menuToggle) {
        this.menuToggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleMenu();
        });
      }

      // Menu link clicks
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => this.handleLinkClick(e));
      });

      // Outside clicks
      document.addEventListener('click', (e) => this.handleOutsideClick(e));

      // Keyboard navigation
      document.addEventListener('keydown', (e) => this.handleKeyboard(e));

      // Window resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.handleResize(), 250);
      });

      // Handle orientation change on mobile
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.handleResize(), 500);
      });

      // Close menu when page visibility changes (tab switching)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.isOpen) {
          this.closeMenu();
        }
      });
    } catch (error) {
      handleError(error, 'MobileMenu.bindEvents');
    }
  }

  /**
   * Check if menu is currently open
   * @returns {boolean} True if menu is open
   */
  isMenuOpen() {
    return this.isOpen;
  }

  /**
   * Force close menu (useful for external control)
   */
  forceClose() {
    if (this.isOpen) {
      this.closeMenu();
    }
  }

  /**
   * Update menu links (useful when navigation changes dynamically)
   */
  updateNavLinks() {
    try {
      this.navLinks = Array.from(document.querySelectorAll('.nav-links a, .nav__link'));
      
      // Re-bind link events
      this.navLinks.forEach(link => {
        link.removeEventListener('click', this.handleLinkClick);
        link.addEventListener('click', (e) => this.handleLinkClick(e));
      });
    } catch (error) {
      handleError(error, 'MobileMenu.updateNavLinks');
    }
  }

  /**
   * Destroy the mobile menu (cleanup)
   */
  destroy() {
    try {
      // Close menu if open
      if (this.isOpen) {
        this.closeMenu();
      }

      // Remove focus trap
      this.removeFocusTrap();

      // Remove event listeners
      if (this.menuToggle) {
        this.menuToggle.removeEventListener('click', this.toggleMenu);
      }

      this.navLinks.forEach(link => {
        link.removeEventListener('click', this.handleLinkClick);
      });

      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('keydown', this.handleKeyboard);
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('orientationchange', this.handleResize);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);

      // Clear references
      this.menuToggle = null;
      this.navList = null;
      this.navLinks = [];
      this.isOpen = false;
      
      console.log('MobileMenu: Destroyed successfully');
    } catch (error) {
      handleError(error, 'MobileMenu.destroy');
    }
  }
}