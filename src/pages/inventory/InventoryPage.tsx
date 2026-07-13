import { PageHeader, PageToolbar } from '@/components/layout';
import {
  MetricCard,
  DataTable,
  SearchBox,
  FilterPanel,
  Pagination
} from '@/components/common';
import {
  Download,
  RefreshCw,
  Package,
  Boxes,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

import { PageTransition } from '@/components/animations';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';



export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, reserved: 0, available: 0, lowStock: 0 });
const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchInventory = async (currentPage = 1, q = "") => {
  setLoading(true);

  const token = localStorage.getItem("token");

  try {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: "12",
    });

    if (q) params.set("search", q);

    const res = await fetch(
      `http://localhost:5000/api/inventory?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    const raw = Array.isArray(data)
      ? data
      : data.items || [];

    const mapped = raw.map((i: any) => ({
      id: i._id,
      sku: i.productId?.sku || i.sku || "—",
      item: i.productId?.name || i.name || "—",
      location: i.location || "—",
      quantity: i.quantity ?? 0,
      reserved: i.reserved ?? 0,
      available: (i.quantity ?? 0) - (i.reserved ?? 0),
      lastUpdated: i.updatedAt
        ? new Date(i.updatedAt).toLocaleString()
        : "—",
    }));

    setItems(mapped);
    setTotalPages(data.pages || 1);

    const total = mapped.reduce((s: number, x: any) => s + x.quantity, 0);
    const reserved = mapped.reduce((s: number, x: any) => s + x.reserved, 0);
    const lowStock = mapped.filter((x: any) => x.quantity <= 10).length;

    setStats({
      total,
      reserved,
      available: total - reserved,
      lowStock,
    });
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchInventory(page, search); }, [page,search]);

  const handleSearch = (q: string) => { setSearch(q); setPage(1); fetchInventory(1, q); };
const exportInventory = () => {
  const csv = [
    [
      "SKU",
      "Item",
      "Location",
      "Total Qty",
      "Reserved",
      "Available",
      "Last Updated",
    ],

    ...items.map((item: any) => [
      item.sku,
      item.item,
      item.location,
      item.quantity,
      item.reserved,
      item.available,
      item.lastUpdated,
    ]),
  ];

  const content = csv.map((r) => r.join(",")).join("\n");

  const blob = new Blob([content], {
    type: "text/csv",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "inventory-report.csv";
  a.click();

  URL.revokeObjectURL(url);
};
  const uploadCSV = async (file: File) => {
  
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(
      "http://localhost:5000/api/inventory/import",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (data.success) {
      fetchInventory(page, search);
      alert("Inventory imported successfully");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Import failed");
  }
};
  return (
    <PageTransition>
      <PageHeader
  title="Inventory Management"
  subtitle="Monitor, manage and optimize stock levels across all warehouses."
>
        <Button variant="outline" onClick={() => fetchInventory(page, search)}><RefreshCw className="h-4 w-4 mr-2" /> Sync</Button>
        <Button onClick={exportInventory}>
  <Download className="h-4 w-4 mr-2" />
  Export Report
</Button>
      </PageHeader>
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">
  <CardContent className="flex items-center justify-between px-10 py-5">

    <div className="max-w-xl">
      <h2 className="text-3xl font-bold text-slate-900">
        Inventory
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Monitor inventory levels, warehouse locations and stock availability in real time.
      </p>

      <div className="mt-6 flex gap-4">

  <Button onClick={() => fetchInventory(page, search)}>
    <RefreshCw className="mr-2 h-4 w-4" />
    Sync Inventory
  </Button>

  <Button
    variant="outline"
    onClick={exportInventory}
  >
    <Download className="mr-2 h-4 w-4" />
    Export
  </Button>

  <Button
    variant="outline"
    onClick={() => fileInputRef.current?.click()}
  >
    Upload CSV
  </Button>

  <input
    ref={fileInputRef}
    type="file"
    accept=".csv"
    hidden
    onChange={(e) => {
      if (e.target.files?.[0]) {
        uploadCSV(e.target.files[0]);
      }
    }}
  />

</div>
    </div>

    <img
      src="/images/inventory/inventory-hero.png"
      alt="Inventory"
      className="w-44 h-44 object-contain"
    />

  </CardContent>
</Card>
<div className="mx-6 lg:mx-8 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <MetricCard
    title="Total Stock"
    value={loading ? '—' : stats.total.toLocaleString()}
    trend="All warehouses"
    trendDirection="up"
    icon={<Package />}
  />

  <MetricCard
    title="Reserved"
    value={loading ? '—' : stats.reserved.toLocaleString()}
    trend="Pending orders"
    trendDirection="neutral"
    icon={<Boxes />}
  />

  <MetricCard
    title="Available"
    value={loading ? '—' : stats.available.toLocaleString()}
    trend="Ready for Orders"
    trendDirection="up"
    icon={<Warehouse />}
  />

  <MetricCard
    title="Low Stock"
    value={loading ? '—' : stats.lowStock.toLocaleString()}
    trend="Needs Attention"
    trendDirection="down"
    icon={<AlertTriangle />}
  />

</div>
      
      <PageToolbar>
<SearchBox
  placeholder="Search SKU, Item or Warehouse..."
  className="w-[420px]"
  value={search}
  onChange={(e: any) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  }}
/>

        <div className="flex items-center gap-2">
          <FilterPanel triggerText="Location">
            <div className="text-sm p-2 text-muted-foreground">Location filters would go here.</div>
          </FilterPanel>
        </div>
      </PageToolbar>
      
      <div className="p-6 lg:px-8">
        
        <DataTable 
          columns={[
            { header: "SKU", accessorKey: "sku", className: "font-medium" },
            { header: "Item", accessorKey: "item" },
            { header: "Location", accessorKey: "location" },
            { header: "Total Qty", accessorKey: "quantity", className: "text-right font-medium" },
            { header: "Reserved", accessorKey: "reserved", className: "text-right text-amber-600 dark:text-amber-400" },
            { header: "Available", accessorKey: "available", className: "text-right text-emerald-600 dark:text-emerald-400 font-bold" },
            { header: "Last Updated", accessorKey: "lastUpdated", className: "text-right text-muted-foreground text-sm" },
          ]}
          data={items}
          keyExtractor={(item) => item.id}
        />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
      </div>
    </PageTransition>
  );
}
