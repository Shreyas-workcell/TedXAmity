import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => scrollToSection('hero')} 
            className="tedx-wordmark tedx-wordmark-nav"
            data-testid="logo-button"
          >
            <span className="tedx-wordmark-mark">
              TED<span className="tedx-wordmark-x">x</span>
            </span>
            <span className="tedx-wordmark-name tedx-wordmark-name-compact"> Amity University Bengaluru</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {['home', 'about', 'events', 'speakers', 'team'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="nav-link text-sm font-sans font-medium text-white/80 hover:text-white capitalize"
                data-testid={`nav-${item}`}
              >
                {item === 'home' ? 'Home' : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            <a
              href="/recruitment"
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-full text-sm font-sans font-bold text-black transition-all duration-300 hover:scale-105"
              data-testid="nav-recruitment-btn"
            >
              Recruitment
            </a>
            <a
              href="/register"
              className="bg-brand-red hover:bg-brand-ember px-6 py-2 rounded-full text-sm font-sans font-bold text-white transition-all duration-300 hover:scale-105"
              data-testid="nav-register-btn"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
