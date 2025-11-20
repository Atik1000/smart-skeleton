/**
 * DOM utility functions for skeleton generation
 */

export interface ComputedStyles {
  width: string;
  height: string;
  borderRadius: string;
  display: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  flexDirection: string;
  gap: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
}

export enum NodeType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  BUTTON = 'BUTTON',
  ICON = 'ICON',
  CONTAINER = 'CONTAINER',
  IGNORE = 'IGNORE',
}

/**
 * Get computed styles for an element
 */
export function getRelevantStyles(element: HTMLElement): ComputedStyles {
  const computed = window.getComputedStyle(element);
  
  return {
    width: computed.width,
    height: computed.height,
    borderRadius: computed.borderRadius,
    display: computed.display,
    paddingTop: computed.paddingTop,
    paddingRight: computed.paddingRight,
    paddingBottom: computed.paddingBottom,
    paddingLeft: computed.paddingLeft,
    marginTop: computed.marginTop,
    marginRight: computed.marginRight,
    marginBottom: computed.marginBottom,
    marginLeft: computed.marginLeft,
    flexDirection: computed.flexDirection,
    gap: computed.gap,
    gridTemplateColumns: computed.gridTemplateColumns,
    gridTemplateRows: computed.gridTemplateRows,
  };
}

/**
 * Detect the type of node for skeleton generation
 */
export function detectNodeType(element: HTMLElement): NodeType {
  const tagName = element.tagName.toLowerCase();
  const computed = window.getComputedStyle(element);
  
  // Images
  if (tagName === 'img' || tagName === 'picture' || tagName === 'video' || tagName === 'canvas') {
    return NodeType.IMAGE;
  }
  
  // Buttons
  if (tagName === 'button' || element.getAttribute('role') === 'button') {
    return NodeType.BUTTON;
  }
  
  // Icons (common patterns)
  if (
    tagName === 'svg' ||
    tagName === 'i' ||
    element.classList.contains('icon') ||
    element.classList.contains('fa') ||
    element.classList.contains('material-icons')
  ) {
    return NodeType.ICON;
  }
  
  // Skip script, style, noscript tags
  if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
    return NodeType.IGNORE;
  }
  
  // Text nodes - has text content but no children or only text children
  const hasTextContent = element.textContent?.trim().length > 0;
  const hasElementChildren = Array.from(element.children).length > 0;
  
  if (hasTextContent && !hasElementChildren) {
    return NodeType.TEXT;
  }
  
  // Container - has children
  if (hasElementChildren) {
    return NodeType.CONTAINER;
  }
  
  // Leaf text node
  if (hasTextContent) {
    return NodeType.TEXT;
  }
  
  return NodeType.IGNORE;
}

/**
 * Create a skeleton block element
 */
export function createSkeletonBlock(
  type: NodeType,
  styles: ComputedStyles,
  options: { randomize?: boolean }
): HTMLElement {
  const block = document.createElement('div');
  block.className = 'smart-skeleton-block';
  
  // Apply computed styles
  block.style.width = styles.width;
  block.style.height = styles.height;
  block.style.borderRadius = styles.borderRadius;
  block.style.margin = `${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}`;
  
  // Type-specific styling
  switch (type) {
    case NodeType.TEXT:
      block.classList.add('smart-skeleton-text');
      // Randomize width for text lines if requested
      if (options.randomize) {
        const widthPercent = 60 + Math.random() * 40; // 60-100%
        block.style.width = `${widthPercent}%`;
      }
      break;
      
    case NodeType.IMAGE:
      block.classList.add('smart-skeleton-image');
      // Maintain aspect ratio
      if (styles.width && styles.height) {
        block.style.aspectRatio = `${parseFloat(styles.width)} / ${parseFloat(styles.height)}`;
      }
      break;
      
    case NodeType.BUTTON:
    case NodeType.ICON:
      block.classList.add('smart-skeleton-button');
      break;
  }
  
  return block;
}

/**
 * Create multiple skeleton lines for text content
 */
export function createTextSkeletons(
  element: HTMLElement,
  styles: ComputedStyles,
  options: { randomize?: boolean }
): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const text = element.textContent?.trim() || '';
  
  // Estimate number of lines based on text length and element dimensions
  const charWidth = 8; // Approximate character width
  const lineHeight = parseFloat(styles.height) || 20;
  const elementWidth = parseFloat(styles.width) || 200;
  
  const charsPerLine = Math.floor(elementWidth / charWidth);
  const estimatedLines = Math.max(1, Math.ceil(text.length / charsPerLine));
  const lines = Math.min(estimatedLines, 5); // Cap at 5 lines
  
  for (let i = 0; i < lines; i++) {
    const line = createSkeletonBlock(NodeType.TEXT, styles, options);
    
    // Last line is often shorter
    if (i === lines - 1 && options.randomize) {
      const widthPercent = 30 + Math.random() * 40; // 30-70%
      line.style.width = `${widthPercent}%`;
    }
    
    fragment.appendChild(line);
  }
  
  return fragment;
}

/**
 * Traverse DOM tree depth-first
 */
export function traverseDOM(
  element: HTMLElement,
  callback: (el: HTMLElement, depth: number) => boolean,
  depth: number = 0
): void {
  // Call callback - if it returns false, stop traversing this branch
  const shouldContinue = callback(element, depth);
  
  if (!shouldContinue) {
    return;
  }
  
  // Traverse children
  const children = Array.from(element.children) as HTMLElement[];
  for (const child of children) {
    traverseDOM(child, callback, depth + 1);
  }
}

/**
 * Check if element should be skipped
 */
export function shouldSkipElement(element: HTMLElement): boolean {
  const computed = window.getComputedStyle(element);
  
  // Skip hidden elements
  if (computed.display === 'none' || computed.visibility === 'hidden') {
    return true;
  }
  
  // Skip very small elements (but be more lenient)
  const width = parseFloat(computed.width);
  const height = parseFloat(computed.height);
  if (width < 5 || height < 5) {
    return true;
  }
  
  return false;
}

/**
 * Check if element is a container that should preserve its structure
 */
export function isStructuralContainer(element: HTMLElement): boolean {
  const computed = window.getComputedStyle(element);
  const tagName = element.tagName.toLowerCase();
  
  // Flex and grid containers
  if (computed.display === 'flex' || 
      computed.display === 'inline-flex' ||
      computed.display === 'grid' ||
      computed.display === 'inline-grid') {
    return true;
  }
  
  // Common structural elements
  const structuralTags = ['div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'ul', 'ol', 'li'];
  if (structuralTags.includes(tagName) && element.children.length > 0) {
    return true;
  }
  
  return false;
}

/**
 * Get all nested elements up to a certain depth
 */
export function getAllNestedElements(
  root: HTMLElement,
  maxDepth: number = 10
): HTMLElement[] {
  const elements: HTMLElement[] = [];
  
  function traverse(element: HTMLElement, depth: number) {
    if (depth > maxDepth || shouldSkipElement(element)) {
      return;
    }
    
    elements.push(element);
    
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        traverse(child, depth + 1);
      }
    });
  }
  
  traverse(root, 0);
  return elements;
}

/**
 * Check if element has significant content
 */
export function hasSignificantContent(element: HTMLElement): boolean {
  // Check for text content
  const textContent = element.textContent?.trim();
  if (textContent && textContent.length > 0) {
    return true;
  }
  
  // Check for images or media
  const hasMedia = element.querySelector('img, video, canvas, svg, iframe');
  if (hasMedia) {
    return true;
  }
  
  // Check for form elements
  const hasFormElements = element.querySelector('input, textarea, select, button');
  if (hasFormElements) {
    return true;
  }
  
  return false;
}
