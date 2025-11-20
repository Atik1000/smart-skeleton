# Vue.js Integration Guide

## Installation

```bash
npm install smart-skeleton
```

## Vue 3 Composition API

### Basic Usage

```vue
<template>
  <div ref="cardRef" class="card">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <button>Add to Cart</button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Skeleton from 'smart-skeleton';

const props = defineProps({
  isLoading: Boolean,
  product: Object
});

const cardRef = ref(null);

watch(() => props.isLoading, (loading) => {
  if (cardRef.value) {
    if (loading) {
      Skeleton.apply(cardRef.value, { theme: 'light' });
    } else {
      Skeleton.remove(cardRef.value);
    }
  }
});

onMounted(() => {
  if (props.isLoading && cardRef.value) {
    Skeleton.apply(cardRef.value, { theme: 'light' });
  }
});

onUnmounted(() => {
  if (cardRef.value && Skeleton.isActive(cardRef.value)) {
    Skeleton.remove(cardRef.value);
  }
});
</script>
```

## Custom Composable

```javascript
// composables/useSkeleton.js
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Skeleton from 'smart-skeleton';

export function useSkeleton(isLoading, options = {}) {
  const elementRef = ref(null);

  const applySkeleton = () => {
    if (elementRef.value && isLoading.value) {
      Skeleton.apply(elementRef.value, options);
    }
  };

  const removeSkeleton = () => {
    if (elementRef.value) {
      Skeleton.remove(elementRef.value);
    }
  };

  watch(isLoading, (loading) => {
    if (elementRef.value) {
      if (loading) {
        Skeleton.apply(elementRef.value, options);
      } else {
        Skeleton.remove(elementRef.value);
      }
    }
  });

  onMounted(() => {
    if (isLoading.value) {
      applySkeleton();
    }
  });

  onUnmounted(() => {
    removeSkeleton();
  });

  return {
    elementRef,
    applySkeleton,
    removeSkeleton
  };
}
```

### Using the Composable

```vue
<template>
  <div ref="elementRef" class="profile">
    <img :src="user.avatar" :alt="user.name" />
    <h2>{{ user.name }}</h2>
    <p>{{ user.bio }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSkeleton } from '@/composables/useSkeleton';

const isLoading = ref(true);
const user = ref(null);

const { elementRef } = useSkeleton(isLoading, {
  theme: 'light',
  randomize: true
});

// Fetch user data
fetchUser().then(data => {
  user.value = data;
  isLoading.value = false;
});
</script>
```

## Vue 3 Options API

```vue
<template>
  <div ref="cardElement" class="card">
    <img :src="product.image" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
  </div>
</template>

<script>
import Skeleton from 'smart-skeleton';

export default {
  props: {
    isLoading: Boolean,
    product: Object
  },
  watch: {
    isLoading(loading) {
      if (this.$refs.cardElement) {
        if (loading) {
          Skeleton.apply(this.$refs.cardElement, { theme: 'light' });
        } else {
          Skeleton.remove(this.$refs.cardElement);
        }
      }
    }
  },
  mounted() {
    if (this.isLoading && this.$refs.cardElement) {
      Skeleton.apply(this.$refs.cardElement, { theme: 'light' });
    }
  },
  beforeUnmount() {
    if (this.$refs.cardElement && Skeleton.isActive(this.$refs.cardElement)) {
      Skeleton.remove(this.$refs.cardElement);
    }
  }
};
</script>
```

## Reusable Component

```vue
<!-- components/SkeletonWrapper.vue -->
<template>
  <div ref="wrapperRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Skeleton from 'smart-skeleton';

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    default: 'light'
  },
  randomize: {
    type: Boolean,
    default: true
  },
  speed: {
    type: String,
    default: 'normal'
  }
});

const wrapperRef = ref(null);

watch(() => props.isLoading, (loading) => {
  if (wrapperRef.value) {
    if (loading) {
      Skeleton.apply(wrapperRef.value, {
        theme: props.theme,
        randomize: props.randomize,
        speed: props.speed
      });
    } else {
      Skeleton.remove(wrapperRef.value);
    }
  }
});

onMounted(() => {
  if (props.isLoading && wrapperRef.value) {
    Skeleton.apply(wrapperRef.value, {
      theme: props.theme,
      randomize: props.randomize,
      speed: props.speed
    });
  }
});

onUnmounted(() => {
  if (wrapperRef.value && Skeleton.isActive(wrapperRef.value)) {
    Skeleton.remove(wrapperRef.value);
  }
});
</script>
```

### Using SkeletonWrapper

```vue
<template>
  <div class="products">
    <SkeletonWrapper 
      v-for="product in products"
      :key="product.id"
      :is-loading="loading"
      theme="light"
      :randomize="true"
    >
      <div class="card">
        <img :src="product.image" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <button>Buy Now</button>
      </div>
    </SkeletonWrapper>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SkeletonWrapper from '@/components/SkeletonWrapper.vue';

const loading = ref(true);
const products = ref([]);

// Fetch products
fetchProducts().then(data => {
  products.value = data;
  loading.value = false;
});
</script>
```

## With Pinia Store

```javascript
// stores/products.js
import { defineStore } from 'pinia';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await fetch('/api/products');
        this.products = await response.json();
      } finally {
        this.loading = false;
      }
    }
  }
});
```

```vue
<template>
  <div ref="gridRef" class="product-grid">
    <div v-for="product in products" :key="product.id" class="card">
      <img :src="product.image" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useProductStore } from '@/stores/products';
import Skeleton from 'smart-skeleton';

const store = useProductStore();
const gridRef = ref(null);

watch(() => store.loading, (loading) => {
  if (gridRef.value) {
    if (loading) {
      Skeleton.apply(gridRef.value, { theme: 'light' });
    } else {
      Skeleton.remove(gridRef.value);
    }
  }
});

onMounted(() => {
  store.fetchProducts();
});
</script>
```

## With Vue Router

```vue
<template>
  <div ref="pageRef" class="page">
    <h1>{{ product.name }}</h1>
    <img :src="product.image" />
    <p>{{ product.description }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Skeleton from 'smart-skeleton';

const route = useRoute();
const pageRef = ref(null);
const loading = ref(true);
const product = ref(null);

const loadProduct = async () => {
  loading.value = true;
  if (pageRef.value) {
    Skeleton.apply(pageRef.value, { theme: 'light' });
  }
  
  const data = await fetch(`/api/products/${route.params.id}`).then(r => r.json());
  product.value = data;
  loading.value = false;
  
  if (pageRef.value) {
    Skeleton.remove(pageRef.value);
  }
};

watch(() => route.params.id, () => {
  loadProduct();
});

onMounted(() => {
  loadProduct();
});
</script>
```

## TypeScript Support

```typescript
// composables/useSkeleton.ts
import { Ref, watch, onMounted, onUnmounted, ref } from 'vue';
import Skeleton, { SkeletonOptions } from 'smart-skeleton';

export function useSkeleton(
  isLoading: Ref<boolean>,
  options: SkeletonOptions = {}
) {
  const elementRef = ref<HTMLElement | null>(null);

  watch(isLoading, (loading) => {
    if (elementRef.value) {
      if (loading) {
        Skeleton.apply(elementRef.value, options);
      } else {
        Skeleton.remove(elementRef.value);
      }
    }
  });

  onMounted(() => {
    if (isLoading.value && elementRef.value) {
      Skeleton.apply(elementRef.value, options);
    }
  });

  onUnmounted(() => {
    if (elementRef.value && Skeleton.isActive(elementRef.value)) {
      Skeleton.remove(elementRef.value);
    }
  });

  return { elementRef };
}
```
