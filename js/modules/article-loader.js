/**
 * Article Loader Module
 * Loads and displays blog articles from articles.json
 */

export class ArticleLoader {
  /**
   * Load all articles from the JSON file
   * @returns {Promise<Array>} Array of article objects
   */
  static async loadArticles() {
    try {
      const response = await fetch('data/articles.json');
      if (!response.ok) {
        throw new Error(`Failed to load articles: ${response.status}`);
      }
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get CSS class for category badge
   * @param {string} category - Article category
   * @returns {string} CSS class name
   */
  static getCategoryClass(category) {
    const categoryMap = {
      'Industry Insights': 'industry-insights',
      Product: 'product',
      Announcements: 'announcements',
      Technology: 'technology',
      'Case Study': 'case-study'
    };
    return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Render a single article card
   * @param {Object} article - Article object
   * @returns {string} HTML string
   */
  static renderArticleCard(article) {
    const dateFormatted = this.formatDate(article.date);
    const categoryClass = this.getCategoryClass(article.category);

    return (
      `<div class="card article-card" data-category="${categoryClass}">` +
      (article.image
        ? `<div class="card__image-wrapper">
          <img src="${article.image}" alt="${article.title}" class="card__image" loading="lazy">
        </div>`
        : '') +
      `<div class="card__header">
          <h3 class="card__title">${article.title}</h3>
          <div class="card__meta">
            <span class="badge badge--${categoryClass}">${article.category}</span>
            <time datetime="${article.date}" class="card__date">${dateFormatted}</time>
          </div>
        </div>
        <div class="card__body">
          <p>${article.excerpt}</p>` +
      (article.tags && article.tags.length > 0
        ? `<div class="article-tags">
            ${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>`
        : '') +
      `</div>
        <div class="card__footer">
          <a href="articles/${article.filename}" class="btn btn--primary">
            Read Article →
          </a>
        </div>
      </div>`
    );
  }

  /**
   * Render featured article (larger card)
   * @param {Object} article - Article object
   * @returns {string} HTML string
   */
  static renderFeaturedArticle(article) {
    const dateFormatted = this.formatDate(article.date);
    const categoryClass = this.getCategoryClass(article.category);

    return (
      `<div class="card card--highlight featured-article">` +
      (article.image
        ? `<div class="card__image-wrapper">
          <img src="${article.image}" alt="${article.title}" class="card__image" loading="lazy">
        </div>`
        : '') +
      `<div class="card__header">
          <span class="badge badge--featured">Featured</span>
          <h2 class="card__title">${article.title}</h2>
          <div class="card__meta">
            <span class="badge badge--${categoryClass}">${article.category}</span>
            <time datetime="${article.date}" class="card__date">${dateFormatted}</time>
            <span class="card__author">By ${article.author}</span>
          </div>
        </div>
        <div class="card__body">
          <p class="featured-excerpt">${article.excerpt}</p>` +
      (article.tags && article.tags.length > 0
        ? `<div class="article-tags">
            ${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>`
        : '') +
      `</div>
        <div class="card__footer">
          <a href="articles/${article.filename}" class="btn btn--primary btn--large">
            Read Full Article →
          </a>
        </div>
      </div>`
    );
  }

  /**
   * Render all articles to a container
   * @param {string} containerId - ID of the container element
   * @param {Object} options - Rendering options
   */
  static async renderArticles(containerId, options = {}) {
    const { showFeatured = true, limit = null, category = null } = options;

    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    // Show loading state
    container.innerHTML = '<p class="loading">Loading articles...</p>';

    // Load articles
    let articles = await this.loadArticles();

    if (articles.length === 0) {
      container.innerHTML = '<p class="no-articles">No articles found.</p>';
      return;
    }

    // Filter by category if specified
    if (category) {
      articles = articles.filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Separate featured and regular articles
    const featuredArticles = articles.filter((article) => article.featured);
    const regularArticles = articles.filter((article) => !article.featured);

    let html = '';

    // Render featured articles
    if (showFeatured && featuredArticles.length > 0) {
      html += '<section class="card--section featured-section">';
      html += '<h2>Featured</h2>';
      html += featuredArticles
        .map((article) => this.renderFeaturedArticle(article))
        .join('');
      html += '</section>';
    }

    // Render regular articles in grid
    if (regularArticles.length > 0) {
      const displayArticles = limit
        ? regularArticles.slice(0, limit)
        : regularArticles;

      html += '<section class="card--section">';
      html += '<h2>Latest Articles</h2>';
      html += '<div class="grid grid-3 articles-grid">';
      html += displayArticles
        .map((article) => this.renderArticleCard(article))
        .join('');
      html += '</div>';
      html += '</section>';
    }

    container.innerHTML = html;
  }

  /**
   * Get unique categories from articles
   * @returns {Promise<Array>} Array of unique categories
   */
  static async getCategories() {
    const articles = await this.loadArticles();
    const categories = [
      ...new Set(articles.map((article) => article.category))
    ];
    return categories.sort();
  }
}
