export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInMinutes: number;
}

export interface DashboardStats {
  projectsTotal: number;
  projectsPublished: number;
  servicesTotal: number;
  contactsNew: number;
  contactsTotal: number;
}

export interface AdminProject {
  id: number;
  projectId: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  gradient: string;
  imagePrefix: string;
  imageStartIndex: number;
  imageCount: number;
  sortOrder: number;
  isPublished: boolean;
  features: string[];
  tags: string[];
  imageUrls: string[];
}

export interface AdminService {
  id: number;
  serviceId: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminContact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  service: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface SiteSettings {
  heroBadge: string;
  heroHeadline: string;
  heroDescription: string;
  typewriterWords: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  workingHours: string;
  logoUrl: string;
  socialLinks: Array<{ platform: string; label: string; href: string }>;
}

export interface UploadResponse {
  url: string;
  filename: string;
}

export type ProjectPayload = Omit<AdminProject, 'id' | 'slug'>;
export type ServicePayload = Omit<AdminService, 'id'>;
