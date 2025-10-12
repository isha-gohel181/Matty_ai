import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center text-center pt-16">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-background" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container flex max-w-4xl flex-col items-center gap-6"
      >
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl text-foreground">
          One Tool, Infinite Creativity.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
          Matty is your AI-powered design partner for creating stunning posters,
          banners, and social media graphics in minutes.
        </p>
        <div>
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-purple-500 to-teal-500 px-8 py-6 text-lg text-white hover:opacity-90 transition"
            onClick={() => navigate('/signup')}
          >
            Start Designing for Free
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;