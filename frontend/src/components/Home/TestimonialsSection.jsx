import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";

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
  {
    quote: "I've tried many design tools, but Matty stands out with its simplicity and powerful features. Highly recommend!",
    name: "Michael Rodriguez",
    title: "Content Creator",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    quote: "The export options are fantastic. I can get exactly what I need for print or digital with perfect quality every time.",
    name: "Emily Watson",
    title: "Brand Strategist",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote: "Matty saves me hours every week. The templates and AI suggestions help me create professional designs in minutes.",
    name: "James Anderson",
    title: "Social Media Manager",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
];

const TestimonialCard = ({ quote, name, title, avatar }) => {
  return (
    <div className="relative w-80 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 p-6 flex flex-col shadow-lg">
      <p className="text-gray-300 text-sm grow mb-4 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-xs text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-4xl font-bold text-foreground">Loved by Creators Worldwide</h2>
        <p className="text-center mt-4 text-muted-foreground mb-12">See what our users are saying about Matty.</p>
        
        <div className="relative flex flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s] mt-4">
            {secondRow.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </Marquee>
          
          {/* Gradient overlays - blend with black background */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-black to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-black to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;