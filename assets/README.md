# Assets Folder

This folder contains icons for the Outlook add-in.

## Required Icons

You need to create three icon files:

- **icon-16.png** - 16x16 pixels (ribbon small icon)
- **icon-32.png** - 32x32 pixels (ribbon medium icon)
- **icon-80.png** - 80x80 pixels (ribbon large icon, high-DPI)

## Icon Requirements

- Format: PNG
- Background: Transparent recommended
- Colors: Should match brand/theme
- Design: Simple, recognizable at small sizes

## Quick Icon Creation

### Option 1: Use Online Tools
- Canva: https://www.canva.com
- Figma: https://www.figma.com
- IconScout: https://iconscout.com

### Option 2: Use Icon Generator
```bash
# If you have ImageMagick installed
convert -size 16x16 xc:none -fill "#667eea" -draw "circle 8,8 8,2" icon-16.png
convert -size 32x32 xc:none -fill "#667eea" -draw "circle 16,16 16,4" icon-32.png
convert -size 80x80 xc:none -fill "#667eea" -draw "circle 40,40 40,10" icon-80.png
```

### Option 3: Simple SVG to PNG
Create SVG, then convert to PNG at required sizes.

## Suggested Design

**Theme:** Email assistant / AI helper
**Symbols:** 
- Envelope with sparkles
- Robot/AI symbol
- Speech bubble
- @ symbol with assistant element

**Colors:**
- Primary: #667eea (purple-blue from UI)
- Secondary: #764ba2 (darker purple)
- Accent: #48bb78 (green for actions)

## Temporary Solution

Until you create icons, you can:
1. Use emoji as icons (📧, 🤖, ✨)
2. Screenshot and crop from UI
3. Use placeholder colored squares

The add-in will work without icons, but they improve the user experience.
