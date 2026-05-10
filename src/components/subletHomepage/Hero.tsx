import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="py-20 text-center max-w-4xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-block bg-orange-500/15 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange-500/30"
      >
        ⚠️ Founders Circle: Limited to 100 Users
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
      >
        Don't just study for the CILS B1 Exam. <span className="text-primary">Take it every day.</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
      >
        We prepare you for the test by allowing you to <em className="italic">take</em> the test. 
        Unlimited CEFR-aligned practice exams that fit into your busy schedule. 
        Ready in as little as 10 minutes a day.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <a 
          href="https://forms.gle/n1SxkLZm8ZxAj3VT9" 
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30"
        >
          Start Practice Exams
        </a>
        <a 
          href="#features" 
          className="w-full sm:w-auto bg-transparent border border-border text-slate-400 hover:border-white hover:text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
        >
          How it works
        </a>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm mt-6 text-slate-500"
      >
        No credit card required to apply. 4-6 week waitlist.
      </motion.p>
    </section>
  );
}
