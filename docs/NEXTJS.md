# Next.js Integration Guide

## Installation

```bash
npm install smart-skeleton
```

## App Router (Next.js 13+)

### Client Component

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Skeleton from 'smart-skeleton';

export default function ProductCard({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      if (loading) {
        Skeleton.apply(cardRef.current, { theme: 'light' });
      } else {
        Skeleton.remove(cardRef.current);
      }
    }
  }, [loading]);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [productId]);

  return (
    <div ref={cardRef} className="card">
      {product && (
        <>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <button>Buy Now</button>
        </>
      )}
    </div>
  );
}
```

### Server Component with Suspense

```tsx
// app/products/page.tsx
import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
```

```tsx
// components/ProductGridSkeleton.tsx
'use client';

import { useEffect, useRef } from 'react';
import Skeleton from 'smart-skeleton';

export default function ProductGridSkeleton() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      Skeleton.apply(gridRef.current, { 
        theme: 'light',
        randomize: true 
      });
    }

    return () => {
      if (gridRef.current) {
        Skeleton.remove(gridRef.current);
      }
    };
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="card p-4">
          <div className="h-48 bg-gray-200 mb-4"></div>
          <h3 className="text-lg font-bold mb-2">Product Title</h3>
          <p className="text-gray-600 mb-4">
            Product description goes here with some details about the product.
          </p>
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Pages Router (Next.js 12 and below)

```tsx
// pages/products/[id].tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'smart-skeleton';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      if (loading) {
        Skeleton.apply(pageRef.current, { theme: 'light' });
      } else {
        Skeleton.remove(pageRef.current);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div ref={pageRef} className="container">
      {product && (
        <>
          <img src={product.image} alt={product.name} />
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <span>${product.price}</span>
        </>
      )}
    </div>
  );
}
```

## With Next.js API Routes

```tsx
// pages/dashboard.tsx
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'smart-skeleton';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dashboardRef.current) {
      if (loading) {
        Skeleton.apply(dashboardRef.current, { 
          theme: 'light',
          deep: true,
          maxDepth: 5
        });
      } else {
        Skeleton.remove(dashboardRef.current);
      }
    }
  }, [loading]);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  return (
    <div ref={dashboardRef} className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats?.users}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>${stats?.revenue}</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p>{stats?.orders}</p>
        </div>
      </div>
    </div>
  );
}
```

## Dynamic Import (Code Splitting)

```tsx
import dynamic from 'next/dynamic';

const SkeletonWrapper = dynamic(
  () => import('@/components/SkeletonWrapper'),
  { ssr: false }
);

export default function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <SkeletonWrapper isLoading={loading}>
      {/* Your content */}
    </SkeletonWrapper>
  );
}
```

## SSR Considerations

Smart-skeleton requires DOM access, so:

1. **Use 'use client' directive** in App Router
2. **Use dynamic import with `ssr: false`** in Pages Router
3. **Apply skeleton only on client-side** in useEffect

```tsx
'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'smart-skeleton';

export default function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return children;
}
```

## With TailwindCSS

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Skeleton from 'smart-skeleton';

export default function TailwindCard({ isLoading }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && isLoading) {
      Skeleton.apply(cardRef.current, { 
        theme: 'light',
        randomize: true 
      });
    } else if (cardRef.current) {
      Skeleton.remove(cardRef.current);
    }
  }, [isLoading]);

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <img 
        className="w-full h-48 object-cover rounded-md mb-4"
        src="/product.jpg"
        alt="Product"
      />
      <h3 className="text-xl font-bold mb-2">Product Name</h3>
      <p className="text-gray-600 mb-4">Product description</p>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
}
```
