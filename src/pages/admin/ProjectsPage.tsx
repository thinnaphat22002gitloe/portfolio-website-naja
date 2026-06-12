import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { deleteAdminProject, fetchAdminProjects } from '@/lib/adminApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

export function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['adminProjects'], queryFn: fetchAdminProjects });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      toast({ title: 'Project deleted' });
    },
    onError: (error: Error) => toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }),
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">Manage portfolio items shown on the public site.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button><Plus className="h-4 w-4 mr-2" /> New Project</Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((project) => (
              <tr key={project.id} className="border-t border-border">
                <td className="p-4 font-mono">{project.projectId}</td>
                <td className="p-4 font-semibold">{project.title}</td>
                <td className="p-4 text-muted-foreground">{project.category}</td>
                <td className="p-4">
                  <Badge variant={project.isPublished ? 'default' : 'secondary'}>
                    {project.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/projects/${project.id}`}>
                      <Button size="sm" variant="outline"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
