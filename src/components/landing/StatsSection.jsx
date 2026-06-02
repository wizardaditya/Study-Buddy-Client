import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Active Students", sub: "From 500+ cities across India" },
  { value: "200+", label: "Verified Mentors", sub: "Industry professionals" },
  { value: "50,000+", label: "Doubts Solved", sub: "Community-powered answers" },
  { value: "95%", label: "Placement Rate", sub: "Elite plan students" },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-950/30 to-blue-950/30 border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-black gradient-text mb-1">{stat.value}</p>
              <p className="font-semibold text-base mb-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
