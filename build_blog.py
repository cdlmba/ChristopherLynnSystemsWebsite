import os
import glob
import markdown
import frontmatter
from datetime import datetime

# CONFIGURATION
POSTS_DIR = '_posts'
OUTPUT_DIR = 'blog'
TEMPLATES_DIR = 'templates'
INDEX_OUTPUT = 'blog.html'

def load_template(template_name):
    with open(os.path.join(TEMPLATES_DIR, template_name), 'r', encoding='utf-8') as f:
        return f.read()

def build_blog():
    print("🚀 Starting Blog Build Process...")
    
    # 1. Get all markdown files
    post_files = glob.glob(os.path.join(POSTS_DIR, '*.md'))
    posts = []

    if not post_files:
        print("⚠️  No posts found in /_posts. Add some markdown files first!")
        return

    # 2. Parse all posts
    for file_path in post_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            
            # Basic validation
            if 'title' not in post.metadata:
                print(f"Skipping {file_path}: Missing 'title' in frontmatter")
                continue
            
            # Helper: Filename slug (e.g., '2023-01-01-my-post.md' -> 'my-post.html')
            filename = os.path.basename(file_path)
            slug = filename.replace('.md', '')
            # If filename starts with date like YYYY-MM-DD, we can strip it for cleaner URLs if desired
            # For now, let's keep it simple: exact filename mapped to html
            
            # Convert Markdown to HTML
            html_content = markdown.markdown(post.content)
            
            # Store data
            post_data = {
                'metadata': post.metadata,
                'content': html_content,
                'slug': slug,
                'url': f'blog/{slug}.html',
                'date_obj': post.metadata.get('date', datetime.min)
            }
            posts.append(post_data)

    # 3. Sort by date (Newest first)
    posts.sort(key=lambda x: x['date_obj'], reverse=True)

    # 4. Generate Individual Post Pages
    post_template = load_template('blog_post_template.html')
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for post in posts:
        # Prepare replacements
        output_html = post_template
        output_html = output_html.replace('{{title}}', post['metadata'].get('title', 'Untitled'))
        output_html = output_html.replace('{{date}}', str(post['metadata'].get('date', '')))
        output_html = output_html.replace('{{category}}', post['metadata'].get('category', 'General'))
        output_html = output_html.replace('{{description}}', post['metadata'].get('description', ''))
        output_html = output_html.replace('{{content}}', post['content'])
        
        # Write file
        output_path = os.path.join(OUTPUT_DIR, f"{post['slug']}.html")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(output_html)
        print(f"✅ Generated: {output_path}")

    # 5. Generate Index Page (blog.html)
    index_template = load_template('blog_index_template.html')
    posts_html = ""

    for index, post in enumerate(posts):
        # First post is featured?
        card_class = "blog-card featured-post" if index == 0 else "blog-card"
        
        # Fallback image if none provided
        image_url = post['metadata'].get('image', 'images/default_blog.jpg') # Ensure you have this or handle it
        
        # Create HTML Card
        card_html = f"""
        <article class="{card_class}">
            <div class="blog-card-img" style="background-image: url('{image_url}'); background-size: cover; background-position: center;"></div>
            <div class="blog-card-content">
                <div class="blog-card-meta">{post['metadata'].get('date', '')} • {post['metadata'].get('category', 'Blog')}</div>
                <h2 class="blog-card-title"><a href="{post['url']}">{post['metadata'].get('title')}</a></h2>
                <p class="blog-card-excerpt">{post['metadata'].get('description', '')}</p>
                <a href="{post['url']}" class="blog-card-link">Read Article →</a>
            </div>
        </article>
        """
        posts_html += card_html

    # Inject into index
    final_index_html = index_template.replace('{{posts_list}}', posts_html)
    
    with open(INDEX_OUTPUT, 'w', encoding='utf-8') as f:
        f.write(final_index_html)
    
    print(f"🎉 Blog Index Updated: {INDEX_OUTPUT}")

if __name__ == "__main__":
    try:
        build_blog()
    except ImportError as e:
        print("❌ Error: Missing Dependencies.")
        print(f"Details: {e}")
        print("Please run: pip install markdown python-frontmatter")
    except Exception as e:
        print(f"❌ An error occurred: {e}")
