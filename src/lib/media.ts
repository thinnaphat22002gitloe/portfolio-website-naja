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
    .map((segment) => (segment ? encodeSegment(segment) : ''))
    .join('/');
}

// encodeURIComponent also escapes RFC 3986 sub-delims ("&", "+", ",", ...) that are legal in a path.
// Some static servers (incl. Vite dev) don't decode e.g. %26, so keep those characters literal.
function encodeSegment(segment: string): string {
  return encodeURIComponent(segment).replace(/%(26|2B|2C|3B|3D|40|24|21)/gi, (m) => decodeURIComponent(m));
}
