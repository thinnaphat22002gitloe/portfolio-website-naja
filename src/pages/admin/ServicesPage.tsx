import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminService,
  deleteAdminService,
  fetchAdminServices,
  updateAdminService,
} from '@/lib/adminApi';
import type { ServicePayload } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const emptyService: ServicePayload = {
  serviceId: '',
  title: '',
  description: '',
  sortOrder: 0,
  isActive: true,
};

export function AdminServicesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ServicePayload>(emptyService);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['adminServices'], queryFn: fetchAdminServices });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) return updateAdminService(editingId, form);
      return createAdminService(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      setForm(emptyService);
      setEditingId(null);
      toast({ title: editingId ? 'Service updated' : 'Service created' });
    },
    onError: (error: Error) => toast({ title: 'Save failed', description: error.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
      toast({ title: 'Service deleted' });
    },
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Services</h2>
        <p className="text-muted-foreground">Manage service cards on the public site.</p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 space-y-4">
        <h3 className="font-semibold">{editingId ? 'Edit Service' : 'Add Service'}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Service ID</Label>
            <Input value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} />
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
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
            <Label>Active</Label>
          </div>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {editingId ? 'Update Service' : <><Plus className="h-4 w-4 mr-2" />Add Service</>}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Active</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((service) => (
              <tr key={service.id} className="border-t border-border">
                <td className="p-4 font-mono">{service.serviceId}</td>
                <td className="p-4">{service.title}</td>
                <td className="p-4">{service.isActive ? 'Yes' : 'No'}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(service.id);
                        setForm({
                          serviceId: service.serviceId,
                          title: service.title,
                          description: service.description,
                          sortOrder: service.sortOrder,
                          isActive: service.isActive,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(service.id)}>
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
