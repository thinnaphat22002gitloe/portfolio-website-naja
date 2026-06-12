import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading || !data) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  const cards = [
    { label: 'Projects', value: data.projectsTotal, hint: `${data.projectsPublished} published` },
    { label: 'Services', value: data.servicesTotal, hint: 'Active offerings' },
    { label: 'New Contacts', value: data.contactsNew, hint: `${data.contactsTotal} total` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your storefront content and inbound leads.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-4xl font-black mt-2">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-2">{card.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
