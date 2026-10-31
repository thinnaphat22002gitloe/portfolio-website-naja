import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useRoute } from 'wouter';
import { resolveMediaUrl } from '@/lib/media';
import {
  createAdminProject,
  fetchAdminProject,
  updateAdminProject,
  uploadAdminFile,
} from '@/lib/adminApi';
import type { ProjectPayload } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowLeft as ChevronLeft, ArrowRight as ChevronRight, Link2, Loader2, Star, Trash2, Upload } from 'lucide-react';

const emptyProject: ProjectPayload = {
  projectId: '',
  title: '',
  category: '',
  shortDesc: '',
  fullDesc: '',
  gradient: 'from-primary/20 to-secondary/20',
  imagePrefix: '',
  imageStartIndex: 1,
  imageCount: 1,
  sortOrder: 0,
  isPublished: true,
  isMock: false,
  features: [],
  tags: [],
  imageUrls: [],
};

export function AdminProjectEditPage() {
  const [, params] = useRoute<{ id: string }>('/admin/projects/:id');
  const rawId = params?.id;
  const isNew = rawId === 'new';
  const projectId = isNew || !rawId ? null : Number(rawId);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ProjectPayload>(emptyProject);
  const [featuresText, setFeaturesText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [, navigate] = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ['adminProject', projectId],
    queryFn: () => fetchAdminProject(projectId!),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (data) {
      setForm({
        projectId: data.projectId,
        title: data.title,
        category: data.category,
        shortDesc: data.shortDesc,
        fullDesc: data.fullDesc,
        gradient: data.gradient,
        imagePrefix: data.imagePrefix,
        imageStartIndex: data.imageStartIndex,
        imageCount: data.imageCount,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        isMock: data.isMock ?? false,
        features: data.features,
        tags: data.tags,
        imageUrls: data.imageUrls,
      });
      setFeaturesText(data.features.join('\n'));
      setTagsText(data.tags.join(', '));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        features: featuresText.split('\n').map((line) => line.trim()).filter(Boolean),
        tags: tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      if (!payload.projectId.trim() || !payload.title.trim() || !payload.category.trim() || !payload.shortDesc.trim() || !payload.fullDesc.trim()) {
        throw new Error('Project ID, title, category, short and full description are required.');
      }
      if (isNew) return createAdminProject(payload);
      return updateAdminProject(projectId!, payload);
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['adminProject', saved.id] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      if (isNew) navigate(`/admin/projects/${saved.id}`, { replace: true });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      toast({ title: isNew ? 'Project created' : 'Project updated' });
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const result = await uploadAdminFile(file);
        setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, result.url] }));
      }
      toast({ title: files.length > 1 ? `${files.length} images uploaded` : 'Image uploaded', description: 'Remember to save the project.' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unable to upload file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const moveImage = (index: number, delta: number) => {
    setForm((prev) => {
      const next = [...prev.imageUrls];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, imageUrls: next };
    });
  };
  const makeCover = (index: number) => {
    setForm((prev) => {
      const next = [...prev.imageUrls];
      const [item] = next.splice(index, 1);
      return { ...prev, imageUrls: [item, ...next] };
    });
  };
  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  };
  const addImagePath = () => {
    const value = imagePath.trim();
    if (!value) return;
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, value] }));
    setImagePath('');
  };

  if (!isNew && isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h2 className="text-2xl font-bold">{isNew ? 'New Project' : 'Edit Project'}</h2>
          <p className="text-muted-foreground">Configure portfolio content and gallery images.</p>
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl border border-border bg-background p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Project ID</Label>
            <Input value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Short Description</Label>
            <Textarea value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Full Description</Label>
            <Textarea className="min-h-[160px]" value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Gradient Classes</Label>
            <Input value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <Switch checked={form.isPublished} onCheckedChange={(checked) => setForm({ ...form, isPublished: checked })} />
            <Label>Published</Label>
            <Switch checked={!!form.isMock} onCheckedChange={(checked) => setForm({ ...form, isMock: checked })} className="ml-6" />
            <Label>Sample / mock project</Label>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Features (one per line)</Label>
            <Textarea className="min-h-[120px]" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Tags (comma separated)</Label>
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <Label>Gallery Images <span className="text-muted-foreground font-normal">({form.imageUrls.length})</span></Label>
            <span className="text-xs text-muted-foreground">First image is the cover. PNG/JPG/WebP/GIF, max 5 MB each.</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {form.imageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className={`group relative aspect-[16/10] rounded-xl border overflow-hidden bg-muted ${index === 0 ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}>
                <img src={resolveMediaUrl(url)} alt="" loading="lazy" className="w-full h-full object-cover" />
                {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">COVER</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button type="button" title="Move left" onClick={() => moveImage(index, -1)} className="rounded-md bg-white/15 p-1.5 text-white hover:bg-white/30"><ChevronLeft className="h-3.5 w-3.5" /></button>
                  <button type="button" title="Set as cover" onClick={() => makeCover(index)} className="rounded-md bg-white/15 p-1.5 text-white hover:bg-white/30"><Star className="h-3.5 w-3.5" /></button>
                  <button type="button" title="Move right" onClick={() => moveImage(index, 1)} className="rounded-md bg-white/15 p-1.5 text-white hover:bg-white/30"><ChevronRight className="h-3.5 w-3.5" /></button>
                  <button type="button" title="Remove from gallery" onClick={() => removeImage(index)} className="rounded-md bg-red-500/80 p-1.5 text-white hover:bg-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
            {form.imageUrls.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">No images yet — upload files or add an existing path such as <code>/picture/AppQ Customer Portal1.png</code>.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border cursor-pointer hover:bg-muted">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>{uploading ? 'Uploading...' : 'Upload images'}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <div className="flex flex-1 min-w-[240px] gap-2">
              <Input placeholder="/picture/... or https://..." value={imagePath} onChange={(e) => setImagePath(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImagePath())} />
              <Button type="button" variant="outline" onClick={addImagePath}><Link2 className="h-4 w-4 mr-1" /> Add</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Removing an image only unlinks it from this project; the file itself is not deleted.</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Project'}
          </Button>
        </div>
      </div>
    </div>
  );
}
