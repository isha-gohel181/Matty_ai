import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";

// Lazy load GradientBlinds with error boundary
const GradientBlinds = lazy(() => 
  import('@/components/GradientBlinds').catch(err => {
    console.error('Failed to load GradientBlinds:', err);
    return { default: () => null };
  })
);

const AuthPageLayout = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center text-center overflow-hidden bg-black">
      {/* Gradient Blinds Background - Fixed positioning and sizing */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full pointer-events-auto" style={{ zIndex: 0 }}>
        <Suspense fallback={<div className="w-full h-full bg-purple-900/10" />}>
          <GradientBlinds
            gradientColors={['#FF9FFC', '#5227FF', '#00F5FF', '#9945FF']}
            angle={45}
            noise={0.3}
            blindCount={16}
            blindMinWidth={60}
            mouseDampening={0.15}
            mirrorGradient={false}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={1}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
            className="w-full h-full"
          />
        </Suspense>
      </div>
      
      {/* Dark overlay for readability - pointer-events-none allows mouse to pass through */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-black/50 pointer-events-none" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative w-full max-w-md mx-auto px-4" style={{ zIndex: 10 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPageLayout;