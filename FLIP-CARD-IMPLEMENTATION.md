# Flip Card Implementation Guide

## Overview
This guide explains how to convert the pillar cards into interactive flip cards with detailed content on the back.

## Files Created
1. `flip-cards-template.html` - HTML structure for the flip cards
2. `flip-card-styles.css` - CSS styles for the flip animation

## Implementation Steps

### Step 1: Update index.html
Replace the pillar grid section (lines 108-133) with the content from `flip-cards-template.html`.

**Find this section:**
```html
<div class="pillar-grid">
    <!-- FULLY LINKED: Radical Clarity -->
    <a href="#radical-clarity-content" class="pillar-card-link">
        <div class="pillar-card">
            ...
        </div>
    </a>
    ...
</div>
```

**Replace with the flip card structure from flip-cards-template.html**

### Step 2: Update style.css
In `style.css`, find the pillar card styles (around lines 336-360) and replace them with the content from `flip-card-styles.css`.

**Find this section:**
```css
.pillar-card {
    background: rgba(30, 41, 59, 0.5);
    ...
}

.pillar-subtitle {
    font-size: 1rem;
    color: var(--text-color-muted);
}
```

**Replace with all the styles from flip-card-styles.css**

### Step 3: Remove Old Content Sections
Delete the three detailed content sections (lines 137-212 in index.html):
- `<!-- ANCHOR CONTENT 01: RADICAL CLARITY -->`
- `<!-- ANCHOR CONTENT 02: OPTIMIZED ENERGY -->`
- `<!-- ANCHOR CONTENT 03: FOCUSED EXECUTION -->`

These are no longer needed since the content is now on the back of the cards.

### Step 4: Add JavaScript for Mobile (Optional)
Add this script before the closing `</body>` tag in index.html:

```html
<script>
    // Enable click-to-flip on mobile devices
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('flipped');
            }
        });
    });
</script>
```

## How It Works

### Desktop Behavior
- **Hover** over a card to see it flip and reveal detailed content
- Smooth 3D rotation animation (0.6s duration)
- Cards flip back when mouse leaves

### Mobile Behavior
- **Click/Tap** a card to flip it
- Click again to flip back
- Prevents accidental flips from scrolling

### Card Structure
Each flip card has:
- **Front**: Number, title, subtitle, and "Click to learn more" hint
- **Back**: Title, detailed description, and bullet points

## Design Features
- 3D perspective effect (1000px)
- Smooth rotation animation
- Scrollable back content if needed
- Maintains existing color scheme and styling
- Responsive heights (400px desktop, 350px mobile)

## Benefits
1. **More Compact**: Eliminates three large content sections
2. **Interactive**: Engaging user experience with animations
3. **Modern**: Contemporary web design pattern
4. **Mobile-Friendly**: Adapted for touch devices
5. **Cleaner Page**: Less scrolling required

## Testing Checklist
- [ ] Cards flip smoothly on desktop hover
- [ ] Cards flip on mobile click
- [ ] Content is readable on both sides
- [ ] No layout issues on different screen sizes
- [ ] All three cards work independently
- [ ] Back content scrolls if needed
