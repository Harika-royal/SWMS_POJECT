import { PageHeader } from '@/components/layout';
import { MetricCard } from "@/components/common";
import { useLocation } from "wouter";
import {
  MapPin,
  Plus,
  Box,
  Layers,
  ArrowRight,
  Building2,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { PageTransition, StaggerList, StaggerItem } from '@/components/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

const [form, setForm] = useState({
  name: "",
  location: "",
  capacity: "",
  zones: "",
});
const fetchWarehouses = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/warehouses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const raw = Array.isArray(data)
        ? data
        : data.warehouses || [];

      setWarehouses(
        raw.map((w: any) => ({
          id: w._id,
          name: w.name,
          location: w.location || "—",
          utilization: w.utilization ?? 0,
          capacity: w.capacity ?? 0,
          zones: w.zones ?? 0,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
  fetchWarehouses();
}, []);
const addWarehouse = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/warehouses",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        location: form.location,
        capacity: Number(form.capacity),
     zones: form.zones
  .split(",")
  .map((z) => z.trim())
  .filter(Boolean),
      }),
    }
  );

  const data = await res.json();

  if (data.success) {
    setOpen(false);
    fetchWarehouses();
  } else {
    alert(data.message);
  }
};
  const criticalCount = warehouses.filter((w) => w.utilization > 90).length;
  const avgUtilization = warehouses.length
    ? Math.round(warehouses.reduce((s, w) => s + w.utilization, 0) / warehouses.length)
    : 0;

  return (
    <PageTransition>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Warehouse</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">

      <div>
        <Label>Warehouse Name</Label>
        <Input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Location</Label>
        <Input
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Capacity</Label>
        <Input
          type="number"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: e.target.value })
          }
        />
      </div>

      <div>
       <Label>Zones (comma separated)</Label>
        <Input
          type="number"
          value={form.zones}
          onChange={(e) =>
            setForm({ ...form, zones: e.target.value })
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={addWarehouse}
      >
        Save Warehouse
      </Button>

    </div>
  </DialogContent>
</Dialog>
      <PageHeader title="Warehouses" subtitle="Manage facilities and spatial utilization">
        <Button onClick={() => setOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  Add Facility
</Button>
      </PageHeader>
      <div className="mx-6 lg:mx-8 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <MetricCard
    title="Warehouses"
    value={loading ? '—' : warehouses.length.toString()}
    trend="All Active"
    trendDirection="up"
    icon={<Building2 />}
  />

  <MetricCard
    title="Total Capacity"
    value={loading ? '—' : `${warehouses.reduce((s, w) => s + (w.capacity || 0), 0).toLocaleString()} sq ft`}
    trend="Combined"
    trendDirection="up"
    icon={<Package />}
  />

  <MetricCard
    title="Average Utilization"
    value={loading ? '—' : `${avgUtilization}%`}
    trend={avgUtilization < 90 ? "Healthy" : "Near capacity"}
    trendDirection="neutral"
    icon={<TrendingUp />}
  />

  <MetricCard
    title="Critical Warehouses"
    value={loading ? '—' : criticalCount.toString()}
    trend={criticalCount > 0 ? "Needs Attention" : "All Good"}
    trendDirection={criticalCount > 0 ? "down" : "up"}
    icon={<AlertTriangle />}
  />

</div>
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">
  <CardContent className="flex items-center justify-between px-10 py-5">

    <div className="max-w-xl">
      <h2 className="text-3xl font-bold text-slate-900">
        Warehouses
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Manage warehouse facilities, monitor utilization and optimize storage capacity.
      </p>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => setOpen(true)}>
  <Plus className="mr-2 h-4 w-4" />
  Add Warehouse
</Button>

<Button
  variant="outline"
  onClick={() => navigate("/reports")}
>
  View Analytics
</Button>
      </div>
    </div>

    <img
      src="/images/warehouses/warehouses-hero.png"
      alt="Warehouses"
      className="w-40 h-40 object-contain"
    />

  </CardContent>
</Card>
      
      <div className="p-6 lg:p-8">
        <StaggerList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((wh) => (
            <StaggerItem key={wh.id}>
              <Card className="h-full flex flex-col rounded-3xl border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>{wh.name}</span>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/warehouse-map`}><ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {wh.location}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Utilization</span>
                      <span className={wh.utilization > 90 ? "text-red-500 font-bold" : "font-medium"}>
                        {wh.utilization}%
                      </span>
                    </div>
                    <Progress
  value={wh.utilization}
  className={`h-3 ${
    wh.utilization > 90
      ? "[&>div]:bg-red-500"
      : wh.utilization > 75
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-emerald-500"
  }`}
/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="flex flex-col bg-muted/50 p-3 rounded-lg">
                      <span className="text-xs text-muted-foreground flex items-center"><Box className="h-3 w-3 mr-1" /> Capacity</span>
                      <span className="font-bold mt-1">{wh.capacity.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex flex-col bg-muted/50 p-3 rounded-lg">
                      <span className="text-xs text-muted-foreground flex items-center"><Layers className="h-3 w-3 mr-1" /> Zones</span>
                      <span className="font-bold mt-1">{wh.zones} Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </PageTransition>
  );
}
