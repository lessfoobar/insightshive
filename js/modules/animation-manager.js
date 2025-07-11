// js/modules/animation-manager.js - New module for enhanced animations

export class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.initScrollAnimations();
    this.initCardAnimations();
    this.initLoadingStates();
    this.initCounterAnimations();
  }

  initScrollAnimations() {
    // Only run if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe cards for scroll animations
    const animatableElements = document.querySelectorAll(
      '.card, .card--team-member, .card--section, .btn--cta'
    );

    animatableElements.forEach((el, index) => {
      // Add initial state
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

      // Observe for intersection
      observer.observe(el);
    });

    // Add CSS for animate-in state
    this.addAnimationStyles();
  }

  addAnimationStyles() {
    if (document.querySelector('#animation-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'animation-styles';
    styles.textContent = `
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .card--loading {
        pointer-events: none;
      }
      
      .metric-number {
        transition: all 0.6s ease;
      }
      
      .metric-number.counting {
        color: var(--accent-primary);
        transform: scale(1.1);
      }
      
      @media (prefers-reduced-motion: reduce) {
        .card, .card--team-member, .card--section, .btn--cta {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  initCardAnimations() {
    // Add hover effect improvements
    const cards = document.querySelectorAll('.card, .card--team-member');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.onCardHover(card);
      });

      card.addEventListener('mouseleave', () => {
        this.onCardLeave(card);
      });
    });
  }

  onCardHover(card) {
    // Add subtle glow effect
    if (!card.classList.contains('card--cta')) {
      const glow = document.createElement('div');
      glow.className = 'card-glow';
      glow.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(135deg, var(--accent-primary), var(--color-primary-600));
        border-radius: inherit;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;

      card.style.position = 'relative';
      card.appendChild(glow);

      // Trigger glow
      requestAnimationFrame(() => {
        glow.style.opacity = '0.1';
      });
    }
  }

  onCardLeave(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.opacity = '0';
      setTimeout(() => {
        if (glow.parentNode) {
          glow.parentNode.removeChild(glow);
        }
      }, 300);
    }
  }

  initLoadingStates() {
    // Simulate loading states for demo purposes
    const cards = document.querySelectorAll('.card');

    // Add loading class initially
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card--loading');

        // Remove loading after delay
        setTimeout(() => {
          card.classList.remove('card--loading');
        }, 1000 + (index * 200));
      }, index * 100);
    });
  }

  initCounterAnimations() {
    // Animate numbers in metric cards
    const metricNumbers = document.querySelectorAll('.metric-number');

    if (!('IntersectionObserver' in window)) {
      return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    metricNumbers.forEach(number => {
      counterObserver.observe(number);
    });
  }

  animateCounter(element) {
    const text = element.textContent;
    const numberMatch = text.match(/\d+/);

    if (!numberMatch) {
      return;
    }

    const finalNumber = parseInt(numberMatch[0], 10);
    const prefix = text.substring(0, numberMatch.index);
    const suffix = text.substring(numberMatch.index + numberMatch[0].length);

    element.classList.add('counting');

    let current = 0;
    const increment = finalNumber / 30;
    const duration = 1500;
    const stepTime = duration / 30;

    const timer = setInterval(() => {
      current += increment;
      if (current >= finalNumber) {
        current = finalNumber;
        clearInterval(timer);
        element.classList.remove('counting');
      }

      element.textContent = prefix + Math.floor(current) + suffix;
    }, stepTime);
  }

  // Method to manually trigger card loading state
  showCardLoading(cardSelector) {
    const card = document.querySelector(cardSelector);
    if (card) {
      card.classList.add('card--loading');
      return () => card.classList.remove('card--loading');
    }
  }

  // Method to add entrance animation to new elements
  animateNewElement(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`;

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  // Cleanup method
  destroy() {
    // Remove added styles
    const styles = document.querySelector('#animation-styles');
    if (styles) {
      styles.remove();
    }
  }
}