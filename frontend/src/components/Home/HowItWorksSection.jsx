import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutTemplate, Sparkles, Download } from "lucide-react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

const steps = [
  {
    icon: <LayoutTemplate size={32} />,
    title: "Select a Template",
    description: "Choose from professionally designed templates or start with a blank canvas to kickstart your project.",
    colors: [[125, 211, 252]], // Sky blue
    containerClassName: "bg-black",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Customize with AI",
    description: "Use our intuitive editor and AI-powered tools to bring your unique vision to life effortlessly.",
    colors: [[236, 72, 153], [232, 121, 249]], // Pink to purple gradient
    containerClassName: "bg-black",
  },
  {
    icon: <Download size={32} />,
    title: "Export & Share",
    description: "Download your final design in high-resolution formats and share it with the world.",
    colors: [[34, 197, 94]], // Green
    containerClassName: "bg-black",
  },
];

const Card = ({ title, icon, children, description }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/20 group/canvas-card flex items-center justify-center dark:border-white/20 max-w-xs w-full mx-auto p-3 relative h-80"
    >
      <div className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </div>
      <div className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </div>
      <div className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </div>
      <div className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 text-center">
        <div className="group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
        <p className="dark:text-white/80 text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black/80 mt-2 group-hover/canvas-card:text-white/80 group-hover/canvas-card:-translate-y-2 transition duration-200">
          {description}
        </p>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Create in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning designs with our intuitive workflow
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-4">
          {steps.map((step, index) => (
            <Card 
              key={index}
              title={step.title} 
              icon={step.icon}
              description={step.description}
            >
              <CanvasRevealEffect
                animationSpeed={1.5}
                containerClassName={step.containerClassName}
                colors={step.colors}
                dotSize={2.5}
                opacities={[0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.65]}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;