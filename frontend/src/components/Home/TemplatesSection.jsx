import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const TemplatesSection = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const response = await api.get("/api/v1/templates");
                // Get first 4 templates to display
                const limitedTemplates = response.data.templates.slice(0, 4);
                setTemplates(limitedTemplates);
            } catch (err) {
                console.error("Error fetching templates:", err);
                setError("Failed to load templates");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Fallback gradient colors if needed
    const gradientColors = [
        "from-pink-500 to-orange-400",
        "from-blue-500 to-indigo-600",
        "from-red-500 to-yellow-500",
        "from-gray-700 to-gray-900",
    ];

    const handleTemplateClick = (templateId) => {
        navigate(`/dashboard/editor?template=${templateId}`);
    };

    return (
        <section id="templates" className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-center text-4xl font-bold text-foreground">Kickstart Your Creativity</h2>
                <p className="text-center mt-4 text-muted-foreground">Explore templates for every need.</p>

                {loading && (
                    <div className="flex justify-center items-center mt-16 h-64">
                        <Loader className="animate-spin w-8 h-8 text-primary" />
                    </div>
                )}

                {error && (
                    <div className="text-center mt-16 text-red-500">
                        {error}
                    </div>
                )}

                {!loading && templates.length > 0 && (
                    <>
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {templates.map((template, index) => (
                                <motion.div
                                    key={template._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -4 }}
                                    onClick={() => handleTemplateClick(template._id)}
                                    className="relative aspect-3/4 overflow-hidden rounded-xl group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={template.thumbnailUrl?.secure_url}
                                            alt={template.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Subtle Overlay */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                                    </div>

                                    {/* Clean Content */}
                                    <div className="relative h-full flex flex-col justify-end p-6">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-white group-hover:text-xl transition-all duration-300">
                                                {template.title}
                                            </h3>
                                            <p className="text-sm text-gray-200/80 font-medium">
                                                {template.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Minimal Hover Indicator */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={() => navigate('/dashboard/templates')}
                                variant="outline"
                                size="lg"
                                className="group relative overflow-hidden border border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/8 backdrop-blur-md text-white hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 py-4 font-medium hover:scale-[1.02]"
                            >
                                {/* Subtle white highlight */}
                                <div className="absolute inset-0 bg-white/3 group-hover:bg-white/5 transition-all duration-300 rounded-full" />

                                {/* Button content */}
                                <div className="relative flex items-center space-x-3">
                                    <span className="text-lg tracking-wide">Explore More Templates</span>
                                    <div className="relative">
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Minimal border accent */}
                                <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-white/20 transition-all duration-300" />
                            </Button>
                        </motion.div>
                    </>
                )}

                {!loading && templates.length === 0 && !error && (
                    <div className="text-center mt-16 text-muted-foreground">
                        No templates available yet.
                    </div>
                )}
            </div>
        </section>
    );
};

export default TemplatesSection;