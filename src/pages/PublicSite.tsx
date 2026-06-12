import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Skills } from '@/components/sections/Skills';
import { Portfolio } from '@/components/sections/Portfolio';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { SiteContentContext } from '@/context/SiteContentContext';
import { fetchSiteContent } from '@/lib/api';
import type { Project } from '@/types/content';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2 } from 'lucide-react';

export function PublicSite() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollPositionRef = useRef(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: siteContent, isLoading, isError, error } = useQuery({
    queryKey: ['siteContent'],
    queryFn: fetchSiteContent,
  });

  useEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    localStorage.removeItem('darkMode');
    document.documentElement.classList.remove('dark');

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!selectedProject) {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen, selectedProject]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading TMRW UNLIMIT...</p>
        </div>
      </div>
    );
  }

  if (isError || !siteContent) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Unable to load site content</h1>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Please make sure the backend API is running on port 8000.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SiteContentContext.Provider value={siteContent}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
          <CustomCursor />
          <AnimatedBackground />

          <div className="relative z-10">
            {!selectedProject && (
              <Navbar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            )}

            <main>
              <Hero />
              <About />
              <Services />
              <Skills />
              <Portfolio selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
              <Contact />
            </main>

            {!selectedProject && <Footer />}
          </div>

          <AnimatePresence>
            {showScrollTop && !selectedProject && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-[100] p-4 rounded-2xl bg-gradient-to-r from-[#ff8c35] to-[#e8405a] text-white shadow-[0_10px_30px_rgba(255,140,53,0.3)] hover:scale-110 active:scale-95 transition-transform hidden md:flex"
              >
                <ArrowUp size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showScrollTop && !selectedProject && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-[100] p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white md:hidden"
              >
                <ArrowUp size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <Toaster />
      </TooltipProvider>
    </SiteContentContext.Provider>
  );
}
