import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/media';

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
};

export function Footer() {
  const { contact, social, logoUrl } = useSiteContent();
  const logoSrc = resolveMediaUrl(logoUrl);

  return (
    <footer className="bg-background border-t border-border pt-20 pb-8 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1 text-center md:text-left">
            <a href="#" className="inline-flex items-center mb-6">
              <img src={logoSrc} alt="TMRW UNLIMIT" className="h-12 md:h-16 w-auto object-contain" />
              <span className="ml-3 text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                TMRW UNLIMIT
              </span>
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0 mb-8">
              เราสร้างสรรค์เทคโนโลยีรุ่นใหม่สำหรับสตาร์ทอัพและองค์กร เปลี่ยนปัญหาที่ซับซ้อนให้เป็นโซลูชันที่หรูหราและขยายตัวได้
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              {social.map((item, idx) => {
                const Icon = socialIconMap[item.platform as keyof typeof socialIconMap] ?? Mail;
                return (
                  <motion.a
                    key={idx}
                    href={item.href}
                    whileHover={{ scale: 1.2, y: -5 }}
                    className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                    aria-label={item.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-foreground font-semibold mb-6">บริการของเรา</h4>
            <ul className="space-y-4">
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Web App Development</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Mobile App Development</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Custom Software & IoT</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Software Testing & QA</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Back-office Systems</button></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-foreground font-semibold mb-6">บริษัท</h4>
            <ul className="space-y-4">
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">เกี่ยวกับเรา</button></li>
              <li><button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">ผลงานที่ผ่านมา</button></li>
              <li><button onClick={() => document.getElementById('skills')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">ความเชี่ยวชาญ</button></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">ร่วมงานกับเรา</button></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-foreground font-semibold mb-6">ติดต่อ</h4>
            <ul className="space-y-4">
              <li className="text-muted-foreground">{contact.info.address}</li>
              <li><a href={`mailto:${contact.info.email}`} className="text-muted-foreground hover:text-primary transition-colors">{contact.info.email}</a></li>
              <li><a href={`tel:${contact.info.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">{contact.info.phone}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © 2025 TMRW UNLIMIT. สงวนลิขสิทธิ์ทั้งหมด
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-muted-foreground text-sm">Bangkok · Thailand</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
