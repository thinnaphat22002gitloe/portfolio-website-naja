import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, X } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/media';
import type { Project } from '@/types/content';

interface PortfolioProps {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export function Portfolio({ selectedProject, setSelectedProject }: PortfolioProps) {
  const { portfolio } = useSiteContent();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'portfolio-modal-portal';
    document.body.appendChild(div);
    portalRef.current = div;

    return () => {
      portalRef.current?.remove();
    };
  }, []);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImgIdx(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const nextImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedProject) {
      setCurrentImgIdx((prev) => (prev + 1) % selectedProject.imageCount);
    }
  };

  const prevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedProject) {
      setCurrentImgIdx((prev) => (prev - 1 + selectedProject.imageCount) % selectedProject.imageCount);
    }
  };

  const getImageSrc = (project: Project, offset: number) => {
    if (project.images.length > 0) {
      return resolveMediaUrl(project.images[offset] ?? project.coverImage);
    }
    return resolveMediaUrl(project.coverImage);
  };

  return (
    <section id="portfolio" className="py-28 bg-transparent relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
        >
          <div>
            <div className="text-accent font-mono text-sm mb-4 tracking-[0.4em] uppercase font-bold">{portfolio.sectionLabel}</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">{portfolio.title}</h2>
          </div>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            {portfolio.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {portfolio.projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              onClick={() => openProject(project)}
              className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer border border-border shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-muted transition-transform duration-700 group-hover:scale-105">
                <img
                  src={resolveMediaUrl(project.coverImage || getImageSrc(project, 0))}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-contain opacity-60 group-hover:opacity-80 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

                <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border text-sm font-bold text-foreground shadow-lg">
                  {project.category}
                </div>

                <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                  <ArrowRight size={24} />
                </div>

                <span className="absolute bottom-8 left-8 text-7xl font-black text-foreground/30 dark:text-white/20 group-hover:text-primary/30 dark:group-hover:text-primary/40 transition-colors">
                  {project.id}
                </span>
              </div>

              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <motion.h3 className="text-3xl font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {project.title}
                </motion.h3>
                <p className="text-muted-foreground text-base max-w-sm line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {portalRef.current && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl"
                onClick={closeProject}
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-6 pointer-events-none"
              >
                <div className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row pointer-events-auto">
                  <div className="relative w-full lg:w-3/5 h-[40vh] lg:h-auto bg-muted group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImgIdx}
                        src={getImageSrc(selectedProject, currentImgIdx)}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-contain"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={prevImg} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={nextImg} className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <ArrowRight size={18} />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-md border border-border">
                      {Array.from({ length: selectedProject.imageCount }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImgIdx(idx)}
                          className={`h-1 transition-all duration-300 rounded-full ${
                            idx === currentImgIdx ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:w-2/5 flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10 flex flex-col bg-card">
                    <div className="flex justify-between items-start mb-8">
                      <div className="px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-[0.3em] uppercase">
                        {selectedProject.category}
                      </div>
                      <button
                        onClick={closeProject}
                        className="p-3 rounded-full bg-muted border border-border text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all shadow-md"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <h2 className="text-4xl font-black text-foreground mb-8 tracking-tighter leading-tight">
                      {selectedProject.title}
                    </h2>

                    <div className="space-y-8">
                      <div>
                        <h4 className="text-primary font-mono text-sm mb-4 tracking-[0.3em] uppercase font-bold">Overview</h4>
                        <p className="text-muted-foreground text-base leading-relaxed font-medium whitespace-pre-line">
                          {selectedProject.fullDesc}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-primary font-mono text-sm mb-6 tracking-[0.3em] uppercase font-bold">Key Features</h4>
                        <ul className="space-y-4">
                          {selectedProject.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-4 group">
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(255,140,53,0.5)]" />
                              <span className="text-foreground text-base font-semibold leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-primary font-mono text-sm mb-6 tracking-[0.3em] uppercase font-bold">Technologies</h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedProject.tags.map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-bold hover:border-primary/50 transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        portalRef.current
      )}
    </section>
  );
}
