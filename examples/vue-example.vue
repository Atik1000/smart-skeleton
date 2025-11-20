<template>
  <div class="app">
    <!-- Example 1: Simple Product Card -->
    <div ref="cardRef" class="card">
      <img :src="product.image" :alt="product.name" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <div class="price">${{ product.price }}</div>
      <button>Add to Cart</button>
    </div>

    <!-- Example 2: Deeply Nested User Profile -->
    <div ref="profileRef" class="profile">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="user.avatar" :alt="user.name" />
          <span class="status-indicator online"></span>
        </div>
        <div class="profile-info">
          <h2>{{ user.name }}</h2>
          <p class="profile-title">{{ user.title }}</p>
          <div class="profile-badges">
            <span v-for="badge in user.badges" :key="badge" class="badge">
              {{ badge }}
            </span>
          </div>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat">
          <div class="stat-value">{{ user.stats.followers }}</div>
          <div class="stat-label">Followers</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ user.stats.following }}</div>
          <div class="stat-label">Following</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ user.stats.posts }}</div>
          <div class="stat-label">Posts</div>
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-bio">
          <h3>About</h3>
          <p>{{ user.bio }}</p>
        </div>

        <div class="profile-links">
          <a v-for="link in user.links" :key="link.url" :href="link.url">
            <span class="link-icon">{{ link.icon }}</span>
            <span class="link-text">{{ link.text }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Example 3: Complex Grid Layout -->
    <div ref="gridRef" class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <span class="product-badge">{{ product.badge }}</span>
        </div>
        <div class="product-details">
          <h4>{{ product.name }}</h4>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="reviews">({{ product.reviews }})</span>
          </div>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-footer">
            <div class="product-price">
              <span class="current-price">${{ product.price }}</span>
              <span v-if="product.oldPrice" class="old-price">
                ${{ product.oldPrice }}
              </span>
            </div>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Skeleton from 'smart-skeleton';

// Product Card Example
const cardRef = ref(null);
const cardLoading = ref(true);
const product = ref({});

// Profile Example  
const profileRef = ref(null);
const profileLoading = ref(true);
const user = ref({});

// Grid Example
const gridRef = ref(null);
const gridLoading = ref(true);
const products = ref([]);

// Watch loading states and apply/remove skeleton
watch(cardLoading, (loading) => {
  if (cardRef.value) {
    if (loading) {
      Skeleton.apply(cardRef.value, { 
        theme: 'light',
        randomize: true 
      });
    } else {
      Skeleton.remove(cardRef.value);
    }
  }
});

watch(profileLoading, (loading) => {
  if (profileRef.value) {
    if (loading) {
      // Deep mode handles all nested children
      Skeleton.apply(profileRef.value, { 
        theme: 'light',
        deep: true,
        maxDepth: 8,
        randomize: true 
      });
    } else {
      Skeleton.remove(profileRef.value);
    }
  }
});

watch(gridLoading, (loading) => {
  if (gridRef.value) {
    if (loading) {
      Skeleton.apply(gridRef.value, { 
        theme: 'light',
        deep: true,
        maxDepth: 6,
        randomize: true 
      });
    } else {
      Skeleton.remove(gridRef.value);
    }
  }
});

// Load data
onMounted(async () => {
  // Load product
  const productData = await fetch('/api/product/123').then(r => r.json());
  product.value = productData;
  cardLoading.value = false;

  // Load user profile
  const userData = await fetch('/api/user/profile').then(r => r.json());
  user.value = userData;
  profileLoading.value = false;

  // Load products grid
  const productsData = await fetch('/api/products').then(r => r.json());
  products.value = productsData;
  gridLoading.value = false;
});

// Cleanup
onUnmounted(() => {
  [cardRef, profileRef, gridRef].forEach(ref => {
    if (ref.value && Skeleton.isActive(ref.value)) {
      Skeleton.remove(ref.value);
    }
  });
});
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.profile {
  max-width: 600px;
  margin: 0 auto;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
</style>
