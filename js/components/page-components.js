/*
 * Page Components - Reusable HTML components
 * Eliminates code duplication across HTML files
 */

export class PageComponents {
  static createHead(pageTitle, pageDescription) {
    return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}">
    <link rel="icon" type="image/svg+xml" href="images/favicons/favicon.svg">
    <link rel="icon" type="image/x-icon" href="images/favicons/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="images/favicons/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="images/favicons/android-chrome-512x512.png">
    <link rel="manifest" href="images/favicons/site.webmanifest">
    <meta name="theme-color" content="#a359bc">
    <meta name="msapplication-TileColor" content="#a359bc">
    <link rel="stylesheet" href="css/main.css">
    <script type="module" src="js/main.js"></script>
    <script nomodule src="js/legacy/app-legacy.js"></script>`;
  }

  static createHeader(pageType = 'home', customTitle = '', customTagline = '', customDescription = '') {
    const headers = {
      home: {
        title: 'InsightsHive',
        tagline: 'AI-Powered Retail Intelligence Platform',
        description: 'A digital-native tech startup offering proprietary mobile and web applications that leverage advanced AI computer vision to transform retail operations through automated KPI extraction and real-time insights.'
      },
      about: {
        title: 'InsightsHive',
        tagline: 'About Our Company',
        description: 'Learn about our mission to transform retail operations through AI-powered technology and automated insights.'
      },
      products: {
        title: 'InsightsHive',
        tagline: 'Our Products',
        description: 'Proprietary AI-powered mobile and web applications designed to revolutionize retail operations through automated data collection and intelligent analysis.'
      },
      team: {
        title: 'InsightsHive',
        tagline: 'Our Team',
        description: 'Meet the experienced professionals driving InsightsHive\'s mission to transform retail operations through AI-powered technology.'
      },
      technology: {
        title: 'InsightsHive',
        tagline: 'AI Technology & Competitive Advantage',
        description: 'Advanced AI computer vision and machine learning technologies that power our retail intelligence platform and deliver superior accuracy and insights.'
      },
      contact: {
        title: 'InsightsHive',
        tagline: 'Contact Us',
        description: 'Ready to transform your retail operations? Get in touch with our team to schedule a demo or discuss how InsightsHive can benefit your business.'
      }
    };

    const config = headers[pageType] || headers.home;
    const title = customTitle || config.title;
    const tagline = customTagline || config.tagline;
    const description = customDescription || config.description;

    return `
    <header class="header header--${pageType}">
        <div class="container">
            <div class="header__logo">${title}</div>
            <div class="header__tagline">${tagline}</div>
            <div class="header__description">${description}</div>
        </div>
    </header>`;
  }

  static createNavigation(activePage = 'home') {
    const navItems = [
      { id: 'home', label: 'Home', href: 'index.html', icon: '🏠' },
      { id: 'about', label: 'About Us', href: 'about.html', icon: 'ℹ️' },
      { id: 'products', label: 'Products', href: 'products.html', icon: '📱' },
      { id: 'team', label: 'Our Team', href: 'team.html', icon: '👥' },
      { id: 'technology', label: 'Technology', href: 'technology.html', icon: '🤖' },
      { id: 'contact', label: 'Contact', href: 'contact.html', icon: '📞' }
    ];

    const navLinks = navItems.map(item => `
      <li role="none">
        <a href="${item.href}" 
           class="nav__link ${item.id === activePage ? 'nav__link--active' : ''}" 
           role="menuitem">
          <span class="nav__link-icon">${item.icon}</span>${item.label}
        </a>
      </li>
    `).join('');

    return `
    <nav class="nav" role="navigation" aria-label="Main navigation">
        <div class="nav__container">
            <button type="button" 
                    class="btn--menu-toggle" 
                    aria-label="Toggle navigation menu"
                    aria-expanded="false"
                    aria-controls="navigation-menu">
                <span class="btn--menu-toggle__line"></span>
                <span class="btn--menu-toggle__line"></span>
                <span class="btn--menu-toggle__line"></span>
            </button>
            <ul class="nav__links" id="navigation-menu" role="menubar">
                ${navLinks}
            </ul>
        </div>
    </nav>`;
  }

  static createFooter() {
    return `
    <footer class="footer">
        <div class="footer__container">
            <div class="footer__contact">
                <h3 class="footer__contact-title">Contact InsightsHive</h3>
                <div class="footer__contact-info">Email: info@insightshive.com | Business Inquiries: info@insightshive.com</div>
                <div class="footer__contact-info">
                    <a href="https://www.linkedin.com/in/nikola-k-393b18104/" target="_blank">Nikola Kalev</a> |
                    <a href="https://www.linkedin.com/in/ognyan-v-vasilev/" target="_blank">Ognyan Vasilev</a>
                </div>
            </div>
            <div class="footer__bottom">
                <div class="footer__copyright">&copy; 2025 InsightsHive. All rights reserved. | <a href="#" class="footer__legal-link">Privacy Policy</a> | <a href="#" class="footer__legal-link">Terms of Service</a></div>
            </div>
        </div>
    </footer>`;
  }

  static createBreadcrumbs(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      return '';
    }

    const breadcrumbItems = breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;

      if (isLast) {
        return `
          <span class="breadcrumbs__item breadcrumbs__item--current" aria-current="page">
            ${crumb.label}
          </span>`;
      } else {
        return `
          <span class="breadcrumbs__item">
            <a href="${crumb.href}" class="breadcrumbs__link">${crumb.label}</a>
          </span>
          <span class="breadcrumbs__separator" aria-hidden="true">›</span>`;
      }
    }).join('');

    return `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
        ${breadcrumbItems}
    </nav>`;
  }

  static createStructuredData() {
    return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "InsightsHive",
      "description": "AI-Powered Retail Intelligence Platform",
      "url": "https://insightshive.com",
      "logo": "https://insightshive.com/images/favicons/android-chrome-512x512.png",
      "foundingDate": "2024",
      "founders": [
        {
          "@type": "Person",
          "name": "Nikola Kalev",
          "jobTitle": "Co-Founder",
          "sameAs": "https://www.linkedin.com/in/nikola-k-393b18104/"
        },
        {
          "@type": "Person", 
          "name": "Ognyan Vasilev",
          "jobTitle": "Co-Founder",
          "sameAs": "https://www.linkedin.com/in/ognyan-v-vasilev/"
        }
      ],
      "industry": "Artificial Intelligence",
      "keywords": "AI, Retail Intelligence, Computer Vision, Machine Learning, KPI Analytics"
    }
    </script>`;
  }
}

// Initialize page components when DOM is loaded
export class PageRenderer {
  constructor(pageConfig) {
    this.pageConfig = pageConfig;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.render());
    } else {
      this.render();
    }
  }

  render() {
    // Update document head
    if (this.pageConfig.title || this.pageConfig.description) {
      document.title = this.pageConfig.title || 'InsightsHive - AI-Powered Retail Intelligence Platform';

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && this.pageConfig.description) {
        metaDescription.content = this.pageConfig.description;
      }
    }

    // Render header if placeholder exists
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.outerHTML = PageComponents.createHeader(
        this.pageConfig.pageType,
        this.pageConfig.headerTitle,
        this.pageConfig.headerTagline,
        this.pageConfig.headerDescription
      );
    }

    // Render navigation if placeholder exists
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
      navPlaceholder.outerHTML = PageComponents.createNavigation(this.pageConfig.pageType);
    }

    // Render breadcrumbs if placeholder exists
    const breadcrumbsPlaceholder = document.getElementById('breadcrumbs-placeholder');
    if (breadcrumbsPlaceholder && this.pageConfig.breadcrumbs) {
      breadcrumbsPlaceholder.outerHTML = PageComponents.createBreadcrumbs(this.pageConfig.breadcrumbs);
    }

    // Render footer if placeholder exists
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.outerHTML = PageComponents.createFooter();
    }

    // Add structured data if needed
    if (this.pageConfig.includeStructuredData) {
      const structuredDataScript = document.createElement('div');
      structuredDataScript.innerHTML = PageComponents.createStructuredData();
      document.head.appendChild(structuredDataScript.firstElementChild);
    }
  }
}