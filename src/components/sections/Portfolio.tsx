import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, X } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/media';
import type { Project } from '@/types/content';

const FILTER_GROUPS = [
  { label: 'Web App', match: /web|portal|saas|marketplace|e-commerce/ },
  { label: 'Mobile', match: /mobile|react native|flutter|ios|android/ },
  { label: 'Dashboard & BI', match: /dashboard|analytics|\bbi\b|data/ },
  { label: 'Enterprise', match: /enterprise|b2b|internal|operations|asset|desktop/ },
  { label: 'AI', match: /\bai\b|llm|chatbot|rag|machine learning/ },
];

interface PortfolioProps {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export function Portfolio({ selectedProject, setSelectedProject }: PortfolioProps) {
  const { portfolio } = useSiteContent();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [filter, setFilter] = useState('All');
  const groupsOf = (project: Project) => {
    const text = `${project.category} ${project.tags.join(' ')}`.toLowerCase();
    return FILTER_GROUPS.filter((g) => g.match.test(text)).map((g) => g.label);
  };
  const categories = useMemo(() => {
    const present = new Set(portfolio.projects.flatMap(groupsOf));
    return ['All', ...FILTER_GROUPS.map((g) => g.label).filter((l) => present.has(l))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio.projects]);
  const visibleProjects = useMemo(
    () => (filter === 'All' ? portfolio.projects : portfolio.projects.filter((p) => groupsOf(p).includes(filter))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, portfolio.projects],
  );
  const galleryOf = (project: Project) =>
    project.images.length > 0 ? project.images : project.coverImage ? [project.coverImage] : [];
  const imageTotal = selectedProject ? Math.max(galleryOf(selectedProject).length, 1) : 1;
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
      setCurrentImgIdx((prev) => (prev + 1) % imageTotal);
    }
  };

  const prevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedProject) {
      setCurrentImgIdx((prev) => (prev - 1 + imageTotal) % imageTotal);
    }
  };

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
      if (e.key === 'ArrowRight') setCurrentImgIdx((prev) => (prev + 1) % imageTotal);
      if (e.key === 'ArrowLeft') setCurrentImgIdx((prev) => (prev - 1 + imageTotal) % imageTotal);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject, imageTotal, setSelectedProject]);

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

        {categories.length > 2 && (
          <div className="mb-12 -mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                className={`relative rounded-full px-5 py-2 text-sm font-bold transition-colors ${filter === cat ? 'text-primary-foreground' : 'border border-border bg-card/70 text-foreground hover:border-primary/50'}`}
              >
                {filter === cat && (
                  <motion.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: (idx % 2) * 0.1, duration: 0.7 }}
              onClick={() => openProject(project)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openProject(project))}
              role="button"
              tabIndex={0}
              aria-label={`Open ${project.title}`}
              className="group relative h-[360px] sm:h-[420px] rounded-3xl overflow-hidden cursor-pointer border border-border shadow-lg hover:shadow-2xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-muted transition-transform duration-700 group-hover:scale-105">
                <img
                  src={resolveMediaUrl(project.coverImage || getImageSrc(project, 0))}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent group-hover:via-background/40 transition-all duration-500" />

                <div className="absolute top-8 left-8 px-5 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border text-sm font-bold text-foreground shadow-lg">
                  {project.category}
                </div>

                <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                  <ArrowRight size={24} />
                </div>

                <span className="absolute top-6 right-8 text-6xl font-black text-foreground/30 dark:text-white/20 group-hover:text-primary/30 dark:group-hover:text-primary/40 transition-colors">
                  {project.id}
                </span>
              </div>

              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                <motion.h3 className="text-3xl font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {project.title}
                </motion.h3>
                <p className="text-muted-foreground text-base max-w-sm line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {project.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-foreground/80 backdrop-blur-md">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>
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
                        alt={`${selectedProject.title} — image ${currentImgIdx + 1} of ${imageTotal}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-contain"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-none [&>button]:pointer-events-auto">
                      <button onClick={prevImg} aria-label="Previous image" className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={nextImg} aria-label="Next image" className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <ArrowRight size={18} />
                      </button>
                    </div>

                    {imageTotal > 1 && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/70 backdrop-blur-md border border-border text-xs font-semibold tabular-nums text-foreground">
                        {currentImgIdx + 1} / {imageTotal}
                      </div>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center max-w-[90%] gap-2 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-md border border-border">
                      {imageTotal > 1 && Array.from({ length: imageTotal }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(idx); }}
                          aria-label={`Show image ${idx + 1}`}
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
                        aria-label="Close"
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
