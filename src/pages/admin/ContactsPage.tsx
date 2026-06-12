import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdminContacts, updateAdminContactStatus } from '@/lib/adminApi';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const statuses = ['new', 'read', 'replied', 'archived'];

export function AdminContactsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['adminContacts'], queryFn: fetchAdminContacts });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateAdminContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContacts'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast({ title: 'Contact updated' });
    },
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contact Inbox</h2>
        <p className="text-muted-foreground">Review and manage inbound project inquiries.</p>
      </div>

      <div className="space-y-4">
        {data?.map((contact) => (
          <div key={contact.id} className="rounded-2xl border border-border bg-background p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{contact.firstName} {contact.lastName}</h3>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
                <p className="text-sm text-muted-foreground">{new Date(contact.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{contact.service}</Badge>
                <Select
                  value={contact.status}
                  onValueChange={(status) => updateMutation.mutate({ id: contact.id, status })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {contact.company && <p className="text-sm"><span className="font-semibold">Company:</span> {contact.company}</p>}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
