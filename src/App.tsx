import { Suspense, lazy } from 'react';
import { Switch, Route, Router as WouterRouter, Redirect } from 'wouter';
import { Providers } from './app/providers';
import { useAuthStore } from './store';
import NotFound from '@/pages/not-found';
import { Loader2 } from 'lucide-react';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

const LoginPage = lazy(() => import('@/pages/authentication/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/authentication/RegisterPage'));
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));

const ProductsPage = lazy(() => import('@/pages/products/ProductsPage'));
const InventoryPage = lazy(() => import('@/pages/inventory/InventoryPage'));
const WarehousePage = lazy(() => import('@/pages/warehouse/WarehousePage'));
const InboundPage = lazy(() => import('@/pages/inbound/InboundPage'));
const OutboundPage = lazy(() => import('@/pages/outbound/OutboundPage'));
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'));
const ShipmentsPage = lazy(() => import('@/pages/shipments/ShipmentsPage'));
const EmployeesPage = lazy(() => import('@/pages/employees/EmployeesPage'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));
const AIInsightsPage = lazy(() => import('@/pages/ai/AIInsightsPage'));
const IoTPage = lazy(() => import('@/pages/iot/IoTPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

function LoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ProtectedRoute({ component: Component, ...rest }: any) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Component {...rest} />
      </Suspense>
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }
  >
    <LoginPage />
  </Suspense>
</Route>
      <Route path="/login">
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <LoginPage />
        </Suspense>
      </Route>
      <Route path="/register">
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }
  >
    <RegisterPage />
  </Suspense>
</Route>
      
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/products" component={() => <ProtectedRoute component={ProductsPage} />} />
      <Route path="/inventory" component={() => <ProtectedRoute component={InventoryPage} />} />
      <Route path="/warehouse" component={() => <ProtectedRoute component={WarehousePage} />} />
      <Route path="/warehouse-map" component={() => <ProtectedRoute component={WarehousePage} />} />
      <Route path="/inbound" component={() => <ProtectedRoute component={InboundPage} />} />
      <Route path="/outbound" component={() => <ProtectedRoute component={OutboundPage} />} />
      <Route path="/orders" component={() => <ProtectedRoute component={OrdersPage} />} />
      <Route path="/shipments" component={() => <ProtectedRoute component={ShipmentsPage} />} />
      <Route path="/employees" component={() => <ProtectedRoute component={EmployeesPage} />} />
      <Route path="/customers" component={() => <ProtectedRoute component={CustomersPage} />} />
      <Route path="/reports" component={() => <ProtectedRoute component={ReportsPage} />} />
      <Route path="/ai" component={() => <ProtectedRoute component={AIInsightsPage} />} />
      <Route path="/iot" component={() => <ProtectedRoute component={IoTPage} />} />
      <Route path="/notifications" component={() => <ProtectedRoute component={NotificationsPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      
      <Route component={() => <ProtectedRoute component={NotFound} />} />
    </Switch>
  );
}

function App() {
  return (
    <Providers>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </Providers>
  );
}

export default App;
