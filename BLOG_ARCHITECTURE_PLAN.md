# Static Blog Architecture Plan (Obsidian Workflow)

## 1. Overview
This system allows you to write blog posts in **Obsidian** (Markdown) and automatically publish them to your static website without writing HTML.

**The Workflow:**
1.  **Write**: Create a new note in Obsidian (saved to the website's `_posts` folder).
2.  **Build**: Run `python build_blog.py`.
3.  **Publish**: The script generates all necessary HTML pages and updates the main Blog Index.

## 2. Directory Structure
We will add the following simplified structure to your project:

```text
/104 Christopher Lynn Systems Website
│
├── /_posts/                 <-- YOUR OBSIDIAN VAULT FOLDER
│   ├── 2026-01-09-burnout-myths.md
│   └── 2026-01-15-scaling-systems.md
│
├── /blog/                   <-- GENERATED HTML FILES (Do not edit manually)
│   ├── burnout-myths.html
│   └── scaling-systems.html
│
├── /templates/
│   └── blog_post_template.html   <-- The "Master Design" for all posts
│
├── blog.html                <-- The "Index" page (list of all posts)
└── build_blog.py            <-- The magic script
```

## 3. The Markdown Format (Obsidian)
Every post will start with a small "metadata" block (YAML frontmatter) so the script knows how to display it.

**Example `2026-01-09-burnout-myths.md`:**
```markdown
---
title: "3 Myths About Executive Burnout"
date: 2026-01-09
description: "Why taking a vacation won't obtain the result you want, and what to do instead."
category: "Burnout"
image: "images/blog/burnout-header.jpg"
---

# The Myth of "Time Off"

Most executives think they just need a week at the beach...
(Rest of your article here)
```

## 4. The Build Script logic (`build_blog.py`)
This Python script will be the engine. When run, it will:

1.  **Scan** the `/_posts/` folder for `.md` files.
2.  **Parse** the Frontmatter (title, date, description).
3.  **Convert** the Markdown content into HTML (bolding, headers, lists, links).
4.  **Inject** this content into the `blog_post_template.html` (applying your navigation, footer, and CSS styles).
5.  **Save** the new file to `/blog/`.
6.  **Regenerate** the main `blog.html` page to include the new post in the list, sorted by date.

## 5. Next Implementation Steps
1.  Create the `_posts` directory.
2.  Create the `blog_post_template.html` (matching your new glassmorphism look).
3.  Create the `build_blog.py` script.
4.  Create a strict `blog.html` index page.
