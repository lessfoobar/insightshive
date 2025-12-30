// js/modules/animation-manager.js - module for enhanced animations

export class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    this.init();
  }

  init() {
    this.initCardAnimations();
    this.initCounterAnimations();
  }

  initCardAnimations() {
    // Add hover effect improvements
    const cards = document.querySelectorAll(".card, .card--team-member");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.onCardHover(card);
      });

      card.addEventListener("mouseleave", () => {
        this.onCardLeave(card);
      });
    });
  }

  onCardHover(card) {
    // Add subtle glow effect
    if (!card.classList.contains("card--cta")) {
      const glow = document.createElement("div");
      glow.className = "card-glow";
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

      card.style.position = "relative";
      card.appendChild(glow);

      // Trigger glow
      requestAnimationFrame(() => {
        glow.style.opacity = "0.1";
      });
    }
  }

  onCardLeave(card) {
    const glow = card.querySelector(".card-glow");
    if (glow) {
      glow.style.opacity = "0";
      setTimeout(() => {
        if (glow.parentNode) {
          glow.parentNode.removeChild(glow);
        }
      }, 300);
    }
  }

  initCounterAnimations() {
    // Animate numbers in metric cards
    const metricNumbers = document.querySelectorAll(".metric-number");

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    metricNumbers.forEach((number) => {
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

    element.classList.add("counting");

    let current = 0;
    const increment = finalNumber / 30;
    const duration = 1500;
    const stepTime = duration / 30;

    const timer = setInterval(() => {
      current += increment;
      if (current >= finalNumber) {
        current = finalNumber;
        clearInterval(timer);
        element.classList.remove("counting");
      }

      element.textContent = prefix + Math.floor(current) + suffix;
    }, stepTime);
  }

  // Method to manually trigger card loading state
  showCardLoading(cardSelector) {
    const card = document.querySelector(cardSelector);
    if (card) {
      card.classList.add("card--loading");
      return () => card.classList.remove("card--loading");
    }
  }

  // Method to add entrance animation to new elements
  animateNewElement(element, delay = 0) {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`;

    requestAnimationFrame(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });
  }

  // Cleanup method
  destroy() {
    // Stop any running counter animations
    if (this.runningTimers) {
      this.runningTimers.forEach((timer) => clearInterval(timer));
    }

    // Disconnect intersection observers
    if (this.counterObserver) {
      this.counterObserver.disconnect();
    }

    // Remove event listeners from cards
    const cards = document.querySelectorAll(".card, .card--team-member");
    cards.forEach((card) => {
      // Remove the hover listeners we added
      card.removeEventListener("mouseenter", this.boundHoverHandler);
      card.removeEventListener("mouseleave", this.boundLeaveHandler);
    });

    // Remove any glow elements we created
    document.querySelectorAll(".card-glow").forEach((glow) => {
      glow.remove();
    });
  }
}
