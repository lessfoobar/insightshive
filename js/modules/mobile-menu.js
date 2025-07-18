// js/modules/mobile-menu.js

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
    console.log('Opening mobile menu');

    // Add classes for open state
    this.menuToggle.classList.add('btn--menu-toggle--active');
    this.navLinks.classList.add('nav__links--active');

    if (this.backdrop) {
      this.backdrop.classList.add('nav__backdrop--active');
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
    this.bindLinkEvents();
  }

  closeMenu() {
    if (!this.isOpen) {
      return;
    }
    console.log('Closing mobile menu');

    // Remove classes for closed state
    this.menuToggle.classList.remove('btn--menu-toggle--active');
    this.navLinks.classList.remove('nav__links--active');

    if (this.backdrop) {
      this.backdrop.classList.remove('nav__backdrop--active');
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

  // Separate method to bind link events
  bindLinkEvents() {
    const navLinksItems = this.navLinks.querySelectorAll('a');
    console.log('Found', navLinksItems.length, 'navigation links');

    navLinksItems.forEach((link, index) => {
      // Remove any existing event listeners
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add new event listener
      newLink.addEventListener('click', (e) => {
        console.log('Navigation link clicked:', newLink.href);
        
        // Don't prevent default - allow navigation
        // Close menu immediately
        this.closeMenu();
      });

      // Also add touch events for mobile
      newLink.addEventListener('touchstart', (e) => {
        console.log('Navigation link touched:', newLink.href);
      });
    });
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
        console.log('Menu toggle clicked');
        this.toggleMenu();
      });
    }

    // Close menu when clicking backdrop
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        console.log('Backdrop clicked');
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

    // Initial bind of link events
    this.bindLinkEvents();
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