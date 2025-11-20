# React Integration Guide

## Installation

```bash
npm install smart-skeleton
```

## Basic Usage

### Functional Component with Hooks

```tsx
import { useEffect, useRef } from 'react';
import Skeleton from 'smart-skeleton';

function ProductCard({ isLoading, data }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      if (isLoading) {
        Skeleton.apply(cardRef.current, { theme: 'light' });
      } else {
        Skeleton.remove(cardRef.current);
      }
    }
  }, [isLoading]);

  return (
    <div ref={cardRef} className="card">
      <img src={data.image} alt={data.title} />
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

## Custom Hook

Create a reusable hook for skeleton loading:

```tsx
// hooks/useSkeleton.ts
import { useEffect, useRef } from 'react';
import Skeleton, { SkeletonOptions } from 'smart-skeleton';

export function useSkeleton(
  isLoading: boolean,
  options?: SkeletonOptions
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (isLoading) {
        Skeleton.apply(ref.current, options);
      } else {
        Skeleton.remove(ref.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (ref.current && Skeleton.isActive(ref.current)) {
        Skeleton.remove(ref.current);
      }
    };
  }, [isLoading, options]);

  return ref;
}
```

### Using the Custom Hook

```tsx
import { useSkeleton } from './hooks/useSkeleton';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const profileRef = useSkeleton(loading, { 
    theme: 'light',
    randomize: true 
  });

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return (
    <div ref={profileRef} className="profile">
      <img src={user?.avatar} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.bio}</p>
    </div>
  );
}
```

## React Component Wrapper

```tsx
// components/SkeletonWrapper.tsx
import { useEffect, useRef, ReactNode } from 'react';
import Skeleton, { SkeletonOptions } from 'smart-skeleton';

interface SkeletonWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  options?: SkeletonOptions;
  className?: string;
}

export function SkeletonWrapper({ 
  isLoading, 
  children, 
  options,
  className 
}: SkeletonWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (isLoading) {
        Skeleton.apply(containerRef.current, options);
      } else {
        Skeleton.remove(containerRef.current);
      }
    }
  }, [isLoading, options]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
```

### Using SkeletonWrapper

```tsx
import { SkeletonWrapper } from './components/SkeletonWrapper';

function App() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  return (
    <div className="grid">
      {products.map(product => (
        <SkeletonWrapper 
          key={product.id}
          isLoading={loading}
          options={{ theme: 'light', randomize: true }}
        >
          <div className="card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button>Buy Now</button>
          </div>
        </SkeletonWrapper>
      ))}
    </div>
  );
}
```

## With React Query / TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { useSkeleton } from './hooks/useSkeleton';

function ProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const gridRef = useSkeleton(isLoading, { theme: 'light' });

  return (
    <div ref={gridRef} className="product-grid">
      {data?.map(product => (
        <div key={product.id} className="card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

## Multiple Elements

```tsx
function Dashboard() {
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      [statsRef, chartRef, tableRef].forEach(ref => {
        if (ref.current) {
          Skeleton.apply(ref.current, { theme: 'light' });
        }
      });
    } else {
      [statsRef, chartRef, tableRef].forEach(ref => {
        if (ref.current) {
          Skeleton.remove(ref.current);
        }
      });
    }
  }, [loading]);

  return (
    <div className="dashboard">
      <div ref={statsRef} className="stats">
        {/* Stats content */}
      </div>
      <div ref={chartRef} className="chart">
        {/* Chart content */}
      </div>
      <div ref={tableRef} className="table">
        {/* Table content */}
      </div>
    </div>
  );
}
```

## TypeScript Types

```tsx
import type { SkeletonOptions } from 'smart-skeleton';

// Extend with your custom options
interface MySkeletonOptions extends SkeletonOptions {
  customProp?: string;
}
```

## Best Practices

1. **Always cleanup**: Use `useEffect` cleanup function to remove skeletons
2. **Ref check**: Always check if `ref.current` exists before applying skeleton
3. **Dependencies**: Include `isLoading` and `options` in useEffect dependencies
4. **Memoization**: Memoize options object to prevent unnecessary re-renders

```tsx
const skeletonOptions = useMemo(() => ({
  theme: 'light',
  randomize: true
}), []);
```
