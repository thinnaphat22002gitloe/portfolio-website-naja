import { useState } from 'react';
import { Link, Redirect, useLocation } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  ExternalLink,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

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

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/contacts', label: 'Contacts', icon: Inbox },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAdminAuth();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? location === '/admin' : location.startsWith(href));

  const nav = (
    <nav className="space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive(href)
              ? 'bg-gradient-to-r from-primary/15 to-transparent text-primary border border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-background/95 backdrop-blur p-5">
        <Brand />
        <div className="mt-8 flex-1">{nav}</div>
        <UserBox email={user?.email} onLogout={logout} />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <aside className="absolute inset-y-0 left-0 w-72 bg-background p-5 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-8 flex-1">{nav}</div>
            <UserBox email={user?.email} onLogout={logout} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <p className="text-sm text-muted-foreground">
                {navItems.find((item) => isActive(item.href))?.label ?? 'Admin'}
              </p>
            </div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>
        <main className="px-6 py-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#e8405a] flex items-center justify-center text-white font-black shadow-lg shadow-primary/30">
        T
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">TMRW Admin</p>
        <p className="font-bold leading-tight">Back Office</p>
      </div>
    </div>
  );
}

function UserBox({ email, onLogout }: { email?: string; onLogout: () => void }) {
  return (
    <div className="rounded-2xl border border-border p-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#00d4ff] flex items-center justify-center text-white text-sm font-bold">
        {(email ?? 'A').charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Signed in</p>
        <p className="text-sm font-medium truncate">{email}</p>
      </div>
      <button onClick={onLogout} title="Logout" className="p-2 rounded-lg hover:bg-muted">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
