import { motion } from "framer-motion";

const templates = [
    { name: "Instagram Posts", color: "from-pink-500 to-orange-400" },
    { name: "Event Posters", color: "from-blue-500 to-indigo-600" },
    { name: "YouTube Banners", color: "from-red-500 to-yellow-500" },
    { name: "Business Cards", color: "from-gray-700 to-gray-900" },
];

const TemplatesSection = () => {
    return (
        <section id="templates" className="py-20 sm:py-32">
            <div className="mx-auto max-w-screen-xl px-4">
                <h2 className="text-center text-4xl font-bold text-foreground">Kickstart Your Creativity</h2>
                <p className="text-center mt-4 text-muted-foreground">Explore templates for every need.</p>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {templates.map((template, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className={`relative aspect-[3/4] overflow-hidden rounded-xl group`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${template.color}`} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="relative h-full flex items-end p-6">
                                <h3 className="text-2xl font-semibold text-white">{template.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TemplatesSection;