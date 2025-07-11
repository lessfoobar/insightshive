/*
 * Page Configurations - Define page-specific settings
*/

export const pageConfigs = {
  home: {
    pageType: 'home',
    title: 'InsightsHive - AI-Powered Retail Intelligence Platform',
    description: 'Transform retail operations through AI-powered computer vision and automated KPI extraction',
    includeStructuredData: true
  },

  about: {
    pageType: 'about',
    title: 'About InsightsHive - AI Retail Intelligence',
    description: 'Learn about our mission to transform retail operations through AI-powered technology and automated insights',
    breadcrumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'About Us' }
    ]
  },

  products: {
    pageType: 'products',
    title: 'InsightsHive Products - AI Mobile & Web Platform',
    description: 'Proprietary AI-powered mobile and web applications for automated retail data collection and intelligent analysis',
    breadcrumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'Products' }
    ]
  },

  team: {
    pageType: 'team',
    title: 'InsightsHive Team - Experienced AI & Retail Experts',
    description: 'Meet the experienced professionals driving InsightsHive\'s mission to transform retail operations through AI-powered technology',
    breadcrumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'Our Team' }
    ]
  },

  technology: {
    pageType: 'technology',
    title: 'AI Technology & Competitive Advantage - InsightsHive',
    description: 'Advanced AI computer vision and machine learning technologies that power our retail intelligence platform',
    breadcrumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'Technology' }
    ]
  },

  contact: {
    pageType: 'contact',
    title: 'Contact InsightsHive - Schedule Demo & Get in Touch',
    description: 'Ready to transform your retail operations? Contact our team to schedule a demo or discuss partnership opportunities',
    breadcrumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'Contact' }
    ]
  }
};

// Helper function to get current page config
export function getCurrentPageConfig() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '') || 'index';

  // Map filenames to config keys
  const pageMap = {
    'index': 'home',
    'about': 'about',
    'products': 'products',
    'team': 'team',
    'technology': 'technology',
    'contact': 'contact'
  };

  const pageKey = pageMap[filename] || 'home';
  return pageConfigs[pageKey];
}