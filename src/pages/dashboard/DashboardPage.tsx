import { PageHeader, PageToolbar } from '@/components/layout';
import { useEffect, useState } from "react";
import { MetricCard, ChartCard, DataTable, StatusBadge } from '@/components/common';
import { AreaChartWidget, BarChartWidget } from '@/components/charts';
import { PageTransition, StaggerList, StaggerItem } from '@/components/animations';
import { TrendingUp, ShoppingCart, Truck, Warehouse, Plus, AlertTriangle, Battery, ShieldAlert, Cpu, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/warehouse';
import { useLocation } from "wouter";

const inventoryData = [
  { month: 'Jan', value: 2100000 },
  { month: 'Feb', value: 2250000 },
  { month: 'Mar', value: 2150000 },
  { month: 'Apr', value: 2400000 },
  { month: 'May', value: 2350000 },
  { month: 'Jun', value: 2600000 },
  { month: 'Jul', value: 2550000 },
  { month: 'Aug', value: 2800000 },
  { month: 'Sep', value: 2750000 },
  { month: 'Oct', value: 2900000 },
  { month: 'Nov', value: 2850000 },
  { month: 'Dec', value: 2847392 },
];

const ordersData = [
  { day: 'Mon', orders: 742 },
  { day: 'Tue', orders: 815 },
  { day: 'Wed', orders: 845 },
  { day: 'Thu', orders: 890 },
  { day: 'Fri', orders: 920 },
  { day: 'Sat', orders: 610 },
  { day: 'Sun', orders: 580 },
];

const recentOrders: Order[] = [
  { id: '1', orderNumber: 'ORD-2024-08472', customer: 'Acme Corp', items: 124, total: 14500.50, status: 'processing', payment: 'Paid', created: '2 mins ago' },
  { id: '2', orderNumber: 'ORD-2024-08471', customer: 'TechFlow Inc', items: 45, total: 3200.00, status: 'pending', payment: 'Pending', created: '15 mins ago' },
  { id: '3', orderNumber: 'ORD-2024-08470', customer: 'Global Logistics', items: 890, total: 84000.00, status: 'completed', payment: 'Paid', created: '1 hour ago' },
  { id: '4', orderNumber: 'ORD-2024-08469', customer: 'NexGen Systems', items: 12, total: 850.25, status: 'processing', payment: 'Paid', created: '2 hours ago' },
  { id: '5', orderNumber: 'ORD-2024-08468', customer: 'Stark Industries', items: 250, total: 28500.00, status: 'completed', payment: 'Paid', created: '3 hours ago' },
];

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [dashboard, setDashboard] = useState<any>(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Dashboard API:", data);
      setDashboard(data);
    })
    .catch((err) => console.error(err));
}, []);
  return (
    <PageTransition>
      <PageHeader title="Overview" subtitle="Warehouse performance and real-time metrics">
       <Button onClick={() => navigate("/reports")}>
  <Plus className="h-4 w-4 mr-2" />
  Create Report
</Button>
      </PageHeader>
      
      <div className="p-6 lg:p-8 space-y-6">
        <Card
  className="relative overflow-hidden rounded-3xl h-[280px] bg-cover bg-center border-0"
  style={{
    backgroundImage: "url('/images/warehouse-home.jpg')",
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent"></div>

  <CardContent className="relative z-10 flex h-full flex-col justify-center px-10">
    <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase">
      Smart Warehouse Management System
    </p>

    <h1 className="mt-3 text-5xl font-black text-white">
      Welcome Back 
    </h1>

    <p className="mt-4 max-w-xl text-slate-200 text-lg">
      Monitor inventory, manage shipments, optimize warehouse operations and
      track business performance from one intelligent dashboard.
    </p>

    <div className="mt-8 flex gap-4">
     <Button
  size="lg"
  onClick={() => navigate("/inventory")}
>
  Manage Inventory
</Button>

      <Button
  size="lg"
  variant="secondary"
  onClick={() => navigate("/reports")}
>
  View Reports
</Button>
    </div>
  </CardContent>
</Card>
        <StaggerList className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
  title="Inventory Value"
  value={`$${dashboard?.stats?.inventoryValue?.toLocaleString() ?? "2,847,392"}`}
  trend="+12.3% This Month"
  trendDirection="up"
  icon={<TrendingUp />}
  className="hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-2xl"
/>
        
          <MetricCard 
            title="Orders Today" 
            value={dashboard?.stats?.totalOrders?.toString() ?? "847"}
            trend="94 pending processing" 
            trendDirection="neutral"
            icon={<ShoppingCart />} 
          />
          <MetricCard 
            title="Pending Shipments" 
            value={dashboard?.stats?.pendingShipments?.toString() ?? "234"}
            trend="18 urgent orders" 
            trendDirection="down"
            icon={<Truck />} 
          />
          <MetricCard 
            title="Warehouse Utilization" 
            value={dashboard?.stats?.totalWarehouses?.toString() ?? "73"}
            trend="+2.1% vs last week" 
            trendDirection="up"
            icon={<Warehouse />} 
          />
        </StaggerList>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ChartCard title="Inventory Value (12m)" className="lg:col-span-4">
<AreaChartWidget
  data={dashboard?.inventoryChart || inventoryData}
  xKey="month"
  yKey="value"
/>
          </ChartCard>
          <ChartCard title="Orders (7d)" className="lg:col-span-3">
           <BarChartWidget
  data={dashboard?.ordersChart || ordersData}
  xKey="day"
  yKey="orders"
/>

          </ChartCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={[
                  { header: "Order #", accessorKey: "orderNumber", className: "font-medium" },
                  { header: "Customer", accessorKey: "customer" },
                  { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
                  { header: "Amount", cell: (item) => `$${item.total.toLocaleString()}` },
                  { header: "Time", accessorKey: "created", className: "text-right text-muted-foreground" },
                ]}
                data={(dashboard?.recentOrders || recentOrders) as any[]}
                keyExtractor={(item) => item.id}
              />
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center"><Brain className="h-4 w-4 mr-2 text-primary" /> AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full h-fit"><TrendingUp className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="font-medium">Demand Spike Predicted</p>
                    <p className="text-muted-foreground text-xs mt-1">Electronics category expected to see 25% increase next week.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-full h-fit"><AlertTriangle className="h-4 w-4 text-amber-500" /></div>
                  <div>
                    <p className="font-medium">Reorder Recommendation</p>
                    <p className="text-muted-foreground text-xs mt-1">5 SKUs in Packaging Materials are approaching minimum levels.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center"><Activity className="h-4 w-4 mr-2 text-blue-500" /> IoT Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-red-500" />
                    <span>Forklift A-14</span>
                  </div>
                  <StatusBadge status="error" label="Low Battery" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    <span>Zone C Temp</span>
                  </div>
                  <StatusBadge status="warning" label="High Temp" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-emerald-500" />
                    <span>Conveyor Belt 2</span>
                  </div>
                  <StatusBadge status="success" label="Online" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
