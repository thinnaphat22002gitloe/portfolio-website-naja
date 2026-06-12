import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/media';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export function Navbar({ mobileMenuOpen, setMobileMenuOpen, isDarkMode, setIsDarkMode }: NavbarProps) {
  const { logoUrl } = useSiteContent();
  const logoSrc = resolveMediaUrl(logoUrl);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Services', 'Portfolio'];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-2' : 'bg-transparent py-4'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-100" style={{ width: `${scrollProgress}%` }} />

      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo Text Only */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center shrink-0"
        >
          <img src={logoSrc} alt="TMRW UNLIMIT" className="h-8 md:h-12 w-auto object-contain" />
          <span className="ml-2 md:ml-3 text-sm md:text-lg font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
            TMRW UNLIMIT
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contact')}
            className="ml-4 px-4 py-1.5 rounded-full bg-muted border border-border text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Contact Us
          </button>
          {/* Beautiful Dark Mode Toggle Switch */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative w-20 h-10 rounded-full bg-muted border border-border overflow-hidden transition-colors duration-300 hover:border-primary/50"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
              {/* Night Sky Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]" />
              {/* Stars */}
              <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="absolute top-4 left-8 w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute bottom-3 left-5 w-1.5 h-1.5 bg-white rounded-full" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
              <div className="absolute bottom-5 right-4 w-0.5 h-0.5 bg-white rounded-full" />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
              {/* Day Sky Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#bae6fd] via-[#7dd3fc] to-[#38bdf8]" />
              {/* Clouds */}
              <div className="absolute bottom-1 right-2 w-10 h-6 bg-white rounded-full opacity-70" />
              <div className="absolute bottom-2 right-6 w-8 h-5 bg-white rounded-full opacity-80" />
            </div>

            {/* Sliding Circle */}
            <div
              className={`absolute top-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${isDarkMode ? 'left-11 bg-gradient-to-br from-[#f1f5f9] to-[#cbd5e1] shadow-lg' : 'left-1 bg-gradient-to-br from-[#fde68a] to-[#fbbf24] shadow-lg'}`}
            >
              {/* Sun/Moon Icon */}
              {isDarkMode ? (
                <div className="w-full h-full relative">
                  {/* Moon */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e2e8f0] to-[#94a3b8] rounded-full" />
                  {/* Moon Craters */}
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#94a3b8]/40 rounded-full" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#94a3b8]/30 rounded-full" />
                </div>
              ) : (
                <div className="w-full h-full relative">
                  {/* Sun */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fef08a] to-[#facc15] rounded-full" />
                  {/* Sun Rays */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute w-0.5 h-1.5 bg-yellow-400/70 rounded-full" style={{ transform: `rotate(${i * 45}deg) translateY(-6px)` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </button>
        </nav>

        {/* Mobile Nav Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Dark Mode Toggle for Mobile */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative w-16 h-8 rounded-full bg-muted border border-border overflow-hidden transition-colors duration-300"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]" />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#bae6fd] via-[#7dd3fc] to-[#38bdf8]" />
            </div>

            {/* Sliding Circle */}
            <div
              className={`absolute top-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${isDarkMode ? 'left-8 bg-gradient-to-br from-[#f1f5f9] to-[#cbd5e1] shadow-lg' : 'left-0.5 bg-gradient-to-br from-[#fde68a] to-[#facc15] shadow-lg'}`}
            >
              {isDarkMode ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e2e8f0] to-[#94a3b8] rounded-full" />
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fef08a] to-[#facc15] rounded-full" />
                </div>
              )}
            </div>
          </button>
          {/* Mobile Menu Toggle */}
          <button
            className="text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size="24" /> : <Menu size="24" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background md:hidden"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div className="flex items-center">
                <img src={logoSrc} alt="TMRW UNLIMIT" className="h-8 w-auto object-contain" />
                <span className="ml-2 text-sm font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  TMRW UNLIMIT
                </span>
              </div>
              <button
                className="text-foreground p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size="24" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-6 px-6">
              {links.map((link, idx) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => scrollToSection(link)}
                  className="text-4xl font-extrabold text-foreground hover:text-primary transition-colors"
                >
                  {link}
                </motion.button>
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.1 }}
                onClick={() => scrollToSection('contact')}
                className="mt-8 w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground text-2xl font-black shadow-lg"
              >
                Contact Us
              </motion.button>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-12 flex gap-8 text-muted-foreground"
              >
                {/* Social links placeholder if any */}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
