import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RouterProvider, useRouter } from './utils/router.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { LeftPage } from './pages/LeftPage.tsx';
import { RightPage } from './pages/RightPage.tsx';

function RouteRenderer() {
  const { pathname } = useRouter();

  return (
    <AnimatePresence mode="wait">
      {pathname === '/left' ? (
        <motion.div
          key="left-route"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <LeftPage />
        </motion.div>
      ) : pathname === '/right' ? (
        <motion.div
          key="right-route"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <RightPage />
        </motion.div>
      ) : (
        <motion.div
          key="landing-route"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <LandingPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <RouteRenderer />
    </RouterProvider>
  );
}
