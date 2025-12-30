# Blog Content Management

This directory contains the source Markdown files for blog articles.

## How It Works

1. **Write Articles**: Create `.md` files in this directory with frontmatter
2. **Auto-Build**: GitHub Actions automatically builds HTML files from markdown
3. **Auto-Deploy**: Generated articles are committed and deployed to GitHub Pages

## Article Format

Each article must include frontmatter at the top:

```markdown
---
title: "Your Article Title"
date: 2025-12-30
author: Author Name
category: Industry Insights
excerpt: "A brief summary of the article (1-2 sentences)"
featured: true
tags: ["tag1", "tag2", "tag3"]
image: images/articles/your-image.jpg
---

# Your Article Title

Your article content in Markdown...
```

## Frontmatter Fields

- **title** (required): Article title
- **date** (required): Publication date in YYYY-MM-DD format
- **author** (required): Author name
- **category** (optional): Category (defaults to "Uncategorized")
  - Suggested: Industry Insights, Product, Announcements, Technology, Case Study
- **excerpt** (optional): Brief summary for article cards
- **featured** (optional): Set to `true` to feature on news page (default: false)
- **tags** (optional): Array of tags for categorization
- **image** (optional): Path to header image

## Supported Categories

The following categories have custom badge styling:

- Industry Insights
- Product
- Announcements
- Technology
- Case Study

## Adding a New Article

1. Create a new `.md` file in this directory
2. Add frontmatter and content
3. Commit and push to the `main` branch
4. GitHub Actions will automatically:
   - Convert MD to HTML
   - Generate article page in `articles/`
   - Update `data/articles.json`
   - Commit changes back to repo

## Build Locally (Optional)

If you want to test the build locally:

```bash
npm install
npm run build:articles
```

The generated files will appear in:

- `articles/` - Individual article HTML pages
- `data/articles.json` - Article index for the news page

## Markdown Features

Standard Markdown is supported, including:

- Headings (H1-H6)
- Bold and italic text
- Lists (ordered and unordered)
- Links
- Images
- Code blocks
- Blockquotes

## File Naming

File names should be:

- Lowercase with hyphens
- Descriptive of content
- Example: `retail-execution-2025.md`

The final URL will be: `articles/YYYY-MM-DD-filename.html`
