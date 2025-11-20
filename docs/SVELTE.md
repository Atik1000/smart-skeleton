# Svelte Integration Guide

## Installation

```bash
npm install smart-skeleton
```

## Basic Usage

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import Skeleton from 'smart-skeleton';

  export let isLoading = false;
  export let product;

  let cardElement;

  $: if (cardElement) {
    if (isLoading) {
      Skeleton.apply(cardElement, { theme: 'light' });
    } else {
      Skeleton.remove(cardElement);
    }
  }

  onDestroy(() => {
    if (cardElement && Skeleton.isActive(cardElement)) {
      Skeleton.remove(cardElement);
    }
  });
</script>

<div bind:this={cardElement} class="card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{product.description}</p>
  <button>Add to Cart</button>
</div>
```

## Reactive Skeleton

```svelte
<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import Skeleton from 'smart-skeleton';

  export let loading = true;
  export let theme = 'light';
  export let randomize = true;

  let element;

  $: options = { theme, randomize };

  $: if (element) {
    if (loading) {
      Skeleton.apply(element, options);
    } else {
      Skeleton.remove(element);
    }
  }

  onDestroy(() => {
    if (element && Skeleton.isActive(element)) {
      Skeleton.remove(element);
    }
  });
</script>

<div bind:this={element}>
  <slot />
</div>
```

## Reusable Component

```svelte
<!-- SkeletonWrapper.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import Skeleton from 'smart-skeleton';

  export let isLoading = false;
  export let theme = 'light';
  export let randomize = true;
  export let speed = 'normal';
  export let shimmer = true;

  let wrapperElement;

  $: if (wrapperElement) {
    if (isLoading) {
      Skeleton.apply(wrapperElement, {
        theme,
        randomize,
        speed,
        shimmer
      });
    } else {
      Skeleton.remove(wrapperElement);
    }
  }

  onDestroy(() => {
    if (wrapperElement && Skeleton.isActive(wrapperElement)) {
      Skeleton.remove(wrapperElement);
    }
  });
</script>

<div bind:this={wrapperElement} class={$$props.class}>
  <slot />
</div>
```

### Using SkeletonWrapper

```svelte
<script>
  import { onMount } from 'svelte';
  import SkeletonWrapper from './SkeletonWrapper.svelte';

  let loading = true;
  let products = [];

  onMount(async () => {
    const response = await fetch('/api/products');
    products = await response.json();
    loading = false;
  });
</script>

<div class="grid">
  {#each products as product (product.id)}
    <SkeletonWrapper isLoading={loading} theme="light" randomize={true}>
      <div class="card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <button>Buy Now</button>
      </div>
    </SkeletonWrapper>
  {/each}
</div>
```

## With Svelte Stores

```javascript
// stores.js
import { writable } from 'svelte/store';

export const loading = writable(true);
export const products = writable([]);

export async function fetchProducts() {
  loading.set(true);
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    products.set(data);
  } finally {
    loading.set(false);
  }
}
```

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { loading, products, fetchProducts } from './stores';
  import Skeleton from 'smart-skeleton';

  let gridElement;

  $: if (gridElement) {
    if ($loading) {
      Skeleton.apply(gridElement, { theme: 'light' });
    } else {
      Skeleton.remove(gridElement);
    }
  }

  onMount(() => {
    fetchProducts();
  });

  onDestroy(() => {
    if (gridElement && Skeleton.isActive(gridElement)) {
      Skeleton.remove(gridElement);
    }
  });
</script>

<div bind:this={gridElement} class="product-grid">
  {#each $products as product (product.id)}
    <div class="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </div>
  {/each}
</div>
```

## SvelteKit

### +page.svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import Skeleton from 'smart-skeleton';

  export let data;

  let pageElement;
  let loading = false;

  $: if (pageElement) {
    if (loading) {
      Skeleton.apply(pageElement, { 
        theme: 'light',
        deep: true,
        maxDepth: 5
      });
    } else {
      Skeleton.remove(pageElement);
    }
  }

  onDestroy(() => {
    if (pageElement && Skeleton.isActive(pageElement)) {
      Skeleton.remove(pageElement);
    }
  });
</script>

<div bind:this={pageElement} class="page">
  <h1>{data.title}</h1>
  <img src={data.image} alt={data.title} />
  <p>{data.content}</p>
</div>
```

### +page.js (Load Function)

```javascript
export async function load({ fetch, params }) {
  const response = await fetch(`/api/products/${params.id}`);
  const product = await response.json();
  
  return {
    product
  };
}
```

### Layout with Skeleton

```svelte
<!-- +layout.svelte -->
<script>
  import { navigating } from '$app/stores';
  import { onMount, onDestroy, beforeUpdate } from 'svelte';
  import Skeleton from 'smart-skeleton';

  let mainElement;

  $: if (mainElement && $navigating) {
    Skeleton.apply(mainElement, { 
      theme: 'light',
      speed: 'fast'
    });
  } else if (mainElement && !$navigating) {
    Skeleton.remove(mainElement);
  }

  onDestroy(() => {
    if (mainElement && Skeleton.isActive(mainElement)) {
      Skeleton.remove(mainElement);
    }
  });
</script>

<div class="layout">
  <header>
    <nav><!-- Navigation --></nav>
  </header>
  
  <main bind:this={mainElement}>
    <slot />
  </main>
  
  <footer><!-- Footer --></footer>
</div>
```

## Custom Action (Advanced)

```javascript
// actions/skeleton.js
import Skeleton from 'smart-skeleton';

export function skeleton(node, options = {}) {
  let isActive = false;

  function apply() {
    if (!isActive) {
      Skeleton.apply(node, options);
      isActive = true;
    }
  }

  function remove() {
    if (isActive) {
      Skeleton.remove(node);
      isActive = false;
    }
  }

  // Apply if loading option is true
  if (options.loading) {
    apply();
  }

  return {
    update(newOptions) {
      if (newOptions.loading && !isActive) {
        apply();
      } else if (!newOptions.loading && isActive) {
        remove();
      }
    },
    destroy() {
      remove();
    }
  };
}
```

### Using Custom Action

```svelte
<script>
  import { skeleton } from './actions/skeleton';

  let loading = true;
  let product;

  async function loadProduct() {
    loading = true;
    const response = await fetch('/api/product');
    product = await response.json();
    loading = false;
  }
</script>

<div use:skeleton={{ loading, theme: 'light', randomize: true }} class="card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{product.description}</p>
  <button>Add to Cart</button>
</div>
```

## TypeScript Support

```typescript
// SkeletonWrapper.svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import Skeleton, { type SkeletonOptions } from 'smart-skeleton';

  export let isLoading: boolean = false;
  export let options: SkeletonOptions = { theme: 'light' };

  let element: HTMLElement;

  $: if (element) {
    if (isLoading) {
      Skeleton.apply(element, options);
    } else {
      Skeleton.remove(element);
    }
  }

  onDestroy(() => {
    if (element && Skeleton.isActive(element)) {
      Skeleton.remove(element);
    }
  });
</script>

<div bind:this={element}>
  <slot />
</div>
```

## Multiple Elements

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import Skeleton from 'smart-skeleton';

  let loading = true;
  let statsEl, chartEl, tableEl;

  $: if (loading) {
    [statsEl, chartEl, tableEl].forEach(el => {
      if (el) Skeleton.apply(el, { theme: 'light' });
    });
  } else {
    [statsEl, chartEl, tableEl].forEach(el => {
      if (el) Skeleton.remove(el);
    });
  }

  onMount(async () => {
    await loadDashboardData();
    loading = false;
  });

  onDestroy(() => {
    [statsEl, chartEl, tableEl].forEach(el => {
      if (el && Skeleton.isActive(el)) Skeleton.remove(el);
    });
  });
</script>

<div class="dashboard">
  <div bind:this={statsEl} class="stats">
    <!-- Stats content -->
  </div>
  <div bind:this={chartEl} class="chart">
    <!-- Chart content -->
  </div>
  <div bind:this={tableEl} class="table">
    <!-- Table content -->
  </div>
</div>
```
