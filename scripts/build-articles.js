import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import matter from "gray-matter";

const contentDir = "content";
const outputDir = "articles";
const dataDir = "data";

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

/**
 * Generate HTML page wrapper for an article
 */
function generateArticlePage(meta, content, slug) {
  const dateFormatted = new Date(meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title} - InsightsHive</title>
    <meta name="description" content="${meta.excerpt}">
    <meta name="author" content="${meta.author}">
    <meta name="keywords" content="${meta.tags ? meta.tags.join(", ") : ""}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.excerpt}">
    <meta property="article:published_time" content="${meta.date}">
    <meta property="article:author" content="${meta.author}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.excerpt}">

    <base href="../">
    <link rel="stylesheet" href="css/main.css">
    <script type="module" src="js/main.js"></script>
</head>
<body class="dark-theme">
    <div id="header-placeholder"></div>
    <div id="nav-placeholder"></div>
    <div id="breadcrumbs-placeholder"></div>

    <main id="main" class="container">
        <article class="article">
            <header class="article__header">
                <h1 class="page-title">${meta.title}</h1>
                <div class="article__meta">
                    <span class="badge badge--${meta.category.toLowerCase().replace(/\s+/g, "-")}">${meta.category}</span>
                    <time datetime="${meta.date}">${dateFormatted}</time>
                    <span class="article__author">By ${meta.author}</span>
                </div>
            </header>

            <div class="article__content">
                ${content}
            </div>

            ${
              meta.tags && meta.tags.length > 0
                ? `
            <footer class="article__tags">
                <strong>Tags:</strong>
                ${meta.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </footer>
            `
                : ""
            }

            <footer class="article__footer">
                <a href="news.html" class="btn btn--secondary">← Back to News</a>
            </footer>
        </article>
    </main>
</body>
</html>`;
}

/**
 * Build all articles from markdown files
 */
async function buildArticles() {
  console.log("🚀 Building articles from markdown...\n");

  // Ensure output directories exist
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });

  const articles = [];

  // Read all markdown files
  const files = await fs.readdir(contentDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  console.log(`Found ${markdownFiles.length} markdown file(s)\n`);

  for (const file of markdownFiles) {
    const filePath = path.join(contentDir, file);
    console.log(`Processing: ${file}`);

    try {
      // Read markdown file
      const fileContent = await fs.readFile(filePath, "utf-8");

      // Parse frontmatter and content
      const { data: meta, content: markdown } = matter(fileContent);

      // Validate required fields
      if (!meta.title || !meta.date || !meta.author) {
        console.warn(
          `⚠️  Skipping ${file}: missing required frontmatter (title, date, author)`,
        );
        continue;
      }

      // Generate slug from filename
      const slug = file.replace(".md", "");

      // Convert markdown to HTML
      const htmlContent = marked(markdown);

      // Ensure date is in ISO format (YYYY-MM-DD)
      const dateISO = meta.date instanceof Date
        ? meta.date.toISOString().split('T')[0]
        : meta.date;

      // Generate full HTML page
      const articleHtml = generateArticlePage(meta, htmlContent, slug);

      // Write HTML file
      const outputFile = `${dateISO}-${slug}.html`;
      const outputPath = path.join(outputDir, outputFile);
      await fs.writeFile(outputPath, articleHtml);

      console.log(`✅ Generated: ${outputFile}`);

      // Add to articles index
      articles.push({
        id: slug,
        slug: slug,
        filename: outputFile,
        title: meta.title,
        date: dateISO,
        author: meta.author,
        category: meta.category || "Uncategorized",
        excerpt: meta.excerpt || "",
        featured: meta.featured || false,
        tags: meta.tags || [],
        image: meta.image || null,
      });
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Sort articles by date (newest first)
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write articles.json
  const articlesJson = {
    articles: articles,
    lastUpdated: new Date().toISOString(),
  };

  await fs.writeFile(
    path.join(dataDir, "articles.json"),
    JSON.stringify(articlesJson, null, 2),
  );

  console.log(`\n✅ Generated ${articles.length} article(s)`);
  console.log(`✅ Updated data/articles.json`);
  console.log("\n🎉 Build complete!\n");
}

// Run the build
buildArticles().catch((error) => {
  console.error("❌ Build failed:", error);
  process.exit(1);
});
