import React, { createContext, useContext, useEffect, useState } from 'react';
import type { RoutePath } from '../types.ts';

interface RouterContextType {
  pathname: RoutePath;
  push: (url: RoutePath) => void;
  replace: (url: RoutePath) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function normalizePath(rawPath: string): RoutePath {
  if (rawPath.startsWith('/left')) return '/left';
  if (rawPath.startsWith('/right')) return '/right';
  return '/';
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<RoutePath>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = (url: RoutePath) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', url);
    }
    setPathname(url);
  };

  const replace = (url: RoutePath) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', url);
    }
    setPathname(url);
  };

  const back = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <RouterContext.Provider value={{ pathname, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
