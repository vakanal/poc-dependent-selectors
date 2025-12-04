// Performance Optimizations - Lazy Loading and Code Splitting
import React, { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Lazy loaded components with proper typing
export const LazyMainForm = lazy(() => import('../components/forms/MainForm').then(module => ({ default: module.MainForm })));
export const LazyDependentForm = lazy(() => import('../components/forms/DependentForm').then(module => ({ default: module.DependentForm })));
export const LazyCategorySelect = lazy(() => import('../components/forms/CategorySelect').then(module => ({ default: module.CategorySelect })));
export const LazySubCategorySelect = lazy(() => import('../components/forms/SubCategorySelect').then(module => ({ default: module.SubCategorySelect })));
export const LazyFormActions = lazy(() => import('../components/forms/FormActions').then(module => ({ default: module.FormActions })));

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
): ComponentType<P> {
  return function LazyWrapper(props: P) {
    const fallbackElement = fallback || React.createElement(LoadingSpinner, { message: "Cargando componente..." });
    const componentElement = React.createElement(Component, props);
    
    return React.createElement(Suspense, { fallback: fallbackElement }, componentElement);
  };
}

// Preload utilities
export const preloadComponent = (componentImport: () => Promise<unknown>) => {
  void componentImport();
};

// Preload critical components
export const preloadCriticalComponents = () => {
  preloadComponent(() => import('../components/forms/MainForm'));
  preloadComponent(() => import('../components/forms/CategorySelect'));
};

// Route-based code splitting utilities
export const createLazyRoute = <T extends ComponentType<unknown>>(importFn: () => Promise<{ default: T }>) => {
  return lazy(importFn);
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      options
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, callback, options]);
};