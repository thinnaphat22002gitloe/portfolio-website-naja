export interface HeroContent {
  badge: string;
  headline: string;
  description: string;
  typewriterWords: string[];
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface AboutCard {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface AboutContent {
  sectionLabel: string;
  title: string;
  subtitle: string;
  cards: AboutCard[];
  stats: Stat[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

export interface ServicesContent {
  sectionLabel: string;
  title: string;
  description: string;
  items: ServiceItem[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  desc: string;
  fullDesc: string;
  features: string[];
  tags: string[];
  gradient: string;
  imageCount: number;
  imagePrefix: string;
  imageStartIndex: number;
  coverImage: string;
  images: string[];
}

export interface PortfolioContent {
  sectionLabel: string;
  title: string;
  description: string;
  projects: Project[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
}

export interface ContactContent {
  sectionLabel: string;
  title: string;
  description: string;
  info: ContactInfo;
}

export interface SocialLink {
  platform: string;
  label: string;
  href: string;
}

export interface SiteContent {
  logoUrl: string;
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  contact: ContactContent;
  social: SocialLink[];
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  id: number;
  message: string;
}
