import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Sparkles, ShieldCheck, Gauge } from 'lucide-react';
import { Typewriter } from '@/components/Typewriter';
import { TechMarquee } from '@/components/fx/TechMarquee';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/media';

export function Hero() {
  const { hero, portfolio } = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  const showcase = useMemo(
    () => portfolio.projects.filter((p) => p.coverImage || p.images[0]).slice(0, 3),
    [portfolio.projects],
  );
  const techs = useMemo(() => {
    const set = new Set<string>();
    portfolio.projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 24);
  }, [portfolio.projects]);

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
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-transparent">
      {/* Decorative graphics */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-grid" />
      <motion.div aria-hidden style={{ y: yBack }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[38%] h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 animate-spin-slow">
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
        </div>
        <div className="absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-secondary/20 animate-spin-slow [animation-direction:reverse]">
          <span className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 rounded-full bg-secondary" />
        </div>
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-[90px]" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
      </motion.div>

      {/* Floating chips (desktop) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute left-[7%] top-[30%] animate-float flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-xl backdrop-blur-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><Gauge size={18} /></span>
          <div className="text-left"><p className="text-xs text-muted-foreground">Lighthouse</p><p className="text-sm font-bold">98 Performance</p></div>
        </div>
        <div className="absolute right-[7%] top-[24%] animate-float-slow flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-xl backdrop-blur-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500"><ShieldCheck size={18} /></span>
          <div className="text-left"><p className="text-xs text-muted-foreground">Secure by design</p><p className="text-sm font-bold">JWT · RBAC</p></div>
        </div>
        <div className="absolute right-[12%] top-[58%] animate-float flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 shadow-xl backdrop-blur-md [animation-delay:1.5s]">
          <Sparkles size={16} className="text-accent" /><span className="text-sm font-semibold">AI-ready</span>
        </div>
      </div>

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

        {showcase.length > 0 && (
          <motion.div
            style={{ y: yFront }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-16 hidden h-[260px] max-w-5xl sm:block"
          >
            {showcase.map((project, idx) => {
              const pos = [
                'left-1/2 -translate-x-1/2 z-20 w-[56%]',
                'left-[2%] top-10 z-10 w-[42%] -rotate-6',
                'right-[2%] top-10 z-10 w-[42%] rotate-6',
              ][idx];
              return (
                <motion.button
                  key={project.id}
                  type="button"
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`absolute ${pos} overflow-hidden rounded-2xl border border-border bg-card shadow-2xl`}
                  aria-label={`See ${project.title}`}
                >
                  <div className="flex items-center gap-1.5 border-b border-border bg-muted/70 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2 truncate text-[11px] text-muted-foreground">{project.title}</span>
                  </div>
                  <img
                    src={resolveMediaUrl(project.coverImage || project.images[0])}
                    alt={project.title}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                </motion.button>
              );
            })}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        )}
      </div>

      {techs.length > 0 && (
        <div className="relative z-10 mt-10 w-full">
          <TechMarquee items={techs} />
        </div>
      )}
    </section>
  );
}
