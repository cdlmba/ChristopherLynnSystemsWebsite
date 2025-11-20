# FLIP CARD IMPLEMENTATION - MANUAL STEPS

Due to file editing issues, please follow these manual steps to implement the flip cards:

## Step 1: Update index.html

### A. Replace the pillar grid (lines 108-133)

**DELETE lines 108-133** (the entire pillar-grid section)

**INSERT** the content from `flip-cards-template.html` (all 79 lines)

This replaces the simple linked cards with interactive flip cards.

### B. Delete the old content sections (lines 137-212)

**DELETE** these three sections entirely:
- Lines 137-158: `<!-- ANCHOR CONTENT 01: RADICAL CLARITY -->`
- Lines 160-184: `<!-- ANCHOR CONTENT 02: OPTIMIZED ENERGY -->`  
- Lines 186-212: `<!-- ANCHOR CONTENT 03: FOCUSED EXECUTION -->`

The content is now on the back of the flip cards, so these sections are redundant.

### C. Add mobile flip JavaScript (before `</body>`)

**INSERT** before the closing `</body>` tag (around line 318):

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

## Step 2: Update style.css

### Replace pillar card styles (lines 336-360)

**DELETE** lines 336-360 (from `.pillar-card {` to `.pillar-subtitle {`)

**INSERT** the entire content from `flip-card-styles.css` (all 138 lines)

This adds all the CSS needed for the 3D flip animation.

## Summary of Changes

**index.html:**
- Replaced 26 lines with 79 lines (flip card HTML)
- Deleted 76 lines (old content sections)
- Added 10 lines (mobile JavaScript)
- Net change: +13 lines

**style.css:**
- Replaced 25 lines with 138 lines (flip card CSS)
- Net change: +113 lines

## Testing After Implementation

1. Open index.html in a browser
2. **Desktop**: Hover over each card - it should flip smoothly
3. **Mobile**: Click/tap a card - it should flip and stay flipped
4. Check that all three cards work independently
5. Verify content is readable on both front and back
6. Test on different screen sizes

## Expected Result

- Three interactive flip cards in a grid
- Front: Number, title, subtitle, "Click to learn more"
- Back: Title, description, bullet points
- Smooth 3D rotation animation
- No more separate content sections below
- Cleaner, more compact page layout

## Files Reference

- `flip-cards-template.html` - New HTML structure
- `flip-card-styles.css` - New CSS styles
- `FLIP-CARD-IMPLEMENTATION.md` - Detailed guide (this file)

## Troubleshooting

**Cards not flipping?**
- Check that flip-card CSS was added correctly
- Verify JavaScript is before `</body>`
- Check browser console for errors

**Layout broken?**
- Ensure old pillar-card styles were completely replaced
- Check that `.pillar-grid` still exists in CSS

**Content not showing?**
- Verify HTML structure matches template exactly
- Check that all closing tags are present

## Rollback

If something goes wrong:
```
git checkout index.html
git checkout style.css
```

Then try again following the steps carefully.
