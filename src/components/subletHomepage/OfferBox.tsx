import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function OfferBox() {
  return (
    <section className="py-16 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto bg-gradient-to-b from-bg-card to-bg-card/50 border border-border rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        
        <h2 className="text-3xl font-bold text-white mb-2">Join the Founders Circle</h2>
        <p className="text-slate-400 mb-8">Secure legacy pricing before the public launch.</p>

        <div className="text-6xl font-extrabold text-white mb-2">
          €299<span className="text-base font-normal text-slate-400">/yr</span>
        </div>
        <p className="text-slate-400 mb-10">
          Standard Price: <span className="line-through">€399/yr</span>
        </p>

        <ul className="text-left max-w-[320px] mx-auto mb-10 space-y-4 text-slate-200">
          <li className="flex items-center gap-3">
            <Check className="text-emerald-500 w-5 h-5 flex-shrink-0" />
            <span><strong>Lifetime Price Lock</strong> (Never increases)</span>
          </li>
          <li className="flex items-center gap-3">
            <Check className="text-emerald-500 w-5 h-5 flex-shrink-0" />
            <span><strong>Unlimited</strong> Practice Exams</span>
          </li>
          <li className="flex items-center gap-3">
            <Check className="text-emerald-500 w-5 h-5 flex-shrink-0" />
            <span><strong>Priority Support</strong> from founders</span>
          </li>
        </ul>

        <a 
          href="https://forms.gle/n1SxkLZm8ZxAj3VT9" 
          className="block w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-lg font-bold text-lg transition-all"
        >
          Secure My Spot
        </a>
        <p className="text-xs text-slate-500 mt-4">
          Only 87 spots remaining for this cohort.
        </p>
      </motion.div>
    </section>
  );
}
