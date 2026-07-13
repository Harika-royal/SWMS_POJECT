import { PageHeader, PageToolbar } from '@/components/layout';
import { useEffect, useState } from 'react';
import { PageTransition, StaggerList, StaggerItem } from '@/components/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Package,
  Users,
  Truck,
  Activity,
  Download,
  Calendar as CalendarIcon,
  FileBarChart2,
  DollarSign,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

import { ChartCard } from "@/components/common/ChartCard";
import { MetricCard } from "@/components/common";
import { BarChartWidget } from '@/components/charts/BarChartWidget';

const reportTypes = [
  { id: 'sales', title: 'Sales & Revenue', description: 'Order volume, revenue trends, and customer metrics.', icon: BarChart3 },
  { id: 'inventory', title: 'Inventory Valuation', description: 'Stock levels, valuation, and aging inventory.', icon: Package },
  { id: 'operations', title: 'Operations Efficiency', description: 'Pick/pack times, warehouse utilization.', icon: Activity },
  { id: 'employee', title: 'Employee Performance', description: 'Shift productivity, error rates, and attendance.', icon: Users },
  { id: 'shipment', title: 'Shipment Tracking', description: 'Carrier performance, on-time delivery rates.', icon: Truck },
  { id: 'custom', title: 'Custom Report', description: 'Build a custom report with specific data points.', icon: FileBarChart2 },
];

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 349 },
];

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/reports/sales", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setReport(data);
    })
    .catch(console.error);
}, []);
  return (
    <PageTransition>
      <PageHeader title="Reports" subtitle="Generate and export operational analytics">
        <div className="flex gap-2">
          <Button
  variant="outline"
  className="gap-2"
  onClick={() => {
    alert("Last 30 Days filter coming soon");
  }}
>
            <CalendarIcon className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button
  onClick={() => {
    window.open(
      "http://localhost:5000/api/reports/sales",
      "_blank"
    );
  }}
>
  <Download className="h-4 w-4 mr-2" />
  Export All
</Button>
        </div>
      </PageHeader>
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">

  <CardContent className="flex items-center justify-between px-10 py-5">

    <div className="max-w-xl">

      <h2 className="text-3xl font-bold text-slate-900">
        Reports & Analytics
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Generate business reports, monitor warehouse performance and gain valuable insights.
      </p>

      <div className="mt-6 flex gap-4">

        <Button
  onClick={() => {
    window.open(
      "http://localhost:5000/api/reports/sales",
      "_blank"
    );
  }}
>
  <Download className="mr-2 h-4 w-4" />
  Export Reports
</Button>
        <Button
  variant="outline"
  onClick={() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/reports/sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        alert("Report Generated Successfully");
      });
  }}
>
  Generate Report
</Button>

      </div>

    </div>

    <img
      src="/images/reports/reports-hero.png"
      alt="Reports"
      className="w-40 h-40 object-contain"
    />

  </CardContent>

</Card>
      
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <MetricCard
    title="Reports Generated"
    value={
  report
    ? report.summary.totalOrders.toString()
    : "248"
}
    trend="+18 This Month"
    trendDirection="up"
    icon={<ClipboardList />}
  />

  <MetricCard
    title="Revenue"
    value={
  report
    ? `$${report.summary.totalRevenue.toLocaleString()}`
    : "$2.8M"
}
    trend="+14%"
    trendDirection="up"
    icon={<DollarSign />}
  />

  <MetricCard
    title="Warehouse Efficiency"
    value="96%"
    trend="Excellent"
    trendDirection="up"
    icon={<TrendingUp />}
  />

  <MetricCard
    title="Shipment Success"
    value="98%"
    trend="On Schedule"
    trendDirection="up"
    icon={<Truck />}
  />

</div>
        <StaggerList className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <StaggerItem key={report.id}>
                <Card className="h-full cursor-pointer rounded-3xl border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{report.description}</CardDescription>
                    <Button variant="secondary" size="sm" className="w-full">Generate</Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>

        <ChartCard title="Report Preview: Order Volume" description="Selected period overview">
          <BarChartWidget data={report?.chart || mockChartData} xKey="name" yKey="value" height={350} />
        </ChartCard>
      </div>
    </PageTransition>
  );
}
