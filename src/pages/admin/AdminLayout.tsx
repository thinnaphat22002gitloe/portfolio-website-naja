import { Link, Redirect } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAdminAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/contacts', label: 'Contacts' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-bold">TMRW Admin</p>
            <h1 className="text-lg font-bold">Content Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Link href="/" className="text-sm text-primary hover:underline">View Site</Link>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-xl border border-transparent hover:border-border hover:bg-background font-medium"
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
