// js/modules/mobile-menu.js

export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navLinks = null;
    this.backdrop = null;
    this.closeButton = null;
    this.isOpen = false;
    this.focusTrapHandler = null;
    this.linkClickHandler = null;
    this.init();
  }

  init() {
    this.createMenuToggle();
    this.createBackdrop();
    this.createCloseButton();
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

  createCloseButton() {
    // Create close button if it doesn't exist
    if (!document.querySelector('.nav__close')) {
      const closeButton = document.createElement('button');
      closeButton.className = 'nav__close';
      closeButton.setAttribute('aria-label', 'Close navigation menu');
      closeButton.innerHTML = '×';
      document.body.appendChild(closeButton);
    }
    this.closeButton = document.querySelector('.nav__close');
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

    // Show close button
    if (this.closeButton) {
      this.closeButton.style.display = 'flex';
    }

    // Prevent body scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Store scroll position for restoration
    document.body.dataset.scrollY = scrollY.toString();

    // Add escape key listener
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
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

    // Hide close button
    if (this.closeButton) {
      this.closeButton.style.display = 'none';
    }

    // Restore body scroll
    const scrollY = document.body.dataset.scrollY;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    document.body.style.width = '';

    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0', 10));
    }

    this.isOpen = false;
    this.menuToggle.setAttribute('aria-expanded', 'false');

    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscapeKey);

    // Clean up focus trap
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

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
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Bind close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();
      });
    }

    // Navigation link click handling using event delegation
    if (this.navLinks) {
      if (this.linkClickHandler) {
        this.navLinks.removeEventListener('click', this.linkClickHandler);
      }
      this.linkClickHandler = (e) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          this.closeMenu();
        }
      };

      // Add the event listener using delegation
      this.navLinks.addEventListener('click', this.linkClickHandler);
    }

    // Handle backdrop click to close menu
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      if (this.isOpen) {
        setTimeout(() => {
          this.closeMenu();
        }, 200);
      }
    });
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