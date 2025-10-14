import { motion } from "framer-motion";

import { Dices, Bot, Share2 } from "lucide-react";



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

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">

          {features.map((feature, index) => (

            <motion.div

              key={index}

              initial={{ opacity: 0, y: 50 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true, amount: 0.5 }}

              transition={{ delay: index * 0.2, duration: 0.5 }}

              className="rounded-xl border border-border bg-card/50 p-8 text-center"

            >

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-teal-500">

                {feature.icon}

              </div>

              <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>

              <p className="mt-2 text-muted-foreground">{feature.description}</p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>

  );

};



export default FeaturesSection;