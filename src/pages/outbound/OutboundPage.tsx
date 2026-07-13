import { PageHeader, PageToolbar } from '@/components/layout';
import { DataTable, StatusBadge, SearchBox, Pagination } from '@/components/common';
import { PageTransition } from '@/components/animations';
import { Plus, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function OutboundPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const pickOrder = async (id: string) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/${id}/pick`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    fetchOutbound(page, search);
  } catch (err) {
    console.error(err);
  }
};
const bulkPick = async () => {
  const token = localStorage.getItem("token");

  await fetch(
    "http://localhost:5000/api/orders/bulk-pick",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: selected,
      }),
    }
  );

  fetchOutbound(page, search);
};
const createWave = async () => {
  const token = localStorage.getItem("token");

  await fetch(
    "http://localhost:5000/api/orders/wave",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: selected,
      }),
    }
  );

  fetchOutbound(page, search);
};

  const fetchOutbound = async (currentPage = 1, q = "") => {
  setLoading(true);

  const token = localStorage.getItem("token");

  try {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: "10",
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

    const mapped = raw
      .filter((o: any) =>
        ["pending", "processing"].includes(
          (o.status || "").toLowerCase()
        )
      )
      .map((o: any) => ({
        id: o._id,
        woNumber: o.orderNumber || "—",
        destination:
          o.customer?.name ||
          o.customer?.company ||
          o.customer ||
          "—",
        items: Array.isArray(o.items)
          ? o.items.length
          : (o.items ?? 0),
        status: (o.status || "pending").toLowerCase(),
        scheduled: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString()
          : "—",
        carrier: o.carrier || "TBD",
      }));

    setItems(mapped);
    setTotalPages(data.pages || 1);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  fetchOutbound(page, search);
}, [page, search]);

  const handleSearch = (q: string) => { setSearch(q); setPage(1); fetchOutbound(1, q); };

  return (
    <PageTransition>
      <PageHeader title="Outbound Operations" subtitle="Manage picking, packing, and dispatch">
        <Button variant="outline" onClick={bulkPick}>
  <PackageCheck className="h-4 w-4 mr-2" />
  Bulk Pick
</Button>
<Button onClick={createWave}>
  <Plus className="h-4 w-4 mr-2" />
  Create Wave
</Button>
      </PageHeader>
      
     <SearchBox
  placeholder="Search WO or Destination..."
  className="w-[300px]"
  value={search}
  onChange={(e: any) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  }}
/>
      <div className="p-6 lg:px-8">
        <DataTable 
          columns={[
            { header: "Work Order #", accessorKey: "woNumber", className: "font-medium text-primary cursor-pointer hover:underline" },
            { header: "Destination", accessorKey: "destination" },
            { header: "Carrier", accessorKey: "carrier" },
            { header: "Items", accessorKey: "items", className: "text-right" },
            { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
            { header: "Scheduled", accessorKey: "scheduled", className: "text-right" },
            { 
              header: "Action", 
              className: "text-right",
              cell: (item) => item.status === 'pending' || item.status === 'processing' ? 
                <Button
  size="sm"
  variant="secondary"
  onClick={() => pickOrder(item.id)}
>
  Pick Items
</Button> : null
            },
          ]}
          data={items}
          keyExtractor={(item) => item.id}
        />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
      </div>
    </PageTransition>
  );
}
