// js/modules/mobile-menu.js

export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navLinks = null;
    this.backdrop = null;
    this.isOpen = false;
    this.scrollPosition = 0;

    // Bound methods to prevent memory leaks
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleResize = this.handleResize.bind(this);

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
        console.warn('Navigation container not found');
        return;
      }

      const newMenuToggle = document.createElement('button');
      newMenuToggle.type = 'button';
      newMenuToggle.className = 'btn--menu-toggle';
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
      this.navLinks.setAttribute('role', 'menu');
    }
  }

  createBackdrop() {
    // Remove existing backdrop
    const existingBackdrop = document.querySelector('.nav__backdrop');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }

    // Create new backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'nav__backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1040;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      backdrop-filter: blur(5px);
    `;

    document.body.appendChild(backdrop);
    this.backdrop = backdrop;
  }

  handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleMenu();
  }

  handleLinkClick(e) {
    // Only close if clicking on an actual link, not nested elements
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      this.closeMenu();
    }
  }

  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.isOpen) {
      e.preventDefault();
      this.closeMenu();
    }
  }

  handleOutsideClick(e) {
    // Only close if clicking outside the navigation area
    if (this.isOpen &&
        this.menuToggle &&
        this.navLinks &&
        !this.menuToggle.contains(e.target) &&
        !this.navLinks.contains(e.target)) {
      this.closeMenu();
    }
  }

  handleResize() {
    // Close menu when resizing to desktop
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMenu();
    }
  }

  toggleMenu() {
    if (!this.menuToggle || !this.navLinks) {
      console.warn('Menu elements not found');
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
    // Store current scroll position
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Add classes for open state
    this.menuToggle.classList.add('btn--menu-toggle--active');
    this.navLinks.classList.add('nav__links--active');

    // Show backdrop
    if (this.backdrop) {
      this.backdrop.style.visibility = 'visible';
      this.backdrop.style.opacity = '1';
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    // Add event listeners
    document.addEventListener('keydown', this.handleEscapeKey, { passive: false });
    document.addEventListener('click', this.handleOutsideClick, { passive: true });

    this.isOpen = true;
  }

  closeMenu() {
    if (!this.isOpen) {
      return;
    }

    // Remove classes for closed state
    this.menuToggle.classList.remove('btn--menu-toggle--active');
    this.navLinks.classList.remove('nav__links--active');

    // Hide backdrop
    if (this.backdrop) {
      this.backdrop.style.opacity = '0';
      this.backdrop.style.visibility = 'hidden';
    }

    // Restore body scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    document.body.style.width = '';

    // Restore scroll position
    if (this.scrollPosition) {
      window.scrollTo(0, this.scrollPosition);
    }

    // Remove event listeners
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.removeEventListener('click', this.handleOutsideClick);

    this.isOpen = false;
    this.menuToggle.setAttribute('aria-expanded', 'false');
  }

  bindEvents() {
    // Bind menu toggle click
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', this.handleToggleClick, { passive: false });
    }

    // Navigation link click handling using event delegation
    if (this.navLinks) {
      this.navLinks.addEventListener('click', this.handleLinkClick, { passive: true });
    }

    // Handle backdrop clicks
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => {
        this.closeMenu();
      }, { passive: true });
    }

    // Handle window resize
    window.addEventListener('resize', this.handleResize, { passive: true });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      if (this.isOpen) {
        setTimeout(() => {
          this.closeMenu();
        }, 200);
      }
    }, { passive: true });
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

  // Cleanup method
  destroy() {
    // Remove event listeners
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.handleToggleClick);
    }
    if (this.navLinks) {
      this.navLinks.removeEventListener('click', this.handleLinkClick);
    }
    if (this.backdrop) {
      this.backdrop.removeEventListener('click', this.closeMenu);
    }

    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.removeEventListener('click', this.handleOutsideClick);

    // Remove backdrop
    if (this.backdrop && this.backdrop.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop);
    }

    // Close menu if open
    if (this.isOpen) {
      this.closeMenu();
    }
  }
}