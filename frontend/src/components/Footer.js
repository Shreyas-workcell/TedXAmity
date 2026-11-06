import { motion } from 'framer-motion';
import { Instagram, Linkedin, Youtube, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black py-20 px-6 lg:px-12 overflow-hidden">
      <div className="hero-particles opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-red/10 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              <span className="text-brand-red font-black">TEDx</span>
              <span className="text-white font-medium">Amity</span>
            </h3>
            <p className="text-white/60 font-sans text-sm leading-relaxed">
              Ideas worth spreading. Join us in our mission to inspire and empower through transformative conversations.
            </p>
          </div>

          <div>
            <h4 className="text-white font-sans font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Events', 'Speakers', 'Team'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-white/60 hover:text-brand-red font-sans text-sm transition-colors"
                    data-testid={`footer-link-${link.toLowerCase()}`}
                  >
                    {link}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/admin"
                  className="text-white/60 hover:text-brand-red font-sans text-sm transition-colors"
                  data-testid="footer-link-admin"
                >
                  Admin
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-sans font-bold mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-brand-red mt-1" />
                <a href="mailto:tedx@amity.edu" className="text-white/60 hover:text-brand-red font-sans text-sm transition-colors">
                  tedx@amity.edu
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-red mt-1" />
                <p className="text-white/60 font-sans text-sm">
                  Amity University Bengaluru<br />
                  Karnataka, India
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-sans font-bold mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
            <div className="flex space-x-4">
              {[
                { Icon: Instagram, link: '#', testId: 'footer-instagram' },
                { Icon: Linkedin, link: '#', testId: 'footer-linkedin' },
                { Icon: Youtube, link: '#', testId: 'footer-youtube' }
              ].map(({ Icon, link, testId }) => (
                <a
                  key={testId}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center transition-all duration-300 group"
                  data-testid={testId}
                >
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/40 font-sans text-sm">
              © {currentYear} TEDxAmityUniversityBengaluru. All rights reserved.
            </p>
            <p className="text-white/40 font-sans text-xs">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mt-12"
        >
          <h2 className="font-display font-black text-6xl lg:text-9xl text-white/5">
            TEDx
          </h2>
        </motion.div>
      </div>
    </footer>
  );
};