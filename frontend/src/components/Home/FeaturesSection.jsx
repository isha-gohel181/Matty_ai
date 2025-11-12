import { motion } from "framer-motion";

import { Dices, Bot, Share2 } from "lucide-react";

import StickyScrollRevealDemo from "@/components/ui/sticky-scroll-reveal-demo";



const features = [

  {

    icon: <Dices size={32} />,

    title: "Drag & Drop Editor",

    description: "Effortlessly design with our intuitive drag-and-drop canvas.",

  },

  {

    icon: <Bot size={32} />,

    title: "AI-Powered Assistance",

    description: "Enhance your designs with AI filters, background removal, and smart suggestions.",

  },

  {

    icon: <Share2 size={32} />,

    title: "Export with Ease",

    description: "Export your creations to PNG, PDF, or SVG with a single click.",

  },

];



const FeaturesSection = () => {

  return (

    <section id="features" className="py-20 sm:py-32">

      <div className="mx-auto max-w-screen-xl px-4">

        <h2 className="text-center text-4xl font-bold text-foreground">Everything You Need to Create</h2>

        <div className="mt-16">

          <StickyScrollRevealDemo />

        </div>

      </div>

    </section>

  );

};

export default FeaturesSection;