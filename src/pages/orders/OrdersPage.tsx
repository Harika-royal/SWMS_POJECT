import { Card, CardContent } from "@/components/ui/card";
import {
  MetricCard,
  DataTable,
  StatusBadge,
  SearchBox,
  FilterPanel,
  Pagination,
} from "@/components/common";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Download,
  FileText,
  ShoppingCart,
  Clock3,
  Truck,
  DollarSign,
} from "lucide-react";
import { PageHeader, PageToolbar } from '@/components/layout';
import { PageTransition } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState({ total: 0, pending: 0, shipped: 0, revenue: 0 });
const [open, setOpen] = useState(false);

const [form, setForm] = useState({
  customerName: "",
  customerEmail: "",
  company: "",
  paymentMethod: "Cash",
});
const fetchOrders = async (currentPage = 1, q = "") => {
  setLoading(true);

  const token = localStorage.getItem("token");

  try {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: "15",
    });

    if (q) params.set("search", q);

    const res = await fetch(
      `http://localhost:5000/api/orders?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    const raw = Array.isArray(data)
      ? data
      : data.orders || [];

    const mapped = raw.map((o: any) => ({
      id: o._id,
      orderNumber: o.orderNumber || "—",
      customer:
        o.customer?.name ||
        o.customer?.company ||
        o.customer ||
        "—",
      items: Array.isArray(o.items)
        ? o.items.length
        : (o.items ?? 0),
      total: Number(o.total || 0),
      status: (o.status || "pending").toLowerCase(),
      payment:
        o.payment?.method ||
        o.payment?.status ||
        o.payment ||
        "N/A",
      created: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString()
        : "—",
    }));

    setOrders(mapped);
    setTotalPages(data.pages || 1);

    const total = data.total || raw.length;
    const pending = mapped.filter(
      (o: any) =>
        o.status === "pending" ||
        o.status === "processing"
    ).length;

    const shipped = mapped.filter(
      (o: any) =>
        o.status === "completed" ||
        o.status === "delivered"
    ).length;

    const revenue = mapped.reduce(
      (s: number, o: any) => s + o.total,
      0
    );

    setSummary({
      total,
      pending,
      shipped,
      revenue,
    });

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchOrders(page, search); }, [page,search]);

  const handleSearch = (q: string) => { setSearch(q); setPage(1); };
  const createOrder = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: {
            name: form.customerName,
            email: form.customerEmail,
            company: form.company,
          },
          items: [],
          payment: {
            method: form.paymentMethod,
          },
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setOpen(false);

      setForm({
        customerName: "",
        customerEmail: "",
        company: "",
        paymentMethod: "Cash",
      });

      fetchOrders(page, search);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
  <PageTransition>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Customer Name</Label>
            <Input
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.customerEmail}
              onChange={(e) =>
                setForm({ ...form, customerEmail: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Company</Label>
            <Input
              value={form.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <Input
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            />
          </div>

          <Button className="w-full" onClick={createOrder}>
            Save Order
          </Button>

        </div>
      </DialogContent>
    </Dialog>

    <PageHeader title="Orders" subtitle="Sales and fulfillment orders">

      <Button
        variant="outline"
        onClick={() => alert("Export coming soon")}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      </PageHeader>
      <div className="mx-6 lg:mx-8 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <MetricCard
    title="Total Orders"
    value={loading ? '—' : summary.total.toLocaleString()}
    trend="All time"
    trendDirection="up"
    icon={<ShoppingCart />}
  />

  <MetricCard
    title="Pending"
    value={loading ? '—' : summary.pending.toLocaleString()}
    trend="Processing"
    trendDirection="neutral"
    icon={<Clock3 />}
  />

  <MetricCard
    title="Completed"
    value={loading ? '—' : summary.shipped.toLocaleString()}
    trend="Fulfilled"
    trendDirection="up"
    icon={<Truck />}
  />

  <MetricCard
    title="Revenue"
    value={loading ? '—' : `$${summary.revenue.toLocaleString()}`}
    trend="This page"
    trendDirection="up"
    icon={<DollarSign />}
  />

</div>
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">
  <CardContent className="flex items-center justify-between px-10 py-5">

    <div className="max-w-xl">
      <h2 className="text-3xl font-bold text-slate-900">
        Orders
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Track customer orders, monitor fulfillment and manage order processing efficiently.
      </p>

      <div className="mt-6 flex gap-4">
<Button onClick={() => setOpen(true)}>
  <Plus className="mr-2 h-4 w-4" />
  New Order
</Button>

        <Button
  variant="outline"
  onClick={() => alert("Export feature coming soon")}
>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>

    <img
      src="/images/orders/orders-hero.png"
      alt="Orders"
      className="w-40 h-40 object-contain"
    />

  </CardContent>
</Card>
      <PageToolbar>

<SearchBox
  placeholder="Search Order # or Customer..."
  className="w-[300px]"
  value={search}
  onChange={(e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchOrders(1, value);
  }}
/>
        <div className="flex items-center gap-2">
          <FilterPanel triggerText="Status">
            <div className="text-sm p-2 text-muted-foreground">Status filters...</div>
          </FilterPanel>
        </div>
      </PageToolbar>
      
      <div className="p-6 lg:px-8">
        <DataTable 
          columns={[
            { header: "Order #", accessorKey: "orderNumber", className: "font-medium" },
            { header: "Customer", accessorKey: "customer" },
            { header: "Items", accessorKey: "items", className: "text-right" },
            { header: "Total", cell: (item) => `$${item.total.toLocaleString()}`, className: "text-right font-medium" },
            { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
            { header: "Payment", cell: (item) => (
                <span className={item.payment?.toLowerCase() === "paid" ? 'text-emerald-600' : item.payment?.toLowerCase() === "failed" ? 'text-red-600' : ''}>
                  {item.payment}
                </span>
              ) 
            },
            { header: "Date", accessorKey: "created", className: "text-right text-muted-foreground" },
            { 
              header: "", 
              className: "w-10",
              cell: (item) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => alert(`Invoice: ${item.orderNumber}`)}
  >
    <FileText className="h-4 w-4" />
  </Button>
)
            },
          ]}
          data={orders}
          keyExtractor={(item) => item.id}
        />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
      </div>
    </PageTransition>
  );
}
