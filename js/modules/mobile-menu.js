// Mobile Menu Module - ES6 Module for responsive navigation
export class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navLinks = null;
    this.init();
  }

  init() {
    this.createMenuToggle();
    this.bindEvents();
  }

  createMenuToggle() {
    const existingToggle = document.querySelector('.menu-toggle');

    if (!existingToggle) {
      const navContainer = document.querySelector('.nav-container');
      if (!navContainer) {
        return;
      }

      const newMenuToggle = document.createElement('button');
      newMenuToggle.className = 'menu-toggle';
      newMenuToggle.innerHTML = '<span></span><span></span><span></span>';
      newMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navContainer.appendChild(newMenuToggle);

      this.menuToggle = newMenuToggle;
    } else {
      this.menuToggle = existingToggle;
    }

    this.navLinks = document.querySelector('.nav-links');
  }

  toggleMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.menuToggle.classList.toggle('active');
    this.navLinks.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (this.navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.menuToggle.classList.remove('active');
    this.navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }

  bindEvents() {
    // Bind menu toggle click
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (this.menuToggle && this.navLinks &&
          !this.menuToggle.contains(event.target) &&
          !this.navLinks.contains(event.target)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navLinks && this.navLinks.classList.contains('active')) {
        this.closeMenu();
      }
    });
  }
}