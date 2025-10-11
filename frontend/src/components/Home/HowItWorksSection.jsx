import { motion } from "framer-motion";
import { LayoutTemplate, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: <LayoutTemplate size={32} />,
    title: "1. Select a Template",
    description: "Start with a professionally designed template or a blank canvas to kickstart your project.",
  },
  {
    icon: <Sparkles size={32} />,
    title: "2. Customize with AI",
    description: "Use our intuitive editor and AI-powered tools to bring your unique vision to life effortlessly.",
  },
  {
    icon: <Download size={32} />,
    title: "3. Export & Share",
    description: "Download your final design in high-resolution formats and share it with the world.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-[#1a1a1a]">
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="text-center text-4xl font-bold">Create in 3 Simple Steps</h2>
        <p className="text-center mt-4 text-gray-400">A seamless workflow from idea to masterpiece.</p>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-white/5 p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-teal-500">
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;