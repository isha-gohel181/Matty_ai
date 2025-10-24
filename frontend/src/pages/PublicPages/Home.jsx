import React from 'react';

import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import TemplatesSection from "@/components/Home/TemplatesSection";
import PricingSection from "@/components/Home/PricingSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import CallToAction from "@/components/Home/CallToAction";

const Home = () => {
  return (
    <div className="bg-background text-foreground">
        <main>
            <HeroSection /> 
            <FeaturesSection />
            <HowItWorksSection />
            <TemplatesSection />
            <PricingSection />
            <TestimonialsSection />
            <CallToAction />
        </main>
    </div>
  );
};

export default Home;