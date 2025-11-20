/**
 * Main Skeleton class for applying and removing skeleton loaders
 */

import {
  getRelevantStyles,
  detectNodeType,
  createSkeletonBlock,
  createTextSkeletons,
  traverseDOM,
  shouldSkipElement,
  NodeType,
  ComputedStyles,
} from './utils/dom';

import {
  cacheOriginalState,
  restoreOriginalState,
  markAsSkeletonized,
  isSkeletonized,
  unmarkAsSkeletonized,
  hasCachedState,
} from './utils/restore';

export type Theme = 'light' | 'dark' | 'brand';
export type AnimationSpeed = 'normal' | 'slow' | 'fast';

export interface SkeletonOptions {
  /** Theme to use for skeleton colors */
  theme?: Theme;
  /** Randomize line widths for text elements */
  randomize?: boolean;
  /** Animation speed */
  speed?: AnimationSpeed;
  /** Enable or disable shimmer animation */
  shimmer?: boolean;
  /** Deep mode - traverse all nested children */
  deep?: boolean;
  /** Maximum depth to traverse (only applies if deep is true) */
  maxDepth?: number;
}

const DEFAULT_OPTIONS: Required<SkeletonOptions> = {
  theme: 'light',
  randomize: true,
  speed: 'normal',
  shimmer: true,
  deep: true,
  maxDepth: 10,
};

class SkeletonClass {
  private cssInjected = false;

  /**
   * Inject CSS styles into the document
   */
  private injectCSS(): void {
    if (this.cssInjected) {
      return;
    }

    const styleId = 'smart-skeleton-styles';
    if (document.getElementById(styleId)) {
      this.cssInjected = true;
      return;
    }

    // Inject CSS as inline style for bundled distribution
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
/* Base skeleton block styling */
.smart-skeleton-block {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}

/* Shimmer animation */
.smart-skeleton-shimmer {
  animation: smart-skeleton-shimmer-animation 1.5s ease-in-out infinite;
}

@keyframes smart-skeleton-shimmer-animation {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Light theme (default) */
.smart-skeleton-theme-light .smart-skeleton-block {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
}

/* Dark theme */
.smart-skeleton-theme-dark .smart-skeleton-block {
  background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  background-size: 200% 100%;
}

/* Brand theme - uses CSS variables */
.smart-skeleton-theme-brand .smart-skeleton-block {
  background: linear-gradient(
    90deg,
    var(--primary-color, #6366f1) 25%,
    var(--primary-color-light, #818cf8) 50%,
    var(--primary-color, #6366f1) 75%
  );
  background-size: 200% 100%;
  opacity: 0.3;
}

/* Text skeleton line styling */
.smart-skeleton-text {
  display: block;
  height: 1em;
  margin-bottom: 0.5em;
}

.smart-skeleton-text:last-child {
  margin-bottom: 0;
}

/* Image skeleton styling */
.smart-skeleton-image {
  display: block;
  width: 100%;
  height: 100%;
}

/* Button skeleton styling */
.smart-skeleton-button {
  display: inline-block;
  height: 100%;
  width: 100%;
}

/* Container that maintains flex/grid layout */
.smart-skeleton-container {
  display: inherit;
  flex-direction: inherit;
  gap: inherit;
  grid-template-columns: inherit;
  grid-template-rows: inherit;
}

/* Hide actual content during skeleton state */
.smart-skeleton-hidden {
  visibility: hidden !important;
  position: absolute !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}

/* Speed variations */
.smart-skeleton-speed-slow {
  animation-duration: 2.5s !important;
}

.smart-skeleton-speed-fast {
  animation-duration: 0.8s !important;
}

/* No animation variant */
.smart-skeleton-no-shimmer {
  animation: none !important;
}
    `;
    
    document.head.appendChild(style);
    this.cssInjected = true;
  }

  /**
   * Apply skeleton loader to an element
   */
  public apply(element: HTMLElement, options: SkeletonOptions = {}): void {
    // Merge options with defaults
    const opts: Required<SkeletonOptions> = { ...DEFAULT_OPTIONS, ...options };

    // Inject CSS if not already done
    this.injectCSS();

    // Check if already skeletonized
    if (isSkeletonized(element)) {
      console.warn('Skeleton already applied to this element');
      return;
    }

    // Cache original state
    cacheOriginalState(element);

    // Apply theme class to root element
    element.classList.add(`smart-skeleton-theme-${opts.theme}`);

    // Apply animation classes
    if (opts.shimmer) {
      element.classList.add('smart-skeleton-shimmer');
    } else {
      element.classList.add('smart-skeleton-no-shimmer');
    }

    // Apply speed class
    if (opts.speed === 'slow') {
      element.classList.add('smart-skeleton-speed-slow');
    } else if (opts.speed === 'fast') {
      element.classList.add('smart-skeleton-speed-fast');
    }

    // Mark as skeletonized
    markAsSkeletonized(element);

    // Process the element
    this.processElement(element, opts, 0);
  }

  /**
   * Process a single element and convert it to skeleton
   */
  private processElement(
    element: HTMLElement,
    options: Required<SkeletonOptions>,
    depth: number
  ): void {
    // Check depth limit
    if (depth > options.maxDepth) {
      return;
    }

    // Skip hidden or tiny elements
    if (shouldSkipElement(element)) {
      return;
    }

    // Detect node type
    const nodeType = detectNodeType(element);

    // Get computed styles
    const styles = getRelevantStyles(element);

    // Handle based on type
    switch (nodeType) {
      case NodeType.TEXT:
        this.replaceWithTextSkeleton(element, styles, options);
        break;

      case NodeType.IMAGE:
      case NodeType.ICON:
        this.replaceWithImageSkeleton(element, styles, options);
        break;

      case NodeType.BUTTON:
        this.replaceWithButtonSkeleton(element, styles, options);
        break;

      case NodeType.CONTAINER:
        if (options.deep) {
          this.processContainer(element, styles, options, depth);
        }
        break;

      case NodeType.IGNORE:
        // Do nothing
        break;
    }
  }

  /**
   * Replace text content with skeleton lines
   */
  private replaceWithTextSkeleton(
    element: HTMLElement,
    styles: ComputedStyles,
    options: Required<SkeletonOptions>
  ): void {
    const fragment = createTextSkeletons(element, styles, {
      randomize: options.randomize,
    });

    // Use DocumentFragment to minimize reflows
    element.innerHTML = '';
    element.appendChild(fragment);
  }

  /**
   * Replace image with skeleton block
   */
  private replaceWithImageSkeleton(
    element: HTMLElement,
    styles: ComputedStyles,
    options: Required<SkeletonOptions>
  ): void {
    const block = createSkeletonBlock(NodeType.IMAGE, styles, {
      randomize: options.randomize,
    });

    element.innerHTML = '';
    element.appendChild(block);
  }

  /**
   * Replace button with skeleton block
   */
  private replaceWithButtonSkeleton(
    element: HTMLElement,
    styles: ComputedStyles,
    options: Required<SkeletonOptions>
  ): void {
    const block = createSkeletonBlock(NodeType.BUTTON, styles, {
      randomize: options.randomize,
    });

    element.innerHTML = '';
    element.appendChild(block);
  }

  /**
   * Process container element - maintain structure but process children
   */
  private processContainer(
    element: HTMLElement,
    styles: ComputedStyles,
    options: Required<SkeletonOptions>,
    depth: number
  ): void {
    // Add container class to maintain layout
    element.classList.add('smart-skeleton-container');

    // Process children recursively using DocumentFragment for better performance
    const children = Array.from(element.children) as HTMLElement[];
    
    // Process in batches for better performance with many children
    const batchSize = 20;
    for (let i = 0; i < children.length; i += batchSize) {
      const batch = children.slice(i, i + batchSize);
      batch.forEach(child => {
        this.processElement(child, options, depth + 1);
      });
    }
  }

  /**
   * Remove skeleton loader and restore original content
   */
  public remove(element: HTMLElement): void {
    // Check if skeletonized
    if (!isSkeletonized(element)) {
      console.warn('No skeleton applied to this element');
      return;
    }

    // Restore original state
    const restored = restoreOriginalState(element);

    if (restored) {
      // Unmark as skeletonized
      unmarkAsSkeletonized(element);
    }
  }

  /**
   * Check if an element has skeleton applied
   */
  public isActive(element: HTMLElement): boolean {
    return isSkeletonized(element);
  }
}

// Export singleton instance
export const Skeleton = new SkeletonClass();
