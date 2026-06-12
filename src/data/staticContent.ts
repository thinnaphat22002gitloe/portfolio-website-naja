import type { Project, SiteContent } from '@/types/content';

function buildImagePath(prefix: string, index: number): string {
  const base = import.meta.env.BASE_URL;
  return `${base}picture/${prefix}${index}.png`;
}

function buildProjectImages(prefix: string, startIndex: number, count: number): string[] {
  return Array.from({ length: count }, (_, offset) => buildImagePath(prefix, startIndex + offset));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'project';
}

const PROJECTS: Project[] = [
  {
    id: '01',
    slug: slugify('AppQ Customer Portal'),
    title: 'AppQ Customer Portal',
    category: 'Client-Facing Web Application',
    desc: 'เปิดประสบการณ์ใหม่ในการติดตามสินทรัพย์วิศวกรรมไฟฟ้าผ่าน Digital Twin และ Real-time Monitoring ที่เข้าถึงง่ายเพียงปลายนิ้วสัมผัส',
    fullDesc: `แพลตฟอร์มหน้าบ้าน (Portal) สำหรับลูกค้าองค์กร เพื่อใช้ในการเข้าถึงข้อมูล ตรวจสอบสถานะ และติดตามการทำงานของสินทรัพย์วิศวกรรมไฟฟ้าและข้อมูลพลังงานแบบ Real-time

ผู้ใช้สามารถเข้าถึงหน้าพอร์ทัลนี้ได้ง่ายผ่านการสแกน QR Code ประจำอุปกรณ์ หรือการกรอก Project Key ตัวระบบโดดเด่นด้านการจัดการข้อมูลและการแสดงผลด้วยกราฟิก (Data Visualization) ที่เข้าใจง่าย ช่วยเพิ่มความโปร่งใสและยกระดับบริการหลังการขายให้แก่ผู้ใช้งานระดับองค์กร`,
    features: [
      'Multi-Method Portal Access: เข้าถึงผ่าน QR Code, ค้นหาชื่อโครงการ หรือ Project Key',
      'Interactive Digital Twin Dashboard: จำลองโครงสร้างระบบไฟฟ้าในรูปแบบดิจิทัล',
      'Real-time Data Visualization: กราฟแสดงผลข้อมูลพลังงานรายอุปกรณ์ พร้อมระบบ Filter ยืดหยุ่น',
      'Automated Alarm & Notification: ระบบแจ้งเตือนเหตุขัดข้องทางวิศวกรรมแบบ Real-time',
      'Commercial Documents History: ศูนย์รวมประวัติใบเสนอราคาและเอกสารโครงการ',
    ],
    tags: ['React.js', 'Tailwind CSS', 'Data Visualization', 'QR-Driven'],
    gradient: 'from-[#ff8c35]/20 to-[#e8405a]/20',
    imageCount: 6,
    imagePrefix: 'AppQ Customer Portal',
    imageStartIndex: 1,
    coverImage: buildImagePath('AppQ Customer Portal', 1),
    images: buildProjectImages('AppQ Customer Portal', 1, 6),
  },
  {
    id: '02',
    slug: slugify('AppQ Premium Workspace'),
    title: 'AppQ Premium Workspace',
    category: 'B2B Sales Operations Platform',
    desc: 'ยกระดับงานขายวิศวกรรมสู่ยุคดิจิทัลด้วยระบบออกใบเสนอราคาอัตโนมัติที่แม่นยำ รวดเร็ว และเชื่อมต่ออย่างไร้รอยต่อผ่าน LINE',
    fullDesc: `แพลตฟอร์มบริหารจัดการงานขายและออกใบเสนอราคาอัตโนมัติสำหรับธุรกิจวิศวกรรมพลังงานและระบบควบคุมอุตสาหกรรม (SCADA)

ออกแบบระบบให้รองรับลูปการทำงานตั้งแต่การล็อกอินผ่าน LINE, การจัดการแพ็กเกจสินค้า, การนำเสนอสไลด์ฟีเจอร์ซอฟต์แวร์ ไปจนถึงการเจนใบเสนอราคาอย่างเป็นทางการในรูปแบบ PDF/Excel พร้อมระบบอนุมัติและลงลายมือชื่อดิจิทัล ช่วยเพิ่มความรวดเร็วและแม่นยำในกระบวนการขายขององค์กร`,
    features: [
      'LINE Integration: เข้าสู่ระบบและเชื่อมต่อบัญชีผ่าน LINE API',
      'Sales Admin Dashboard: ติดตามตัวชี้วัดสำคัญ ยอดขาย และรายการรออนุมัติ',
      'Dynamic Product Management: จัดการแพ็กเกจสินค้าตามขนาดองค์กรอย่างยืดหยุ่น',
      'Interactive Presentation CMS: ระบบจัดการและนำเสนอสไลด์ฟีเจอร์สินค้าบนเว็บ',
      'Automated Quotation Generator: สร้างใบเสนอราคา PDF/Excel พร้อมลายเซ็นดิจิทัลในคลิกเดียว',
    ],
    tags: ['Next.js', 'Tailwind CSS', 'PDF Generation', 'LINE API'],
    gradient: 'from-[#6c63ff]/20 to-[#00d4ff]/20',
    imageCount: 12,
    imagePrefix: 'AppQ Premium Workspace',
    imageStartIndex: 1,
    coverImage: buildImagePath('AppQ Premium Workspace', 1),
    images: buildProjectImages('AppQ Premium Workspace', 1, 12),
  },
  {
    id: '03',
    slug: slugify('EMS Platform Engineering Service'),
    title: 'EMS Platform Engineering Service',
    category: 'Engineering & Asset Management',
    desc: 'ปฏิวัติงานซ่อมบำรุงด้วยระบบบริหารจัดการสินทรัพย์อัจฉริยะ เปลี่ยนงานเอกสารที่ซับซ้อนให้เป็นข้อมูลดิจิทัลที่ตรวจสอบได้ทันที',
    fullDesc: `แพลตฟอร์มบริหารจัดการงานวิศวกรรมและการซ่อมบำรุงระบบไฟฟ้าแบบครบวงจร ออกแบบมาเพื่อเปลี่ยนกระบวนการทำงานของวิศวกรและช่างหน้างานให้อยู่ในรูปแบบดิจิทัล (Digital Transformation)

รองรับการจัดระเบียบโครงสร้างข้อมูลวิศวกรรม, การจัดการสินทรัพย์แผงวงจรและมิเตอร์, รวมถึงระบบสร้าง QR Code อัจฉริยะเพื่อให้ลูกค้าเข้าถึงข้อมูลสถานะอุปกรณ์ได้ทันทีแบบ Real-time`,
    features: [
      'Admin Dashboard: สรุปภาพรวมลูกค้า โครงการ และสินทรัพย์ทั้งหมด',
      'Asset Management: ระบบควบคุมอุปกรณ์ไฟฟ้าแบบลำดับขั้น (Project -> Panel -> Loop -> Meter)',
      'Smart QR Center: สร้าง Dynamic QR Code สำหรับอุปกรณ์แต่ละชิ้นโดยเฉพาะ',
      'Digital Report Center: ออกรายงานการตรวจสอบ PM/MA อัตโนมัติ ลดการใช้กระดาษ',
      'Data Sync System: เชื่อมโยงข้อมูลกับระบบ AppQ เพื่อความแม่นยำของฐานข้อมูล',
    ],
    tags: ['React.js', 'Asset Management', 'IoT Integration', 'B2B SaaS'],
    gradient: 'from-[#00d4ff]/20 to-[#ff6b9d]/20',
    imageCount: 5,
    imagePrefix: 'EMS Platform Engineering Service',
    imageStartIndex: 1,
    coverImage: buildImagePath('EMS Platform Engineering Service', 1),
    images: buildProjectImages('EMS Platform Engineering Service', 1, 5),
  },
  {
    id: '04',
    slug: slugify('CORE DATA (Master Data Hub)'),
    title: 'CORE DATA (Master Data Hub)',
    category: 'Web Application / Backoffice Dashboard & Data Management System',
    desc: 'พัฒนาระบบจัดการฐานข้อมูลกลางและแผงควบคุมหลังบ้าน เพื่อทำหน้าที่เป็นศูนย์กลางข้อมูล (Single Source of Truth) ขององค์กร',
    fullDesc: `พัฒนาระบบจัดการฐานข้อมูลกลาง (Master Data Hub) และแผงควบคุมหลังบ้าน (Backoffice) เพื่อทำหน้าที่เป็นศูนย์กลางข้อมูล (Single Source of Truth) ขององค์กร รองรับการเชื่อมต่อและซิงค์ข้อมูลผ่าน API ร่วมกับแอปพลิเคชันภายนอก (AppQ) ช่วยให้ทีมบริหารจัดการและตรวจสอบข้อมูลได้อย่างมีประสิทธิภาพในจุดเดียว`,
    features: [
      'Data Hub Dashboard: หน้าแสดงผลและติดตามสถานะภาพรวมของข้อมูล 4 ส่วนสำคัญ',
      'Customer Management: ระบบจัดการและแก้ไขฐานข้อมูลลูกค้า (CRUD Operation) พร้อมระบบคัดกรองข้อมูล',
      'API Integration: รองรับการดึงข้อมูลและเชื่อมต่อระบบภายนอก พร้อมหน้าคู่มือ API (API Docs)',
      'UI/UX Design: ออกแบบแผงควบคุมที่เน้นความเรียบง่าย สแกนข้อมูลง่าย และเข้าถึงระบบจัดการข้อมูลลูกค้าได้อย่างรวดเร็ว',
    ],
    tags: ['Backoffice', 'API First', 'Data Management', 'Dashboard', 'RESTful API'],
    gradient: 'from-[#a855f7]/20 to-[#6c63ff]/20',
    imageCount: 2,
    imagePrefix: 'Core-data-',
    imageStartIndex: 0,
    coverImage: buildImagePath('Core-data-', 0),
    images: buildProjectImages('Core-data-', 0, 2),
  },
  {
    id: '05',
    slug: slugify('Intelligent Production Monitoring & Admin Control Platform'),
    title: 'Intelligent Production Monitoring & Admin Control Platform',
    category: 'Desktop Application (.exe) & Web Dashboard / Operations & Data Management System',
    desc: 'ระบบบริหารจัดการและติดตามประสิทธิภาพการผลิตในโรงงานอัจฉริยะ (Smart Factory) แบบครบวงจร',
    fullDesc: `ระบบบริหารจัดการและติดตามประสิทธิภาพการผลิตในโรงงานอัจฉริยะ (Smart Factory) แบบครบวงจร โดยพัฒนาตัวแอปพลิเคชันแยกออกเป็น 2 ส่วนหลักเพื่อตอบโจทย์การใช้งานจริงในองค์กร`,
    features: [
      'Cross-Platform Delivery (.exe & Web): สถาปัตยกรรมระบบที่แยกการทำงานแบบ Hybrid',
      'Real-time Production Monitor Dashboard: แผงควบคุมดีไซน์ Dark Mode แสดงสถานะเครื่องจักร',
      'Centralized Admin Panel & Authentication: ระบบความปลอดภัยหลังบ้านที่ต้องผ่านหน้าล็อกอิน',
      'Bulk Data Import & KPI Settings: ระบบรองรับการนำเข้าข้อมูลดิบปริมาณมากผ่านการอัปโหลดไฟล์ Excel',
    ],
    tags: ['Desktop App', 'Web Dashboard', 'Excel Integration', 'Dark Mode', 'Industrial UI'],
    gradient: 'from-primary/20 to-secondary/20',
    imageCount: 5,
    imagePrefix: 'Intelligent Production Monitoring & Admin Control Platform',
    imageStartIndex: 1,
    coverImage: buildImagePath('Intelligent Production Monitoring & Admin Control Platform', 1),
    images: buildProjectImages('Intelligent Production Monitoring & Admin Control Platform', 1, 5),
  },
  {
    id: '06',
    slug: slugify('Enterprise Power Platform Solutions'),
    title: 'Enterprise Power Platform Solutions',
    category: 'Internal Enterprise Web Application / Process Automation & Business Intelligence (BI) Dashboard',
    desc: 'แพลตฟอร์มแอปพลิเคชันและแดชบอร์ดอัจฉริยะภายในองค์กร พัฒนาขึ้นบน Microsoft Power Platform',
    fullDesc: `แพลตฟอร์มแอปพลิเคชันและแดชบอร์ดอัจฉริยะภายในองค์กร พัฒนาขึ้นบน Microsoft Power Platform เพื่อขับเคลื่อนองค์กรสู่การเป็น Paperless Digital Workplace และ Smart Factory เต็มรูปแบบ`,
    features: [
      'Paperless FA Online Approval Workflow: ระบบฟอร์มขออนุมัติตัวอย่างผลิตภัณฑ์ (First Article) บน Power Apps',
      'Smart Factory Production Dashboard: หน้าจอแดชบอร์ดสไตล์ Dark Mode สำหรับมอนิเตอร์สถานะไลน์การผลิต',
      'Admin Control Panel & KPI Settings: ระบบควบคุมหลังบ้านสำหรับผู้ดูแลระบบ',
      'Material Inventory & Variance Analytics: หน้าจอรายงานเชิงวิเคราะห์ข้อมูลสต็อกและปริมาณการใช้วัตถุดิบ',
      'OSLR Multimedia Hub & EMR: แพลตฟอร์มทวิภาคที่รวม 2 โมดูลหลัก (SOP Video & Equipment Maintenance Record)',
    ],
    tags: ['Microsoft Power Platform', 'Power Apps', 'Power Automate', 'Power BI', 'Low-Code'],
    gradient: 'from-[#7e22ce]/20 to-[#3b82f6]/20',
    imageCount: 5,
    imagePrefix: 'Power Platform',
    imageStartIndex: 1,
    coverImage: buildImagePath('Power Platform', 1),
    images: buildProjectImages('Power Platform', 1, 5),
  },
];

export const staticSiteContent: SiteContent = {
  logoUrl: `${import.meta.env.BASE_URL}assets/logo.svg`,
  hero: {
    badge: 'Software Development · Thailand',
    headline: 'We Build Technology',
    description:
      'เราเชื่อว่าเทคโนโลยีควรเป็นเครื่องมือที่ทุกคนเข้าถึงได้ — ตั้งแต่เว็บไซต์ ระบบหลังบ้าน แอปพลิเคชัน ไปจนถึงระบบ AI ที่ช่วยแก้ปัญหาในชีวิตจริง',
    typewriterWords: [
      'That Moves You Forward',
      'Scales With Your Business',
      'Delivers Real Results',
      'Solves Complex Problems',
    ],
    ctaPrimary: 'นัดหมายขอรับคำปรึกษา',
    ctaSecondary: 'ดูบริการของเรา',
  },
  about: {
    sectionLabel: '01 — ABOUT US',
    title: 'Driving Business with Digital Innovation',
    subtitle:
      'เราคือทีมผู้เชี่ยวชาญที่มุ่งมั่นเปลี่ยนไอเดียให้กลายเป็นระบบที่ใช้งานได้จริง ลดความซับซ้อน และเพิ่มขีดความสามารถในการแข่งขัน',
    cards: [
      { id: '01', title: 'Startup-Friendly', icon: 'Rocket', description: 'สนับสนุนธุรกิจยุคใหม่และสตาร์ทอัพให้เริ่มต้นได้อย่างรวดเร็วและง่ายดาย ด้วยรากฐานเทคโนโลยีที่เหมาะสม' },
      { id: '02', title: 'Automation First', icon: 'Zap', description: 'ลดขั้นตอนการทำงานที่ซ้ำซ้อนด้วยระบบอัตโนมัติอัจฉริยะ ที่ออกแบบมาเพื่อตอบโจทย์ธุรกิจของคุณโดยเฉพาะ' },
      { id: '03', title: 'AI-Driven', icon: 'Brain', description: 'ขับเคลื่อนการใช้งาน AI และเทคโนโลยีอุบัติใหม่อย่างสร้างสรรค์และมีคุณภาพ เพื่อแก้ปัญหาที่สำคัญ' },
      { id: '04', title: 'Performance Boost', icon: 'TrendingUp', description: 'สร้างซอฟต์แวร์ที่ช่วยเพิ่มประสิทธิภาพการทำงานให้กับองค์กร ทีม และบุคคลได้อย่างชัดเจน' },
      { id: '05', title: 'User-Centered Design', icon: 'Users', description: 'ออกแบบระบบที่ใช้งานง่าย เข้าถึงได้ และเป็นมิตรกับผู้ใช้งานทุกกลุ่มอย่างแท้จริง' },
      { id: '06', title: 'Built to Scale', icon: 'Maximize', description: 'พัฒนาเทคโนโลยีโดยคำนึงถึงการเติบโตในอนาคต — ระบบที่สามารถปรับเปลี่ยนและขยายตัวตามความต้องการที่เพิ่มขึ้น' },
    ],
    stats: [
      { value: '4+', label: 'Projects Completed' },
      { value: '100%', label: 'Client Satisfaction' },
      { value: '24/7', label: 'Support & Service' },
    ],
  },
  services: {
    sectionLabel: '02 — SERVICES',
    title: 'Expertise & Solutions',
    description:
      'เราเปลี่ยนวิสัยทัศน์ของคุณให้เป็นจริงด้วยบริการพัฒนาซอฟต์แวร์แบบครบวงจร ตั้งแต่การวางโครงสร้างไอเดียไปจนถึงการ Deploy และการดูแลระบบที่พร้อมเติบโตไปกับธุรกิจของคุณในระยะยาว',
    items: [
      { id: '01', title: 'Digital Twin & IoT Platform', description: 'ออกแบบและพัฒนาแพลตฟอร์มจำลองสินทรัพย์ดิจิทัล พร้อมระบบติดตามพลังงานและสถานะอุปกรณ์แบบ Real-time เพื่อการบริหารจัดการที่แม่นยำ' },
      { id: '02', title: 'Sales Automation Systems', description: 'พัฒนาระบบจัดการงานขายและออกใบเสนอราคาอัตโนมัติ (Automated Quotation) ครบวงจร ช่วยเพิ่มความรวดเร็วและลดข้อผิดพลาดให้ทีมขาย B2B' },
      { id: '03', title: 'Engineering Asset Management', description: 'ระบบบริหารจัดการงานวิศวกรรมและการซ่อมบำรุง (PM/MA) ที่เปลี่ยนงานเอกสารให้เป็นดิจิทัล พร้อมระบบ QR Code ติดตามสินทรัพย์หน้างาน' },
      { id: '04', title: 'Master Data & API Integration', description: 'บริการรวมศูนย์ข้อมูลองค์กร (Master Data Hub) เพื่อสร้างแหล่งข้อมูลที่ถูกต้องเพียงหนึ่งเดียว พร้อมระบบเชื่อมต่อ API กับแพลตฟอร์มภายนอก' },
      { id: '05', title: 'Interactive Data Visualization', description: 'เปลี่ยนข้อมูลดิบที่ซับซ้อนให้เป็นกราฟและแดชบอร์ดที่สวยงาม เข้าใจง่าย ช่วยให้คุณวิเคราะห์และตัดสินใจทางธุรกิจได้อย่างมีประสิทธิภาพ' },
    ],
  },
  portfolio: {
    sectionLabel: '03 — PORTFOLIO',
    title: 'Latest Work',
    description: 'สัมผัสประสบการณ์นวัตกรรมดิจิทัลที่เราสร้างสรรค์ขึ้น เพื่อตอบโจทย์ความต้องการที่ท้าทายของธุรกิจยุคใหม่',
    projects: PROJECTS,
  },
  contact: {
    sectionLabel: '04 — CONTACT',
    title: "Let's Talk About Your Project",
    description: 'พร้อมที่จะเริ่มโปรเจกต์ใหม่หรือยัง? ติดต่อเราเพื่อรับคำปรึกษาฟรี และมาร่วมกันสร้างสิ่งใหม่ๆ ไปด้วยกัน',
    info: {
      email: 'Ruttinon@gmail.com',
      phone: '090 669 8821',
      address: 'Bangkok, Thailand',
      workingHours: 'Mon — Fri, 9AM — 6PM',
    },
  },
  social: [
    { platform: 'github', label: 'GitHub', href: '#' },
    { platform: 'linkedin', label: 'LinkedIn', href: '#' },
    { platform: 'instagram', label: 'Instagram', href: '#' },
    { platform: 'email', label: 'Email', href: 'mailto:Ruttinon@gmail.com' },
  ],
};

export function usesStaticContent(): boolean {
  const apiUrl = String(import.meta.env.VITE_API_URL ?? '').trim();
  if (apiUrl.length > 0) {
    return false;
  }

  // Local dev uses the Vite proxy even when VITE_API_URL is unset.
  if (import.meta.env.DEV) {
    return false;
  }

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    return true;
  }

  return import.meta.env.PROD;
}
