// js/modules/mobile-menu.js

export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navLinks = null;
    this.backdrop = null;
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
    this.createBackdrop();
    this.bindEvents();
    this.handleResize();
  }

  findOrCreateMenuToggle() {
    this.menuToggle = document.querySelector('.btn--menu-toggle');
    
    if (!this.menuToggle) {
      const navContainer = document.querySelector('.nav__container');
      if (!navContainer) {
        console.warn('No nav container found');
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

  createBackdrop() {
    // Remove existing backdrop if any
    const existingBackdrop = document.querySelector('.nav__backdrop');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }

    // Create new backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'nav__backdrop';
    document.body.appendChild(this.backdrop);
  }

  toggleMenu(force = null) {
    if (!this.menuToggle || !this.navLinks || !this.backdrop) {
      console.warn('Menu elements not found');
      return;
    }

    // Force parameter allows external control
    this.isOpen = force !== null ? !force : !this.isOpen;

    // Update ARIA
    this.menuToggle.setAttribute('aria-expanded', this.isOpen.toString());

    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    if (!this.menuToggle || !this.navLinks || !this.backdrop) return;

    // Save current scroll position
    this.savedScrollY = window.scrollY;

    // Add active classes
    this.menuToggle.classList.add('btn--menu-toggle--active');
    this.navLinks.classList.add('nav__links--active');
    this.backdrop.classList.add('nav__backdrop--active');

    // Prevent body scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.savedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    // Add escape key listener
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  closeMenu() {
    if (!this.isOpen) return;

    // Remove active classes
    if (this.menuToggle) {
      this.menuToggle.classList.remove('btn--menu-toggle--active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (this.navLinks) {
      this.navLinks.classList.remove('nav__links--active');
    }

    if (this.backdrop) {
      this.backdrop.classList.remove('nav__backdrop--active');
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

    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeMenu();
    }
  }

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
        // Small delay to let orientation change complete
        setTimeout(() => {
          this.closeMenu();
        }, 200);
      }
    });
  }

  bindEvents() {
    // Menu toggle click
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Backdrop click (outside click)
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMenu();
      });
    }

    // Navigation link clicks
    if (this.navLinks) {
      this.navLinks.addEventListener('click', (e) => {
        // Close menu when clicking any navigation link
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
    
    if (this.backdrop) {
      this.backdrop.remove();
    }

    document.removeEventListener('keydown', this.handleEscapeKey);
  }
}