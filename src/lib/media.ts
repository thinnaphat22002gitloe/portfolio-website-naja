export function resolveMediaUrl(path: string): string {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/uploads') || path.startsWith('/api')) {
    const apiBase = import.meta.env.VITE_API_URL ?? '';
    return `${apiBase}${path}`;
  }

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
}
