import { motion } from 'framer-motion';

export const Sponsors = () => {
  return (
    <section id="sponsors" className="py-32 px-6 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-overline mb-6"
        >
          Sponsors
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-bold text-4xl lg:text-6xl text-white mb-12 tracking-tighter"
        >
          Our Partners
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-20"
        >
          <p className="font-display text-3xl text-white/40 italic animate-pulse-glow">
            Coming Soon
          </p>
          <p className="text-white/30 font-sans mt-4">
            Interested in partnering with us? Get in touch.
          </p>
        </motion.div>
      </div>
    </section>
  );
};