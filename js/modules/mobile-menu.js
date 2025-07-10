// js/modules/mobile-menu.js - Updated to use BEM classes

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
    const existingToggle = document.querySelector('.btn--menu-toggle');  // ✅ Using BEM class

    if (!existingToggle) {
      const navContainer = document.querySelector('.nav__container');  // ✅ Using BEM class
      if (!navContainer) {
        return;
      }

      const newMenuToggle = document.createElement('button');
      newMenuToggle.type = 'button';
      newMenuToggle.className = 'btn btn--menu-toggle';  // ✅ Using BEM classes
      newMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      
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

    this.navLinks = document.querySelector('.nav__links');  // ✅ Using BEM class
  }

  toggleMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.menuToggle.classList.toggle('btn--menu-toggle--active');  // ✅ Using BEM modifier
    this.navLinks.classList.toggle('nav__links--active');  // ✅ Using BEM modifier

    // Prevent body scroll when menu is open
    if (this.navLinks.classList.contains('nav__links--active')) {  // ✅ Using BEM modifier
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    if (!this.menuToggle || !this.navLinks) {
      return;
    }

    this.menuToggle.classList.remove('btn--menu-toggle--active');  // ✅ Using BEM modifier
    this.navLinks.classList.remove('nav__links--active');  // ✅ Using BEM modifier
    document.body.style.overflow = '';
  }

  bindEvents() {
    // Bind menu toggle click
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav__links a');  // ✅ Using BEM class
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
      if (e.key === 'Escape' && this.navLinks && this.navLinks.classList.contains('nav__links--active')) {  // ✅ Using BEM modifier
        this.closeMenu();
      }
    });
  }
}