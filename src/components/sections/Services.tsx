import { motion } from 'framer-motion';
import { useSiteContent } from '@/context/SiteContentContext';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function Services() {
  const { services } = useSiteContent();

  return (
    <section id="services" className="py-28 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mb-20 text-center"
        >
          <div className="text-secondary font-mono text-sm mb-6 tracking-[0.4em] uppercase font-bold">{services.sectionLabel}</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-8">{services.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            {services.description}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.items.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                backgroundColor: "var(--elevate-2)",
                borderColor: "rgba(var(--secondary), 0.3)"
              }}
              className="p-8 rounded-3xl bg-card/80 border border-border transition-all duration-500 group relative overflow-hidden backdrop-blur-md shadow-lg"
            >
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="text-5xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors duration-500 font-mono">{service.id}</div>
              <h3 className="text-xl font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors duration-500 tracking-tight">{service.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">{service.description}</p>

              <motion.div
                className="mt-8 w-12 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
