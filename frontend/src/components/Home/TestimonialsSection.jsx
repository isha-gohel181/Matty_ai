import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Matty has completely transformed how I create social media content. The AI tools are a game-changer!",
    name: "Jessica Miller",
    title: "Marketing Manager",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    quote: "As a small business owner, I don't have time to learn complex software. Matty is intuitive, fast, and the results are professional.",
    name: "David Chen",
    title: "Founder of The Coffee Spot",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    quote: "The best part is the template library. I can find a starting point for any project and have a stunning design ready in minutes.",
    name: "Sarah Jones",
    title: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];


const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-20 sm:py-32 bg-muted/20">
            <div className="mx-auto max-w-screen-xl px-4">
                <h2 className="text-center text-4xl font-bold text-foreground">Loved by Creators Worldwide</h2>
                <p className="text-center mt-4 text-muted-foreground">See what our users are saying about Matty.</p>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="rounded-xl border border-border bg-card/50 p-8 flex flex-col"
                        >
                            <p className="text-muted-foreground flex-grow">"{testimonial.quote}"</p>
                            <div className="mt-6 flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;