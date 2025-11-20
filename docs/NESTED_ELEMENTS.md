# Nested Elements & Deep Traversal

Smart-skeleton automatically handles deeply nested DOM structures while preserving layout integrity.

## How It Works

The library uses **depth-first traversal** to process nested elements:

1. Analyzes parent container layout (flex/grid)
2. Recursively processes children up to `maxDepth`
3. Preserves spacing, gaps, and alignment
4. Replaces content while maintaining structure

## Depth Control

```javascript
Skeleton.apply(element, {
  deep: true,        // Enable deep traversal (default: true)
  maxDepth: 10       // Maximum nesting depth (default: 10)
});
```

## Examples

### Simple Nested Card

```html
<div class="card">
  <div class="header">
    <img src="avatar.jpg" />
    <div class="info">
      <h3>John Doe</h3>
      <p>Software Engineer</p>
    </div>
  </div>
  <div class="content">
    <p>Bio text here...</p>
  </div>
</div>
```

```javascript
// Automatically handles all nested children
Skeleton.apply(card, { deep: true });
```

### Complex Dashboard (8 Levels Deep)

```html
<div class="dashboard">                    <!-- Level 1 -->
  <div class="stats-grid">                 <!-- Level 2 -->
    <div class="stat-card">                <!-- Level 3 -->
      <div class="stat-header">            <!-- Level 4 -->
        <div class="stat-icon">            <!-- Level 5 -->
          <span>📊</span>
        </div>
        <div class="stat-info">            <!-- Level 5 -->
          <h4>Revenue</h4>
          <p class="stat-value">$12,345</p>
        </div>
      </div>
      <div class="stat-footer">            <!-- Level 4 -->
        <div class="trend">                <!-- Level 5 -->
          <span class="arrow">↑</span>
          <span class="percentage">12%</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

```javascript
Skeleton.apply(dashboard, {
  deep: true,
  maxDepth: 8,  // Handles all 8 levels
  randomize: true
});
```

### Grid with Nested Cards

```html
<div class="products-grid">
  <div class="product-card">
    <div class="product-image">
      <img src="product1.jpg" />
      <span class="badge">New</span>
    </div>
    <div class="product-info">
      <h3>Product Name</h3>
      <div class="rating">
        <span class="stars">★★★★★</span>
        <span class="count">(123)</span>
      </div>
      <p class="description">Product details...</p>
      <div class="product-footer">
        <div class="price">
          <span class="current">$99.99</span>
          <span class="old">$149.99</span>
        </div>
        <button>Add to Cart</button>
      </div>
    </div>
  </div>
  <!-- More cards... -->
</div>
```

```javascript
// Handles entire grid and all nested cards
Skeleton.apply(grid, {
  deep: true,
  maxDepth: 6,
  randomize: true
});
```

### Table with Nested Cells

```html
<table class="data-table">
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Customer</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>#12345</td>
      <td>
        <div class="customer">
          <img src="avatar.jpg" />
          <div class="customer-info">
            <span class="name">John Doe</span>
            <span class="email">john@example.com</span>
          </div>
        </div>
      </td>
      <td>
        <div class="order-details">
          <span class="amount">$299.99</span>
          <span class="status badge">Shipped</span>
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

```javascript
Skeleton.apply(table, {
  deep: true,
  maxDepth: 5
});
```

### Flex/Grid Layouts

Smart-skeleton **preserves layout properties**:

#### Flexbox
```html
<div class="flex-container" style="display: flex; gap: 20px;">
  <div class="flex-item">Content 1</div>
  <div class="flex-item">Content 2</div>
  <div class="flex-item">Content 3</div>
</div>
```

```javascript
// Maintains flex layout and gap
Skeleton.apply(container, { deep: true });
```

#### CSS Grid
```html
<div class="grid-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
</div>
```

```javascript
// Preserves grid structure
Skeleton.apply(container, { deep: true });
```

## Performance with Nested Elements

### Batch Processing

For large nested structures, elements are processed in batches:

```javascript
// Automatically batches children in groups of 20
Skeleton.apply(largeContainer, { deep: true });
```

### Optimize Deep Nesting

```javascript
// Limit depth for better performance
Skeleton.apply(element, {
  deep: true,
  maxDepth: 5  // Stop at 5 levels
});
```

### Shallow Mode

For containers with many items but shallow nesting:

```javascript
Skeleton.apply(element, {
  deep: false  // Only process immediate children
});
```

## Real-World Examples

### Social Media Feed

```javascript
const feed = document.querySelector('.feed');

Skeleton.apply(feed, {
  theme: 'light',
  deep: true,
  maxDepth: 7,  // Posts > Header > Avatar+Info > Actions > Comments
  randomize: true
});
```

### E-commerce Product Grid

```javascript
const grid = document.querySelector('.products');

Skeleton.apply(grid, {
  theme: 'light',
  deep: true,
  maxDepth: 6,  // Grid > Card > Image+Info > Price+Button
  randomize: true
});
```

### Admin Dashboard

```javascript
const dashboard = document.querySelector('.dashboard');

Skeleton.apply(dashboard, {
  theme: 'light',
  deep: true,
  maxDepth: 8,  // Dashboard > Sections > Cards > Content > Nested data
  randomize: true,
  speed: 'fast'
});
```

## Layout Preservation

### What's Preserved

✅ Flexbox properties (direction, gap, wrap)
✅ Grid properties (columns, rows, gap)
✅ Padding and margin
✅ Border radius
✅ Width and height
✅ Display type

### What's Replaced

❌ Text content
❌ Images (with placeholder)
❌ Background images
❌ Icons

## Tips for Complex Structures

1. **Set appropriate maxDepth**: Match your deepest nesting level
2. **Use deep mode**: Always enable for nested components
3. **Test different themes**: Some work better with dark backgrounds
4. **Randomize text**: Makes skeleton more realistic
5. **Batch large lists**: Library handles this automatically

## Troubleshooting

### Skeleton not appearing in nested elements?

```javascript
// Increase maxDepth
Skeleton.apply(element, {
  deep: true,
  maxDepth: 15  // Increase if needed
});
```

### Layout breaking?

```javascript
// Ensure parent has defined dimensions
element.style.minHeight = '200px';
Skeleton.apply(element, { deep: true });
```

### Performance issues with deep nesting?

```javascript
// Reduce maxDepth or use shallow mode
Skeleton.apply(element, {
  deep: true,
  maxDepth: 5  // Lower depth
});
```
