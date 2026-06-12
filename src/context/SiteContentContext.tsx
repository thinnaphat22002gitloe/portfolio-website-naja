import { createContext, useContext } from 'react';
import type { SiteContent } from '@/types/content';

export const SiteContentContext = createContext<SiteContent | null>(null);

export function useSiteContent(): SiteContent {
  const content = useContext(SiteContentContext);
  if (!content) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return content;
}
