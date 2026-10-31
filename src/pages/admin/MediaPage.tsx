import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdminMedia, uploadAdminFile } from '@/lib/adminApi';
import { resolveMediaUrl } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Loader2, Upload } from 'lucide-react';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AdminMediaPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['adminMedia'], queryFn: fetchAdminMedia });

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) await uploadAdminFile(file);
      toast({ title: `${files.length} file(s) uploaded` });
      queryClient.invalidateQueries({ queryKey: ['adminMedia'] });
    } catch (error) {
      toast({ title: 'Upload failed', description: error instanceof Error ? error.message : 'Unable to upload', variant: 'destructive' });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Path copied', description: url });
    } catch {
      toast({ title: 'Copy this path', description: url });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Media</h2>
          <p className="text-muted-foreground">Uploaded images. Copy a path and paste it into a project gallery or the logo setting.</p>
        </div>
        <label>
          <Button asChild disabled={uploading}>
            <span className="cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload</span>
          </Button>
          <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={onUpload} />
        </label>
      </div>

      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <div key={item.url} className="rounded-xl border border-border bg-background overflow-hidden">
              <div className="aspect-[16/10] bg-muted">
                <img src={resolveMediaUrl(item.url)} alt={item.filename} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-3 flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono truncate">{item.filename}</p>
                  <p className="text-[11px] text-muted-foreground">{formatSize(item.size)} · {new Date(item.modifiedAt).toLocaleDateString()}</p>
                </div>
                <button title="Copy path" onClick={() => copy(item.url)} className="p-1.5 rounded hover:bg-muted"><Copy className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No uploads yet.</div>
      )}
    </div>
  );
}
