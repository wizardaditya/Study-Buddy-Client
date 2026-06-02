import { motion } from "framer-motion";
import { Bot, Users, Video, ClipboardList, Trophy, Briefcase, MessageSquare, Flame } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Aura AI",
    description: "Your personal AI study companion with memory. It remembers your learning history, struggles, and achievements to give hyper-personalized help.",
    color: "from-purple-600 to-blue-600",
    badge: "Powered by GPT-4o",
  },
  {
    icon: Users,
    title: "Mentor System",
    description: "Book 1-on-1 sessions with verified industry experts in Robotics, IoT & AI. Real guidance from people who've built real things.",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Video,
    title: "Study Rooms",
    description: "Live collaborative video rooms powered by WebRTC. Study together, build projects together, grow together.",
    color: "from-green-600 to-teal-600",
  },
  {
    icon: ClipboardList,
    title: "Mock Tests",
    description: "Topic-wise tests for Robotics, IoT & AI with detailed analytics. Know exactly where you stand before interviews.",
    color: "from-orange-600 to-red-600",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn XP, maintain streaks, unlock badges. Learning is more fun when there's a game to win.",
    color: "from-yellow-600 to-orange-600",
  },
  {
    icon: Briefcase,
    title: "Hiring Board",
    description: "Companies actively looking for Robotics, IoT & AI talent post here. Get placed directly from the platform.",
    color: "from-pink-600 to-rose-600",
  },
  {
    icon: MessageSquare,
    title: "Doubts Forum",
    description: "Ask questions, get community answers, accept the best solution. Stack Overflow — but for Indian tech builders.",
    color: "from-indigo-600 to-purple-600",
  },
  {
    icon: Flame,
    title: "Streak System",
    description: "Build a daily learning habit with streaks, XP bonuses, and leaderboard rankings. Consistency is the secret weapon.",
    color: "from-red-600 to-orange-600",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything you need to{" "}
            <span className="gradient-text">master the future</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built specifically for Robotics, IoT & AI students. No generic content — everything here is for builders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-base mb-2">{feature.title}</h3>
                {feature.badge && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                    {feature.badge}
                  </span>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
