# InsightsHive Website

AI-Powered Retail Intelligence Platform - Official Website

![InsightsHive Logo](images/favicons/favicon.svg)

## 🚀 Overview

InsightsHive is a digital-native tech startup offering proprietary mobile and web applications that leverage advanced AI computer vision to transform retail operations through automated KPI extraction and real-time insights.

## 📁 Project Structure

```text
insightshive/
├── README.md                 # This file
├── package.json             # Dependencies and scripts
├── .gitignore              # Git ignore rules
├── index.html              # Homepage
├── about.html              # About page
├── products.html           # Products page
├── team.html               # Team page
├── technology.html         # Technology page
├── contact.html            # Contact page
├── news.html               # News & blog page
├── css/
│   ├── main.css            # Main stylesheet
│   ├── base/               # Base styles (reset, typography)
│   ├── components/         # Component styles (buttons, cards, etc.)
│   ├── layout/             # Layout styles (header, footer, grid)
│   └── utilities/          # Utility classes
├── js/
│   ├── main.js             # Main application entry
│   ├── config/             # Page configurations
│   ├── components/         # Page components
│   └── modules/            # Reusable modules
│       ├── mobile-menu.js   # Mobile navigation
│       ├── theme-manager.js # Theme switching
│       ├── article-loader.js # Blog article loader
│       └── ...
├── content/                 # Blog source files (Markdown)
│   ├── README.md           # Blog content guide
│   └── *.md                # Article markdown files
├── articles/                # Generated blog HTML (auto-built)
│   └── *.html              # Individual article pages
├── data/
│   └── articles.json       # Article index (auto-generated)
├── scripts/
│   └── build-articles.js   # Markdown to HTML converter
├── .github/
│   └── workflows/
│       └── build-articles.yml # Auto-build workflow
└── images/
    ├── favicons/           # Favicon files
    └── team/               # Team photos
```

## ⚡ Quick Start

### Option 1: Simple Setup (No Build Process)

1. Clone the repository
2. Open `index.html` in your browser
3. That's it! The site works without any build process.

### Option 2: Development Setup (With Live Server)

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd insightshive
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

   Opens the site at `http://localhost:8080` with live reload

3. **Alternative development server:**

   ```bash
   npm run serve
   ```

   Opens at `http://localhost:3000`

## 🛠️ Development

### Available Scripts

| Script                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `npm run dev`            | Start development server with live reload |
| `npm run serve`          | Alternative development server            |
| `npm run build`          | Build CSS and articles for production     |
| `npm run build:articles` | Build blog articles from Markdown         |
| `npm run css:build`      | Build CSS from source files               |
| `npm run lint`           | Check JavaScript code quality             |
| `npm run lint:fix`       | Fix JavaScript linting issues             |
| `npm run validate`       | Validate HTML markup                      |

### CSS Architecture

- **Methodology:** BEM (Block Element Modifier)
- **Structure:** Modular CSS with imports
- **Features:**
  - CSS Custom Properties (variables)
  - Dark/Light theme support
  - Mobile-first responsive design
  - Modern CSS Grid and Flexbox

### JavaScript Features

- **ES6+ Modern JavaScript**
- **Mobile-first responsive navigation**
- **Dark/Light theme switching**
- **Image fallback handling**
- **Accessibility features**

### Blog System

The site includes an automated blog/news system:

#### Writing Articles

1. Create `.md` files in the `content/` directory
2. Add frontmatter with article metadata
3. Write content in Markdown
4. Push to GitHub

#### Auto-Build Process

- GitHub Actions automatically converts Markdown to HTML
- Generates individual article pages in `articles/`
- Updates `data/articles.json` with article index
- Articles appear on the news page automatically

#### Article Format

```markdown
---
title: "Your Article Title"
date: 2025-12-30
author: Author Name
category: Industry Insights
excerpt: "Brief summary"
featured: true
tags: ["tag1", "tag2"]
---

# Your Article Content...
```

See `content/README.md` for detailed instructions.

### Design System

- **Colors:** Purple-based brand palette with dark/light modes
- **Typography:** Segoe UI system font stack
- **Spacing:** Consistent spacing scale
- **Components:** Reusable card-based design system

## 🎨 Customization

### Themes

The site supports automatic dark/light theme switching:

- Respects user's system preference
- Manual toggle button
- Persistent user choice via localStorage

### Colors

Modify CSS custom properties in `css/main.css`:

```css
:root {
  --accent-primary: #a359bc;
  --bg-primary: #f9f7fb;
  /* ... more variables */
}
```

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 📱 Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive enhancement:** Works on older browsers with graceful degradation

## ♿ Accessibility

- **WCAG 2.1 AA compliant**
- **Semantic HTML5 markup**
- **ARIA labels and roles**
- **Keyboard navigation support**
- **Screen reader friendly**
- **High contrast ratios**

## 🚀 Deployment

### Static Hosting (Recommended)

This site works perfectly with static hosting providers:

- **Netlify:** Drag and drop the entire folder
- **Vercel:** Connect your Git repository
- **GitHub Pages:** Push to your repository
- **AWS S3:** Upload files to S3 bucket

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Environment Setup

No environment variables required for basic functionality.

## 📊 Performance

- **Lighthouse Score:** 95+ across all metrics
- **Mobile-first design**
- **Optimized images with lazy loading**
- **Minimal JavaScript footprint**
- **CSS-only animations**

## 🔧 Technical Details

### Dependencies

- **live-server:** Development server with live reload
- **eslint:** JavaScript linting
- **html-validate:** HTML markup validation
- **postcss:** CSS processing and optimization

### No Framework Dependencies

This is a vanilla HTML/CSS/JavaScript project with no frontend framework dependencies, making it:

- Fast to load
- Easy to maintain
- Simple to deploy
- Beginner-friendly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run lint && npm run validate`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use 2 spaces for indentation
- Follow BEM methodology for CSS
- Use modern ES6+ JavaScript
- Add comments for complex functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website:** [https://insightshive.com](https://insightshive.com)
- **Email:** <info@insightshive.com>
- **LinkedIn:** [Nikola Kalev](https://www.linkedin.com/in/nikola-kalev/) | [Ognyan Vasilev](https://www.linkedin.com/in/ognyan-v-vasilev/)

## 🏆 About InsightsHive

InsightsHive transforms retail operations through AI-powered computer vision technology. Our platform reduces manual audit time by 85% (from 30+ minutes to under 5 minutes) while providing 95%+ accuracy in KPI extraction.

**Key Features:**

- 📱 AI-powered mobile app for data collection
- 💻 Real-time analytics web platform
- 🧠 Advanced computer vision and machine learning
- 📊 Automated KPI extraction (OOS, SOS, Planogram Compliance)
- ⚡ 85% reduction in audit time
- 🎯 95%+ accuracy in product recognition

---

**Built with ❤️ by the InsightsHive Team**
