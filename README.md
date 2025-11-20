# smart-skeleton

🎨 Automatically generate skeleton loaders based on any DOM element's existing layout.

No pre-made skeletons. Just point it at any element and it creates a perfect skeleton loader that matches your design.

## ✨ Features

- **Automatic Layout Detection** - Analyzes your DOM structure and preserves width, height, border-radius, and spacing
- **Smart Content Recognition** - Detects text, images, buttons, icons, and replaces them intelligently
- **Zero Layout Shift** - Maintains exact dimensions and structure during loading
- **Multiple Themes** - Light, dark, and brand color themes built-in
- **Smooth Animations** - Customizable shimmer effects with speed controls
- **Deep Traversal** - Handles deeply nested components
- **Easy Restore** - One-line removal restores original content
- **TypeScript Support** - Full type definitions included
- **Lightweight** - No dependencies, pure TypeScript + CSS

## 📦 Installation

```bash
npm install smart-skeleton
```

## 🚀 Quick Start

```javascript
import Skeleton from 'smart-skeleton';

// Apply skeleton to any element
const card = document.querySelector('.product-card');
Skeleton.apply(card);

// Remove when data loads
setTimeout(() => {
  Skeleton.remove(card);
}, 2000);
```

## 📖 API Reference

### `Skeleton.apply(element, options)`

Apply skeleton loader to a DOM element.

**Parameters:**

- `element` (HTMLElement) - The DOM element to skeletonize
- `options` (SkeletonOptions) - Optional configuration object

**SkeletonOptions:**

```typescript
interface SkeletonOptions {
  /** Theme: 'light' | 'dark' | 'brand' (default: 'light') */
  theme?: 'light' | 'dark' | 'brand';
  
  /** Randomize text line widths (default: true) */
  randomize?: boolean;
  
  /** Animation speed: 'normal' | 'slow' | 'fast' (default: 'normal') */
  speed?: 'normal' | 'slow' | 'fast';
  
  /** Enable shimmer animation (default: true) */
  shimmer?: boolean;
  
  /** Traverse nested children (default: true) */
  deep?: boolean;
  
  /** Maximum traversal depth (default: 10) */
  maxDepth?: number;
}
```

**Example:**

```javascript
Skeleton.apply(element, {
  theme: 'dark',
  randomize: true,
  speed: 'fast',
  shimmer: true,
  deep: true,
  maxDepth: 5
});
```

### `Skeleton.remove(element)`

Remove skeleton loader and restore original content.

**Parameters:**

- `element` (HTMLElement) - The DOM element to restore

**Example:**

```javascript
Skeleton.remove(element);
```

### `Skeleton.isActive(element)`

Check if skeleton is currently applied to an element.

**Parameters:**

- `element` (HTMLElement) - The DOM element to check

**Returns:** `boolean`

**Example:**

```javascript
if (Skeleton.isActive(element)) {
  console.log('Skeleton is active');
}
```

## 🎨 Themes

### Light Theme (Default)

```javascript
Skeleton.apply(element, { theme: 'light' });
```

Uses soft gray tones perfect for light backgrounds.

### Dark Theme

```javascript
Skeleton.apply(element, { theme: 'dark' });
```

Uses dark gray tones for dark mode interfaces.

### Brand Theme

```javascript
Skeleton.apply(element, { theme: 'brand' });
```

Uses CSS variables for brand colors. Define these in your CSS:

```css
:root {
  --primary-color: #6366f1;
  --primary-color-light: #818cf8;
}
```

## 🎭 Usage Examples

### Basic Card Skeleton

```html
<div class="card">
  <img src="product.jpg" alt="Product">
  <h2>Product Title</h2>
  <p>Product description goes here with some text content.</p>
  <button>Add to Cart</button>
</div>
```

```javascript
const card = document.querySelector('.card');

// Show skeleton
Skeleton.apply(card, { theme: 'light' });

// Fetch data
fetch('/api/product')
  .then(response => response.json())
  .then(data => {
    // Remove skeleton and show content
    Skeleton.remove(card);
  });
```

### List with Multiple Items

```javascript
const listItems = document.querySelectorAll('.list-item');

// Apply to all items
listItems.forEach(item => {
  Skeleton.apply(item, {
    theme: 'dark',
    randomize: true
  });
});

// Remove from all after loading
setTimeout(() => {
  listItems.forEach(item => Skeleton.remove(item));
}, 3000);
```

### Custom Animation Speed

```javascript
// Fast animation for quick-loading content
Skeleton.apply(element, { speed: 'fast' });

// Slow animation for dramatic effect
Skeleton.apply(element, { speed: 'slow' });

// No animation at all
Skeleton.apply(element, { shimmer: false });
```

### Shallow vs Deep Mode

```javascript
// Only process immediate children
Skeleton.apply(element, {
  deep: false
});

// Process all nested children (default)
Skeleton.apply(element, {
  deep: true,
  maxDepth: 10
});
```

## 🎯 How It Works

1. **Caching** - Stores original HTML content and element state
2. **Style Analysis** - Uses `window.getComputedStyle` to read dimensions, spacing, and layout properties
3. **Node Detection** - Identifies element types:
   - Images → Rectangle with aspect ratio
   - Text → Multiple lines with random widths
   - Buttons → Solid rectangle
   - Containers → Maintains structure, processes children
4. **DOM Replacement** - Uses `DocumentFragment` for efficient batch updates
5. **Restoration** - Restores original content from cache on remove

## 🔧 Advanced Configuration

### Custom CSS Variables

You can customize brand theme colors:

```css
.my-component {
  --primary-color: #ff6b6b;
  --primary-color-light: #ff8787;
}
```

### Preventing Skeleton on Specific Elements

Add `data-skeleton-ignore` attribute:

```html
<div class="card">
  <div data-skeleton-ignore>Keep this content</div>
  <div>Skeletonize this</div>
</div>
```

## 📊 Performance

- **DocumentFragment** - Minimizes reflows during DOM manipulation
- **Style Caching** - Computed styles are read once per element
- **WeakMap Storage** - Automatic garbage collection of cached data
- **Shallow Skip** - Hidden and tiny elements are automatically skipped

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers supporting ES2020

## 📝 TypeScript

Full TypeScript support with type definitions included:

```typescript
import Skeleton, { SkeletonOptions, Theme, AnimationSpeed } from 'smart-skeleton';

const options: SkeletonOptions = {
  theme: 'dark',
  randomize: true
};

Skeleton.apply(element, options);
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Development mode with hot reload
npm run dev
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/yourusername/smart-skeleton/issues).

---

Made with ❤️ by [Your Name]
