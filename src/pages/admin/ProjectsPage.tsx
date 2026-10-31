import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  deleteAdminProject,
  fetchAdminProjects,
  reorderAdminProjects,
  updateAdminProject,
} from '@/lib/adminApi';
import { resolveMediaUrl } from '@/lib/media';
import type { AdminProject } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowDown, ArrowUp, ImageOff, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';

export function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['adminProjects'], queryFn: fetchAdminProjects });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
    queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    queryClient.invalidateQueries({ queryKey: ['siteContent'] });
  };
  const onError = (title: string) => (error: Error) => toast({ title, description: error.message, variant: 'destructive' });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProject,
    onSuccess: () => {
      refresh();
      toast({ title: 'Project deleted' });
    },
    onError: onError('Delete failed'),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) => updateAdminProject(id, { isPublished }),
    onSuccess: (project) => {
      refresh();
      toast({ title: project.isPublished ? 'Published' : 'Moved to draft', description: project.title });
    },
    onError: onError('Update failed'),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAdminProjects,
    onSuccess: (projects) => {
      queryClient.setQueryData(['adminProjects'], projects);
      refresh();
    },
    onError: onError('Reorder failed'),
  });

  const move = (index: number, delta: number) => {
    if (!data) return;
    const ids = data.map((project) => project.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderMutation.mutate(ids);
  };

  const confirmDelete = (project: AdminProject) => {
    const label = project.isMock ? 'sample (mock) project' : 'project';
    if (window.confirm(`Delete ${label} "${project.title}"? This cannot be undone.\n(Image files on disk are kept.)`)) {
      deleteMutation.mutate(project.id);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? [])
      .map((project, index) => ({ project, index }))
      .filter(({ project }) => !q || `${project.title} ${project.category} ${project.tags.join(' ')}`.toLowerCase().includes(q));
  }, [data, query]);

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage portfolio items, their order, and visibility on the public site.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button><Plus className="h-4 w-4 mr-2" /> New Project</Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="rounded-2xl border border-border bg-background divide-y divide-border overflow-hidden">
        {filtered.map(({ project, index }) => (
          <div key={project.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
            <div className="flex flex-col gap-1">
              <button aria-label="Move up" disabled={index === 0 || reorderMutation.isPending || !!query} onClick={() => move(index, -1)} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button aria-label="Move down" disabled={index === (data?.length ?? 0) - 1 || reorderMutation.isPending || !!query} onClick={() => move(index, 1)} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
            </div>
            <div className="h-16 w-28 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
              {project.imageUrls[0] ? (
                <img src={resolveMediaUrl(project.imageUrls[0])} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">#{project.projectId}</span>
                <p className="font-semibold truncate">{project.title}</p>
                {project.isMock && <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400">Mock</Badge>}
              </div>
              <p className="text-sm text-muted-foreground truncate">{project.category} · {project.imageUrls.length} images</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={project.isPublished}
                disabled={publishMutation.isPending}
                onCheckedChange={(checked) => publishMutation.mutate({ id: project.id, isPublished: checked })}
              />
              <span className={project.isPublished ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>
                {project.isPublished ? 'Published' : 'Draft'}
              </span>
            </label>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${project.id}`}>
                <Button size="sm" variant="outline" aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
              </Link>
              <Button size="sm" variant="destructive" aria-label="Delete" onClick={() => confirmDelete(project)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No projects found.</p>}
      </div>
    </div>
  );
}
