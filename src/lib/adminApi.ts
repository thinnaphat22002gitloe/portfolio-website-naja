import { ApiError } from '@/lib/api';
import type {
  AdminContact,
  AdminProject,
  AdminService,
  AdminUser,
  DashboardStats,
  ProjectPayload,
  ServicePayload,
  SiteSettings,
  TokenResponse,
  UploadResponse,
} from '@/types/admin';

const API_BASE = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'tmrw_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (!(init?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(typeof detail === 'string' ? detail : 'Request failed', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function adminLogin(email: string, password: string): Promise<TokenResponse> {
  return adminRequest<TokenResponse>('/api/v1/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchAdminMe(): Promise<AdminUser> {
  return adminRequest<AdminUser>('/api/v1/admin/me');
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return adminRequest<DashboardStats>('/api/v1/admin/dashboard');
}

export async function fetchAdminProjects(): Promise<AdminProject[]> {
  return adminRequest<AdminProject[]>('/api/v1/admin/projects');
}

export async function fetchAdminProject(id: number): Promise<AdminProject> {
  return adminRequest<AdminProject>(`/api/v1/admin/projects/${id}`);
}

export async function createAdminProject(payload: ProjectPayload): Promise<AdminProject> {
  return adminRequest<AdminProject>('/api/v1/admin/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProject(id: number, payload: Partial<ProjectPayload>): Promise<AdminProject> {
  return adminRequest<AdminProject>(`/api/v1/admin/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProject(id: number): Promise<void> {
  return adminRequest<void>(`/api/v1/admin/projects/${id}`, { method: 'DELETE' });
}

export async function fetchAdminServices(): Promise<AdminService[]> {
  return adminRequest<AdminService[]>('/api/v1/admin/services');
}

export async function createAdminService(payload: ServicePayload): Promise<AdminService> {
  return adminRequest<AdminService>('/api/v1/admin/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminService(id: number, payload: Partial<ServicePayload>): Promise<AdminService> {
  return adminRequest<AdminService>(`/api/v1/admin/services/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminService(id: number): Promise<void> {
  return adminRequest<void>(`/api/v1/admin/services/${id}`, { method: 'DELETE' });
}

export async function fetchAdminContacts(): Promise<AdminContact[]> {
  return adminRequest<AdminContact[]>('/api/v1/admin/contacts');
}

export async function updateAdminContactStatus(id: number, status: string): Promise<AdminContact> {
  return adminRequest<AdminContact>(`/api/v1/admin/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminSettings(): Promise<SiteSettings> {
  return adminRequest<SiteSettings>('/api/v1/admin/settings');
}

export async function updateAdminSettings(payload: Partial<SiteSettings>): Promise<SiteSettings> {
  return adminRequest<SiteSettings>('/api/v1/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function uploadAdminFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return adminRequest<UploadResponse>('/api/v1/admin/upload', {
    method: 'POST',
    body: formData,
  });
}
