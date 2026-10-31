import { Route, Router, Switch, useLocation } from 'wouter';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { PublicSite } from '@/pages/PublicSite';
import { AdminLayout, ProtectedRoute } from '@/pages/admin/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/LoginPage';
import { AdminDashboardPage } from '@/pages/admin/DashboardPage';
import { AdminProjectsPage } from '@/pages/admin/ProjectsPage';
import { AdminProjectEditPage } from '@/pages/admin/ProjectEditPage';
import { AdminServicesPage } from '@/pages/admin/ServicesPage';
import { AdminContactsPage } from '@/pages/admin/ContactsPage';
import { AdminSettingsPage } from '@/pages/admin/SettingsPage';
import { AdminMediaPage } from '@/pages/admin/MediaPage';
import { Toaster } from '@/components/ui/toaster';

function AdminToaster() {
  // The public site mounts its own <Toaster />; admin routes need one too.
  const [location] = useLocation();
  return location.startsWith('/admin') ? <Toaster /> : null;
}

function App() {
  const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <AdminAuthProvider>
      <Router base={routerBase}>
        <Switch>
          <Route path="/" component={PublicSite} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin">
            <ProtectedRoute>
              <AdminLayout><AdminDashboardPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/admin/projects">
            <ProtectedRoute>
              <AdminLayout><AdminProjectsPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/admin/projects/:id">
            <ProtectedRoute>
              <AdminLayout><AdminProjectEditPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/admin/services">
            <ProtectedRoute>
              <AdminLayout><AdminServicesPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/admin/contacts">
            <ProtectedRoute>
              <AdminLayout><AdminContactsPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/admin/media">
            <ProtectedRoute>
              <AdminLayout><AdminMediaPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/admin/settings">
            <ProtectedRoute>
              <AdminLayout><AdminSettingsPage /></AdminLayout>
            </ProtectedRoute>
          </Route>
        </Switch>
        <AdminToaster />
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
