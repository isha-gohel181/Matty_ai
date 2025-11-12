import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { selectIsAuthenticated } from '@/redux/slice/user/user.slice.js';

// Lazy load GradientBlinds with error boundary
const GradientBlinds = lazy(() => 
  import('@/components/GradientBlinds').catch(err => {
    console.error('Failed to load GradientBlinds:', err);
    return { default: () => null };
  })
);

const HeroSection = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <section className="relative flex min-h-screen items-center justify-center text-center pt-16 overflow-hidden">
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container flex max-w-4xl flex-col items-center gap-6 relative pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl text-foreground">
          One Tool, Infinite Creativity.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
          Matty is your AI-powered design partner for creating stunning posters,
          banners, and social media graphics in minutes.
        </p>
        <div className="pointer-events-auto">
          <Button
            size="lg"
            className="rounded-full bg-white text-black px-8 py-6 text-lg font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            onClick={() => navigate(isAuthenticated ? '/dashboard/editor' : '/signup')}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Designing for Free'}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;