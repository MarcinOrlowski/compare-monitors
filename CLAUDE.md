# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a client-side web application for visually comparing computer monitors to aid in purchasing decisions. It displays monitors as scaled rectangles with interactive features, allowing comparison by physical dimensions (millimeters) or screen resolution (pixels).

## Architecture

### Core Components
- **`monitors.js`**: Single source of truth containing monitor specifications array (`monitors_src`)
- **`js/compare.js`**: Main application logic handling visualization, scaling, and interactions
- **`index.html`**: Static HTML interface with flexbox layout
- **`css/style.css`**: Dark theme styling with monitor overlay positioning

### Key Systems

**Data Flow:**
1. Monitor specs loaded from `monitors_src` array
2. Data transformed and sorted by width (display or resolution)
3. Dynamic scaling calculated based on container width
4. Visual overlays generated with color-coding and positioning

**Scaling Algorithm:**
- Calculates scale ratio (`getScaleRatio()`) based on largest monitor width vs container width
- All monitors scaled proportionally to fit in browser window
- Updates dynamically on window resize

**Label Positioning:**
- Smart overlap prevention system (`findLabelPosition()`, `recalculateAllLabelPositions()`)
- Labels automatically repositioned when monitors are toggled on/off
- Maintains readability across different monitor combinations

## Development

### Local Development
- No build process or server required
- Open `index.html` directly in browser using `file://` protocol
- Changes to any file require browser refresh

### Adding New Monitors
Edit `monitors.js` and add objects to `monitors_src` array with:
- `label`: Display name (must be unique)
- `model`: displayspecifications.com model ID for thumbnails and spec links
- `display`: Physical dimensions `{w, h}` in millimeters
- `resolution`: Screen resolution `{w, h, freq}` in pixels and Hz
- `checked`: Boolean for default visibility (optional, defaults to false)
- `curved`: Boolean flag for curved displays (optional)

### External Dependencies
- jQuery 3.5.1 (local copy in `js/`)
- Monitor images fetched from displayspecifications.com
- Spec links point to displayspecifications.com

### Color System
- 10 predefined colors in `colors` array for monitor differentiation
- Colors cycle through monitors using modulo operation based on z-index
- Background uses colors with alpha transparency (`aa` suffix)
- Borders use same colors with lower opacity (`22` suffix)