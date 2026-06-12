import { motion } from 'framer-motion';
import { Typewriter } from '@/components/Typewriter';
import { useSiteContent } from '@/context/SiteContentContext';

export function Hero() {
  const { hero } = useSiteContent();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-[0.25em] uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              {hero.badge}
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.05] md:leading-[0.95]">
            {hero.headline}
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic px-3 sm:px-6">
              <Typewriter words={hero.typewriterWords} />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-medium">
            {hero.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToContact}
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-base sm:text-lg hover:bg-primary/90 transition-all shadow-lg"
            >
              {hero.ctaPrimary}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -3, backgroundColor: "var(--elevate-1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToServices}
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-muted border border-border text-foreground font-semibold text-base sm:text-lg backdrop-blur-md transition-all shadow-md"
            >
              {hero.ctaSecondary}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
