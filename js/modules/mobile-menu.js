// js/modules/mobile-menu.js - Enhanced with better UX and animations

export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navLinks = null;
    this.backdrop = null;
    this.isOpen = false;
    this.focusTrapHandler = null;
    this.init();
  }

  init() {
    this.createMenuToggle();
    this.createBackdrop();
    this.bindEvents();
    this.handleResize();
  }

  createMenuToggle() {
    const existingToggle = document.querySelector('.btn--menu-toggle');

    if (!existingToggle) {
      const navContainer = document.querySelector('.nav__container');
      if (!navContainer) {
        return;
      }

      const newMenuToggle = document.createElement('button');
      newMenuToggle.type = 'button';
      newMenuToggle.className = 'btn btn--menu-toggle';
      newMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      newMenuToggle.setAttribute('aria-expanded', 'false');
      newMenuToggle.setAttribute('aria-controls', 'navigation-menu');

      // Create hamburger lines using BEM classes
      newMenuToggle.innerHTML = `
        <span class="btn--menu-toggle__line"></span>
        <span class="btn--menu-toggle__line"></span>
        <span class="btn--menu-toggle__line"></span>
      `;

      navContainer.appendChild(newMenuToggle);
      this.menuToggle = newMenuToggle;
    } else {
      this.menuToggle = existingToggle;
    }

    this.navLinks = document.querySelector('.nav__links');
    if (this.navLinks) {
      this.navLinks.id = 'navigation-menu';
    }
  }

  createBackdrop() {
    // Create backdrop if it doesn't exist
    if (!document.querySelector('.nav__backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'nav__backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }
    this.backdrop = document.querySelector('.nav__backdrop');
  }

  toggleMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.isOpen = !this.isOpen;

    // Update ARIA attributes
    this.menuToggle.setAttribute('aria-expanded', this.isOpen.toString());

    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    // Add classes for open state
    this.menuToggle.classList.add('btn--menu-toggle--active');
    this.navLinks.classList.add('nav__links--active');

    if (this.backdrop) {
      this.backdrop.classList.add('nav__backdrop--active');
    }

    // Prevent body scroll with better handling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';

    // Focus management for accessibility
    this.trapFocus();

    // Add escape key listener
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  closeMenu() {
    if (!this.isOpen) {
      return;
    }

    // Remove classes for closed state
    this.menuToggle.classList.remove('btn--menu-toggle--active');
    this.navLinks.classList.remove('nav__links--active');

    if (this.backdrop) {
      this.backdrop.classList.remove('nav__backdrop--active');
    }

    // Restore body scroll with better handling
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    document.body.style.width = '';

    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }

    this.isOpen = false;
    this.menuToggle.setAttribute('aria-expanded', 'false');

    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscapeKey);

    // Return focus to toggle button
    this.menuToggle.focus();
  }

  trapFocus() {
    // Get all focusable elements within the nav
    const focusableElements = this.navLinks.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    setTimeout(() => firstElement.focus(), 100);

    // Handle tab key to trap focus
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') {
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        // Tab
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Store the handler to remove it later
    this.focusTrapHandler = handleTabKey;
  }

  // Fixed: Convert arrow function to regular method
  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeMenu();
    }
  }

  handleResize() {
    // Close menu when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  bindEvents() {
    // Bind menu toggle click
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }

    // Close menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav__links a');
    navLinksItems.forEach((link) => {
      link.addEventListener('click', () => {
        // Add a small delay to allow navigation to start
        setTimeout(() => this.closeMenu(), 100);
      });
    });

    // Close menu when clicking backdrop
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.closeMenu());
    }

    // Close menu when clicking outside (fallback)
    document.addEventListener('click', (event) => {
      if (this.isOpen &&
          this.menuToggle &&
          this.navLinks &&
          !this.menuToggle.contains(event.target) &&
          !this.navLinks.contains(event.target)) {
        this.closeMenu();
      }
    });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      if (this.isOpen) {
        // Small delay to let orientation change complete
        setTimeout(() => {
          this.closeMenu();
        }, 200);
      }
    });

    // Clean up focus trap when menu closes
    this.navLinks?.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'left' && !this.isOpen && this.focusTrapHandler) {
        document.removeEventListener('keydown', this.focusTrapHandler);
        this.focusTrapHandler = null;
      }
    });

    // Bind escape key handler to this instance
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }

  // Public method to close menu (can be called from other modules)
  close() {
    if (this.isOpen) {
      this.closeMenu();
    }
  }

  // Public method to check if menu is open
  get isMenuOpen() {
    return this.isOpen;
  }
}