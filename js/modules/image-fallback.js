/*
 * Image Fallback Module - ES6 Module for handling missing team photos
 * Provides better fallback handling for missing images
 */

export class ImageFallback {
  constructor() {
    this.init();
    this.preloadTeamImages();
  }

  init() {
    // Handle image loading errors for team photos
    const teamImages = document.querySelectorAll(".team-photo img");

    teamImages.forEach((img) => {
      img.addEventListener("error", () => this.handleImageError(img));
      img.addEventListener("load", () => this.handleImageLoad(img));
    });
  }

  handleImageError(img) {
    const container = img.parentNode;
    const altText = img.getAttribute("alt");

    // Hide the image
    img.style.display = "none";

    // Add fallback styling
    container.classList.add("default");

    // Create initials from name
    const initials = altText
      .split(" ")
      .map((name) => name.charAt(0))
      .join("");
    container.innerHTML = initials;
  }

  handleImageLoad(img) {
    // Add loading animation
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
    setTimeout(() => {
      img.style.opacity = "1";
    }, 100);
  }

  // Preload images for better performance
  preloadTeamImages() {
    const imageUrls = [
      "images/team/nikola-kalev.jpg",
      "images/team/ognyan-vasilev.jpg",
      "images/team/ivan-ivanov.jpg",
    ];

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }
}
