import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-background to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm text-purple-400 mb-6"
        >
          <Star className="h-3.5 w-3.5 fill-current" />
          India's First Robotics · IoT · AI Learning Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black leading-tight mb-6"
        >
          Learn. Build.{" "}
          <span className="gradient-text">Get Hired.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Study Buddy is your AI-powered companion for mastering Robotics, IoT & AI.
          Join thousands of Indian students building the future — from Tier 1 to Tier 3 cities.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button asChild variant="gradient" size="lg" className="text-base px-8 h-12">
            <Link to={ROUTES.REGISTER}>
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8 h-12">
            <Link to={ROUTES.PRICING}>
              View Plans
            </Link>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {[
            { label: "Students", value: "10,000+" },
            { label: "Mentors", value: "200+" },
            { label: "Doubts Solved", value: "50,000+" },
            { label: "Cities", value: "500+" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-black gradient-text">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Aura AI preview chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 inline-flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 shadow-xl"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center animate-pulse-glow">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Aura AI says</p>
            <p className="text-sm font-medium">"How can I help you learn today?" ✨</p>
          </div>
          <Zap className="h-4 w-4 text-purple-400 ml-2" />
        </motion.div>
      </div>
    </section>
  );
}
