import { staticSiteContent, usesStaticContent } from '@/data/staticContent';
import type { ContactPayload, ContactResponse, Project, SiteContent } from '@/types/content';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(typeof detail === 'string' ? detail : 'Request failed', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchSiteContent(): Promise<SiteContent> {
  if (usesStaticContent()) {
    return staticSiteContent;
  }

  try {
    return await request<SiteContent>('/api/v1/content');
  } catch {
    return staticSiteContent;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  if (usesStaticContent()) {
    return staticSiteContent.portfolio.projects;
  }

  try {
    return await request<Project[]>('/api/v1/projects');
  } catch {
    return staticSiteContent.portfolio.projects;
  }
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  if (usesStaticContent()) {
    throw new ApiError(
      'Contact form is unavailable on static hosting. Please email us directly.',
      503,
    );
  }

  return request<ContactResponse>('/api/v1/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function checkApiHealth(): Promise<{ status: string; database: string }> {
  return request<{ status: string; database: string }>('/api/v1/health');
}

export { ApiError };
