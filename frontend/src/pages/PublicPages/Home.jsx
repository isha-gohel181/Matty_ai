import React from 'react';

import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import PricingSection from "@/components/Home/PricingSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import CallToAction from "@/components/Home/CallToAction";

const Home = () => {
  return (
    <div className="bg-black text-foreground">
        <main className="bg-black">
            <HeroSection /> 
            <FeaturesSection />
            <HowItWorksSection />
            <PricingSection />
            <TestimonialsSection />
            <CallToAction />
        </main>
    </div>
  );
};

export default Home;