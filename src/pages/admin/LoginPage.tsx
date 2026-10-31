import { useState } from 'react';
import { Link, Redirect } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';

export function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin@tmrw.unlimited' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'changeme123' : '');
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast({ title: 'Welcome back', description: 'Admin login successful.' });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-6 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#6c63ff]/25 blur-[120px]" />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl space-y-6">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-[#e8405a] flex items-center justify-center shadow-lg shadow-primary/30">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">TMRW UNLIMIT</p>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Manage portfolio content, services, and contact inbox.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </Button>
        </form>

        {import.meta.env.DEV && (
          <p className="text-center text-xs text-muted-foreground rounded-xl border border-dashed border-border p-3">
            Dev mode: credentials come from <code>tmrw-backend/.env</code> (ADMIN_EMAIL / ADMIN_PASSWORD).
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">Back to website</Link>
        </p>
      </div>
    </div>
  );
}
