import { motion } from 'framer-motion';
import { Rocket, Zap, Brain, TrendingUp, Users, Maximize, type LucideIcon } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Zap,
  Brain,
  TrendingUp,
  Users,
  Maximize,
};

export function About() {
  const { about } = useSiteContent();

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-orange-50 via-background to-purple-50 dark:from-[#1a1030] dark:via-background dark:to-[#0d1020]" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-100 dark:bg-purple-900/30 blur-[80px] rounded-full -translate-x-1/3 -translate-y-1/3 opacity-100 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100 dark:bg-blue-900/30 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4 opacity-100 animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-secondary/30 animate-bounce" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-mono text-sm mb-8 tracking-[0.4em] uppercase font-bold shadow-md">
              {about.sectionLabel}
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-8 leading-[1.05] tracking-tighter">
              Driving Business with<br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic">
                Digital Innovation
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground leading-relaxed font-semibold max-w-xl mx-auto">
              {about.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {about.cards.map((card, idx) => {
              const Icon = iconMap[card.icon] ?? Rocket;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.1)"
                  }}
                  className="p-10 rounded-3xl bg-card dark:bg-card/90 border border-border transition-all duration-500 group shadow-lg cursor-default"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-foreground mb-4 tracking-tight group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-medium transition-opacity">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 p-10 rounded-[2.5rem] bg-card dark:bg-card/90 border-2 border-primary/10 dark:border-primary/20 shadow-2xl"
          >
            {about.stats.map((stat, index) => (
              <div key={stat.label} className="contents">
                {index > 0 && <div className="w-1 h-12 bg-primary/20 hidden md:block" />}
                <div className="text-center group">
                  <h4 className={`text-5xl md:text-6xl font-black mb-3 tracking-tighter group-hover:scale-110 transition-transform ${index === 0 ? 'text-primary' : index === 1 ? 'text-secondary' : 'text-accent'}`}>
                    {stat.value}
                  </h4>
                  <p className="text-foreground text-sm uppercase tracking-[0.35em] font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
