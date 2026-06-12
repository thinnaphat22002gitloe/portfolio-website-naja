import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
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
import { ArrowLeft, Loader2, Upload } from 'lucide-react';

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
  features: [],
  tags: [],
  imageUrls: [],
};

export function AdminProjectEditPage() {
  const [, params] = useRoute('/admin/projects/:id');
  const isNew = params?.id === 'new';
  const projectId = isNew ? null : Number(params?.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ProjectPayload>(emptyProject);
  const [featuresText, setFeaturesText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [uploading, setUploading] = useState(false);

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
      if (isNew) return createAdminProject(payload);
      return updateAdminProject(projectId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      toast({ title: isNew ? 'Project created' : 'Project updated' });
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadAdminFile(file);
      setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, result.url] }));
      toast({ title: 'Image uploaded', description: result.filename });
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
          <Label>Gallery Images</Label>
          <div className="flex flex-wrap gap-3">
            {form.imageUrls.map((url) => (
              <div key={url} className="relative w-28 h-28 rounded-xl border border-border overflow-hidden bg-muted">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border cursor-pointer hover:bg-muted">
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
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
