export function resolveMediaUrl(path: string): string {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/uploads') || path.startsWith('/api')) {
    const apiBase = import.meta.env.VITE_API_URL ?? '';
    return `${apiBase}${path}`;
  }

  const base = import.meta.env.BASE_URL;

  if (path.startsWith(base)) {
    return encodeAssetPath(path);
  }

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return encodeAssetPath(`${base}${normalized}`);
}

function encodeAssetPath(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : ''))
    .join('/');
}
