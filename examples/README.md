# Smart Skeleton Examples

This directory contains various examples demonstrating the capabilities of smart-skeleton.

## Running the Examples

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the provided localhost URL in your browser

## Examples Included

### 1. Basic Usage (`index.html`)
- Product cards with light theme
- Profile cards with randomized widths
- Dark theme demonstration
- Animation speed controls

### 2. Real-World Scenarios

**E-commerce Product Grid**
- Demonstrates skeleton on product listings
- Image placeholders with aspect ratio
- Text lines with random widths
- Button skeletons

**User Profile**
- Avatar skeleton (circular)
- Statistics grid layout
- Bio text with multiple lines
- Maintains flex layout

**Dashboard Cards**
- Complex nested structures
- Chart placeholders
- Mixed content types
- Deep traversal mode

## Customization Tips

1. **Adjust Animation Speed**
   ```javascript
   Skeleton.apply(element, { speed: 'fast' }); // 0.8s
   Skeleton.apply(element, { speed: 'slow' }); // 2.5s
   ```

2. **Custom Brand Colors**
   ```css
   :root {
     --primary-color: #your-brand-color;
     --primary-color-light: #lighter-shade;
   }
   ```
   ```javascript
   Skeleton.apply(element, { theme: 'brand' });
   ```

3. **Disable Shimmer**
   ```javascript
   Skeleton.apply(element, { shimmer: false });
   ```

4. **Control Traversal Depth**
   ```javascript
   Skeleton.apply(element, { deep: true, maxDepth: 5 });
   ```
