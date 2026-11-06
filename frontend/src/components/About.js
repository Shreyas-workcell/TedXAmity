import { motion } from 'framer-motion';

export const About = () => {
  return (
    <section id="about" className="py-32 px-6 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-overline mb-6"
        >
          About TEDx
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display font-bold text-4xl lg:text-6xl text-white mb-8 tracking-tighter leading-tight">
              What is{' '}
              <span className="text-brand-red">TEDx</span>?
            </h2>

            <div className="space-y-6 text-white/70 font-sans leading-relaxed text-base lg:text-lg">
              <p>
                In the spirit of ideas worth spreading, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience.
              </p>
              <p>
                At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where x = independently organized TED event.
              </p>
              <p>
                <span className="text-brand-red font-bold">TEDxAmityUniversityBengaluru</span> is a platform where students, faculty, and thought leaders come together to share transformative ideas that challenge perspectives and inspire action.
              </p>
              <p className="text-white/90 font-medium">
                Our mission is to cultivate a community of innovators, dreamers, and changemakers who believe in the power of ideas to shape the future.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-red/20 blur-3xl rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1568407645630-fc5e8a90f12e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwzfHxjaW5lbWF0aWMlMjBkYXJrJTIwc3RhZ2UlMjBsaWdodGluZyUyMHJlZHxlbnwwfHx8fDE3NzQ0MjMyODJ8MA&ixlib=rb-4.1.0&q=85"
              alt="TEDx Stage"
              className="relative rounded-lg shadow-2xl w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};