/**
 * Utility functions for caching and restoring original content
 */

interface CachedData {
  html: string;
  classes: string[];
  attributes: Map<string, string>;
}

const cache = new WeakMap<HTMLElement, CachedData>();

/**
 * Cache the original state of an element
 */
export function cacheOriginalState(element: HTMLElement): void {
  if (cache.has(element)) {
    return; // Already cached
  }
  
  const data: CachedData = {
    html: element.innerHTML,
    classes: Array.from(element.classList),
    attributes: new Map(),
  };
  
  // Cache relevant attributes
  const attrs = element.attributes;
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name.startsWith('data-skeleton-')) {
      continue; // Skip our own attributes
    }
    data.attributes.set(attr.name, attr.value);
  }
  
  cache.set(element, data);
}

/**
 * Check if an element has cached state
 */
export function hasCachedState(element: HTMLElement): boolean {
  return cache.has(element);
}

/**
 * Restore the original state of an element
 */
export function restoreOriginalState(element: HTMLElement): boolean {
  const data = cache.get(element);
  
  if (!data) {
    return false; // No cached data
  }
  
  // Restore HTML content
  element.innerHTML = data.html;
  
  // Remove skeleton-specific classes
  element.classList.remove(
    'smart-skeleton-container',
    'smart-skeleton-theme-light',
    'smart-skeleton-theme-dark',
    'smart-skeleton-theme-brand',
    'smart-skeleton-shimmer',
    'smart-skeleton-no-shimmer',
    'smart-skeleton-speed-slow',
    'smart-skeleton-speed-fast'
  );
  
  // Remove skeleton data attributes
  const attrsToRemove: string[] = [];
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name.startsWith('data-skeleton-')) {
      attrsToRemove.push(attr.name);
    }
  }
  attrsToRemove.forEach(attr => element.removeAttribute(attr));
  
  // Clear the cache
  cache.delete(element);
  
  return true;
}

/**
 * Clear all cached data (useful for cleanup)
 */
export function clearCache(): void {
  // WeakMap doesn't have a clear method, but entries are automatically garbage collected
  // This is a no-op but kept for API consistency
}

/**
 * Mark an element as having skeleton applied
 */
export function markAsSkeletonized(element: HTMLElement): void {
  element.setAttribute('data-skeleton-active', 'true');
}

/**
 * Check if an element has skeleton applied
 */
export function isSkeletonized(element: HTMLElement): boolean {
  return element.hasAttribute('data-skeleton-active');
}

/**
 * Unmark an element as having skeleton applied
 */
export function unmarkAsSkeletonized(element: HTMLElement): void {
  element.removeAttribute('data-skeleton-active');
}
