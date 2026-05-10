import { motion } from "framer-motion";

const features = [
  {
    icon: "∞",
    title: "Unlimited Practice Exams",
    description: "Never run out of material. Our engine generates unique, CEFR-aligned practice tests so you can simulate exam day, every day."
  },
  {
    icon: "⏱️",
    title: "10 Minutes a Day",
    description: "Designed for busy applicants. Complete a listening, reading, or writing module during your coffee break."
  },
  {
    icon: "🎯",
    title: "Focused Practice",
    description: "Struggling with \"Ascolto\"? Target specific domains like Public Services or Healthcare without wasting time on what you already know."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-bg-card border border-border rounded-xl p-8 transition-all hover:border-primary hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl mb-6 text-primary">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </section>
  );
}
