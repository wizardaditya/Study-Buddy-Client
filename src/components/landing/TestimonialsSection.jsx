import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const testimonials = [
  {
    name: "Arjun Sharma",
    role: "Robotics Engineer @ Ather Energy",
    city: "Bangalore",
    text: "Aura AI helped me crack my ROS interview. It remembered every topic I struggled with and quizzed me until I nailed it. Got placed in 2 months.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "IoT Developer @ Bosch",
    city: "Pune",
    text: "The mentor sessions are gold. My mentor from TI literally reviewed my circuit designs and told me exactly what industry expects. Worth every rupee.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "ML Engineer @ Swiggy",
    city: "Hyderabad",
    text: "Coming from a Tier 3 city, I had no access to good guidance. Study Buddy changed that. The doubts forum and mock tests gave me the confidence to compete.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "AI Research Intern @ IISc",
    city: "Ahmedabad",
    text: "The study rooms feature is underrated. I found a group of 5 people building a similar project, and we ended up collaborating on it. This platform builds community.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Embedded Systems @ ISRO",
    city: "Jaipur",
    text: "150-day streak, Level 12, 3 certifications. The gamification actually works — I've never been this consistent with learning in my life.",
    rating: 5,
  },
  {
    name: "Ananya Krishnan",
    role: "Computer Vision @ Ola",
    city: "Chennai",
    text: "The CV mock tests are insanely good. The questions are actually from real interviews. Aura AI explained every concept I got wrong in detail.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Built for <span className="gradient-text">real builders</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Students from across India landing their dream roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(t.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-xs text-purple-400">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
