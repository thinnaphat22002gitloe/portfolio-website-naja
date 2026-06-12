import { motion } from 'framer-motion';
import { 
  Code2, 
  Layout, 
  Server, 
  Smartphone, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Cpu,
  Globe,
  Zap,
  Layers,
  Search
} from 'lucide-react';

const skillCategories = [
  {
    title: "Frontend Development",
    icon: Layout,
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    gradient: "from-[#6c63ff] to-[#00d4ff]"
  },
  {
    title: "Backend & API",
    icon: Server,
    skills: ["Node.js", "Python", "FastAPI", "RESTful API", "GraphQL"],
    gradient: "from-[#00d4ff] to-[#a855f7]"
  },
  {
    title: "Database & Storage",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Single Source of Truth"],
    gradient: "from-[#a855f7] to-[#ff8c35]"
  },
  {
    title: "IoT & Specialized",
    icon: Cpu,
    skills: ["Asset Management", "Digital Twin", "Real-time Monitoring", "QR Systems", "SCADA Integration"],
    gradient: "from-[#ff8c35] to-[#e8405a]"
  },
  {
    title: "Cloud & DevSecOps",
    icon: Cloud,
    skills: ["AWS", "Docker", "CI/CD", "Security Compliance", "Scalable Infra"],
    gradient: "from-[#e8405a] to-[#6c63ff]"
  },
  {
    title: "UI/UX & Design",
    icon: Search,
    skills: ["Responsive Design", "Data Visualization", "User Research", "Prototyping"],
    gradient: "from-[#6c63ff] to-[#00d4ff]"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="text-center mb-20"
        >
          <div className="text-primary font-mono text-sm mb-4 tracking-widest uppercase font-bold">05 — EXPERTISE</div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">Our Technical Arsenal</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed font-bold">
            เราคัดสรรเทคโนโลยีที่ดีที่สุดเพื่อสร้างโซลูชันที่แข็งแกร่ง ขยายตัวได้ 
            และตอบโจทย์ความต้องการทางวิศวกรรมที่ซับซ้อนของลูกค้า
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2rem] bg-card/80 border border-border hover:border-primary/30 transition-all duration-500 group shadow-sm hover:shadow-xl backdrop-blur-md"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} p-0.5 mb-8 group-hover:rotate-6 transition-transform duration-500 shadow-sm`}>
                <div className="w-full h-full rounded-[0.9rem] bg-card flex items-center justify-center text-primary">
                  <category.icon size={28} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-6 tracking-tight group-hover:text-primary transition-colors">{category.title}</h3>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIdx) => (
                  <span 
                    key={sIdx}
                    className="px-3 py-1.5 rounded-lg bg-muted border border-border text-muted-foreground text-xs font-semibold hover:border-primary/30 hover:text-foreground transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating tech stack labels for visual interest */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
        >
          <div className="flex items-center gap-2 text-white font-mono text-sm tracking-tighter">
            <Zap size={16} className="text-[#6c63ff]" /> HIGH PERFORMANCE
          </div>
          <div className="flex items-center gap-2 text-white font-mono text-sm tracking-tighter">
            <Layers size={16} className="text-[#00d4ff]" /> SCALABLE ARCHITECTURE
          </div>
          <div className="flex items-center gap-2 text-white font-mono text-sm tracking-tighter">
            <ShieldCheck size={16} className="text-[#ff8c35]" /> SECURE BY DESIGN
          </div>
        </motion.div>
      </div>
    </section>
  );
}
