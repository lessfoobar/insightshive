// js/modules/mobile-menu.js

export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navLinks = null;
    this.isOpen = false;
    this.savedScrollY = 0;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.findOrCreateMenuToggle();
    this.bindEvents();
    this.handleResize();
  }

  findOrCreateMenuToggle() {
    this.menuToggle = document.querySelector('.btn--menu-toggle');

    if (!this.menuToggle) {
      const navContainer = document.querySelector('.nav__container');
      if (!navContainer) {
        return;
      }

      this.menuToggle = document.createElement('button');
      this.menuToggle.type = 'button';
      this.menuToggle.className = 'btn--menu-toggle';
      this.menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-controls', 'navigation-menu');

      this.menuToggle.innerHTML = `
        <span class="btn--menu-toggle__line"></span>
        <span class="btn--menu-toggle__line"></span>
        <span class="btn--menu-toggle__line"></span>
      `;

      navContainer.appendChild(this.menuToggle);
    }

    this.navLinks = document.querySelector('.nav__links');
    if (this.navLinks) {
      this.navLinks.id = 'navigation-menu';
    }
  }

  toggleMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.isOpen = !this.isOpen;
    this.menuToggle.setAttribute('aria-expanded', this.isOpen.toString());

    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    // Save current scroll position
    this.savedScrollY = window.scrollY;

    // Add active classes
    this.menuToggle.classList.add('btn--menu-toggle--active');
    this.navLinks.classList.add('nav__links--active');

    // Prevent body scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.savedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    // Add event listeners
    document.addEventListener('keydown', this.handleEscapeKey);
    // Delay the outside click listener to prevent immediate closure
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick);
    }, 100);
  }

  closeMenu() {
    if (!this.isOpen) {
      return;
    }

    // Remove active classes
    if (this.menuToggle) {
      this.menuToggle.classList.remove('btn--menu-toggle--active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (this.navLinks) {
      this.navLinks.classList.remove('nav__links--active');
    }

    // Restore body scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    // Restore scroll position
    if (this.savedScrollY) {
      window.scrollTo(0, this.savedScrollY);
      this.savedScrollY = 0;
    }

    this.isOpen = false;

    // Remove event listeners
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleEscapeKey = (e) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeMenu();
    }
  };

  handleOutsideClick = (e) => {
    // Only close if clicking outside both menu toggle and nav links
    if (this.isOpen && 
        !this.menuToggle.contains(e.target) &&
        !this.navLinks.contains(e.target)) {
      this.closeMenu();
    }
  };

  handleMenuToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleMenu();
  };

  handleResize() {
    window.addEventListener('resize', () => {
      // Close menu when resizing to desktop
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      if (this.isOpen) {
        setTimeout(() => {
          this.closeMenu();
        }, 200);
      }
    });
  }

  bindEvents() {
    // Menu toggle click
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', this.handleMenuToggleClick);
    }

    // Navigation link clicks
    if (this.navLinks) {
      this.navLinks.addEventListener('click', (e) => {
        // Only close if clicking a navigation link, not the container
        if (e.target.matches('.nav__link') || e.target.closest('.nav__link')) {
          this.closeMenu();
        }
      });
    }
  }

  // Public methods for external control
  close() {
    if (this.isOpen) {
      this.closeMenu();
    }
  }

  open() {
    if (!this.isOpen) {
      this.toggleMenu();
    }
  }

  get isMenuOpen() {
    return this.isOpen;
  }

  // Cleanup method
  destroy() {
    this.closeMenu();
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.removeEventListener('click', this.handleOutsideClick);

    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.handleMenuToggleClick);
    }
  }
}