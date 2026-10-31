import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { fetchAdminProjects, fetchDashboardStats } from '@/lib/adminApi';
import { resolveMediaUrl } from '@/lib/media';
import { ArrowRight, FolderKanban, Inbox, Loader2, Plus, Sparkles, Eye } from 'lucide-react';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['adminDashboard'], queryFn: fetchDashboardStats });
  const { data: projects } = useQuery({ queryKey: ['adminProjects'], queryFn: fetchAdminProjects });

  if (isLoading || !data) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  const cards = [
    { label: 'Projects', value: data.projectsTotal, hint: `${data.projectsPublished} published · ${data.projectsMock ?? 0} sample`, icon: FolderKanban, tone: 'from-primary to-[#e8405a]' },
    { label: 'Published', value: data.projectsPublished, hint: 'Visible on the website', icon: Eye, tone: 'from-emerald-500 to-teal-500' },
    { label: 'Services', value: data.servicesTotal, hint: 'Offerings listed', icon: Sparkles, tone: 'from-[#6c63ff] to-[#00d4ff]' },
    { label: 'New contacts', value: data.contactsNew, hint: `${data.contactsTotal} total messages`, icon: Inbox, tone: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your portfolio content and inbound leads.</p>
        </div>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90">
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, hint, icon: Icon, tone }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tone} opacity-15 blur-xl`} />
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center text-white`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="text-4xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <section className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Projects</h3>
            <Link href="/admin/projects" className="text-sm text-primary inline-flex items-center gap-1">Manage <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {projects?.slice(0, 6).map((project) => (
              <Link key={project.id} href={`/admin/projects/${project.id}`} className="group block rounded-xl overflow-hidden border border-border bg-muted">
                <div className="aspect-[16/10] overflow-hidden">
                  {project.imageUrls[0] && (
                    <img src={resolveMediaUrl(project.imageUrls[0])} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <p className="px-3 py-2 text-xs font-semibold truncate">{project.title}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent messages</h3>
            <Link href="/admin/contacts" className="text-sm text-primary inline-flex items-center gap-1">Inbox <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {data.recentContacts && data.recentContacts.length > 0 ? (
            <ul className="space-y-3">
              {data.recentContacts.map((contact) => (
                <li key={contact.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-muted flex items-center justify-center font-bold text-sm">{contact.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{contact.service} · {new Date(contact.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${contact.status === 'new' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>{contact.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No messages yet. Submissions from the contact form appear here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
