import { PageHeader, PageToolbar } from '@/components/layout';
import {
  MetricCard,
  DataTable,
  StatusBadge,
  SearchBox,
  Pagination,
} from "@/components/common";
import { PageTransition } from '@/components/animations';
import {
  Plus,
  MapPin,
  Truck,
  Clock3,
  CheckCircle,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shipment } from '@/types/warehouse';
import { useEffect, useState } from 'react';

const mockShipments: Shipment[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i}`,
  trackingNumber: `TRK${Math.floor(Math.random() * 1000000000)}`,
  origin: 'SEA-1',
  destination: ['Chicago, IL', 'New York, NY', 'Austin, TX', 'Miami, FL'][i % 4],
  carrier: ['FedEx', 'UPS', 'DHL', 'XPO Logistics'][i % 4],
  status: ['pending', 'shipped', 'transit', 'delivered', 'error'][i % 5] as any,
  eta: new Date(Date.now() + (Math.random() * 7) * 86400000).toLocaleDateString(),
  weight: `${(Math.random() * 500 + 10).toFixed(1)} lbs`
}));

export default function ShipmentsPage() {
  const [page, setPage] = useState(1);
  const [shipments, setShipments] = useState<Shipment[]>([]);
const [shipmentStats, setShipmentStats] = useState<any>(null);
const [open, setOpen] = useState(false);

const [form, setForm] = useState({
  destination: "",
  carrier: "",
  weight: "",
});
const createShipment = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/shipments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        destination: form.destination,
        carrier: form.carrier,
        weight: form.weight,
        origin: "Warehouse",
        status: "Pending",
      }),
    }
  );

  const data = await res.json();

  if (data.success) {
    setOpen(false);

    setForm({
      destination: "",
      carrier: "",
      weight: "",
    });

    window.location.reload();
  } else {
    alert(data.message);
  }
};
useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/shipments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setShipments(data.shipments || []);
    })
    .catch(console.error);

  fetch("http://localhost:5000/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setShipmentStats(data.stats);
    })
    .catch(console.error);
}, []);

  return (
    <PageTransition>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Shipment</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">

      <div>
        <Label>Destination</Label>
        <Input
          value={form.destination}
          onChange={(e) =>
            setForm({ ...form, destination: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Carrier</Label>
        <Input
          value={form.carrier}
          onChange={(e) =>
            setForm({ ...form, carrier: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Weight</Label>
        <Input
          value={form.weight}
          onChange={(e) =>
            setForm({ ...form, weight: e.target.value })
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={createShipment}
      >
        Save Shipment
      </Button>

    </div>
  </DialogContent>
</Dialog>
      <PageHeader title="Shipments" subtitle="Track outbound freight and carrier logistics">
        <Button onClick={() => setOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  Create Shipment
</Button>
      </PageHeader>
      <div className="mx-6 lg:mx-8 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <MetricCard
    title="Total Shipments"
    value={
  shipmentStats
    ? shipmentStats.pendingShipments + shipments.length
    : "1,286"
}
    trend="+8% This Week"
    trendDirection="up"
    icon={<Package />}
  />

  <MetricCard
    title="In Transit"
    value="248"
    trend="Live Tracking"
    trendDirection="neutral"
    icon={<Truck />}
  />

  <MetricCard
    title="Delivered"
    value="1,008"
    trend="Completed"
    trendDirection="up"
    icon={<CheckCircle />}
  />

  <MetricCard
    title="Delayed"
    value="30"
    trend="Needs Attention"
    trendDirection="down"
    icon={<Clock3 />}
  />

</div>
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">
  <CardContent className="flex items-center justify-between px-10 py-5">

    <div className="max-w-xl">
      <h2 className="text-3xl font-bold text-slate-900">
        Shipments
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Track shipments, monitor deliveries and manage logistics across all carriers.
      </p>

      <div className="mt-6 flex gap-4">

        <Button onClick={() => setOpen(true)}>
  <Plus className="mr-2 h-4 w-4" />
  Create Shipment
</Button>
        <Button
  variant="outline"
  onClick={() => window.location.reload()}
>
  Track All
</Button>
      </div>
    </div>

    <img
      src="/images/shipments/shipments-hero.png"
      alt="Shipments"
      className="w-40 h-40 object-contain"
    />

  </CardContent>
</Card>
      
      <PageToolbar>
        <SearchBox
  placeholder="Search Tracking Number..."
  className="lg:w-[420px]"
/>
      </PageToolbar>
      
      <div className="p-6 lg:px-8">
        <DataTable 
          columns={[
            { header: "Tracking #", accessorKey: "trackingNumber", className: "font-medium font-mono text-xs" },
            { header: "Destination", accessorKey: "destination" },
            { header: "Carrier", accessorKey: "carrier" },
            { header: "Weight", accessorKey: "weight", className: "text-right" },
            { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
            { header: "ETA", accessorKey: "eta", className: "text-right text-muted-foreground" },
            { 
              header: "", 
              className: "w-10",
              cell: () => <Button variant="ghost" size="icon" title="Track"><MapPin className="h-4 w-4" /></Button>
            },
          ]}
         data={shipments.length ? shipments : mockShipments}
          keyExtractor={(item) => item.id}
        />
        <Pagination currentPage={page} totalPages={6} onPageChange={setPage} className="mt-4" />
      </div>
    </PageTransition>
  );
}
