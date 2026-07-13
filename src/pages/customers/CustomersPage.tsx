import { PageHeader, PageToolbar } from '@/components/layout';
import { DataTable, StatusBadge, SearchBox, Pagination } from '@/components/common';
import { PageTransition } from '@/components/animations';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from '@/types/warehouse';
import { useEffect, useState } from 'react';

const mockCustomers: Customer[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i}`,
  company: ['Acme Corp', 'TechFlow Inc', 'Global Logistics', 'NexGen Systems', 'Stark Industries'][i % 5] + ` ${i}`,
  contact: ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams'][i % 4],
  orders: Math.floor(Math.random() * 500) + 10,
  totalSpent: parseFloat((Math.random() * 100000 + 5000).toFixed(2)),
  status: i % 8 === 0 ? 'inactive' : 'active',
  lastOrder: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()
}));

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);

const [search, setSearch] = useState("");

const [form, setForm] = useState({
  company: "",
  contact: "",
});
const createCustomer = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/customers",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: form.company,
        contact: form.contact,
        orders: 0,
        totalSpent: 0,
        status: "active",
        lastOrder: "-",
      }),
    }
  );

  const data = await res.json();

  if (data) {
    setOpen(false);

    setForm({
      company: "",
      contact: "",
    });

    window.location.reload();
  }
};
useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/customers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setCustomers(data.customers || []);
setAllCustomers(data.customers || []);
    })
    .catch(console.error);
}, []);
  return (
  <PageTransition>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

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
            <Label>Primary Contact</Label>
            <Input
              value={form.contact}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={createCustomer}
          >
            Save Customer
          </Button>

        </div>

      </DialogContent>
    </Dialog>
      <PageHeader title="Customers" subtitle="B2B partners and client management">
        <Button
  variant="outline"
  onClick={() => alert("CSV Export coming soon")}
><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
        <Button
  type="button"
  onClick={() => setOpen(true)}
>
  <Plus className="h-4 w-4 mr-2" />
  Add Customer
</Button>
      </PageHeader>
      
      <PageToolbar>
       <SearchBox
  placeholder="Search company or contact..."
  className="w-[300px]"
  value={search}
  onChange={(e) => {
    const value = e.target.value;

    setSearch(value);

    if (!value) {
      setCustomers(allCustomers);
      return;
    }

    const filtered = allCustomers.filter(
      (c: any) =>
        c.company?.toLowerCase().includes(value.toLowerCase()) ||
        c.contact?.toLowerCase().includes(value.toLowerCase())
    );

    setCustomers(filtered);
  }}
/> 
      </PageToolbar>
      
      <div className="p-6 lg:px-8">
        <DataTable 
          columns={[
            { header: "Company", accessorKey: "company", className: "font-medium" },
            { header: "Primary Contact", accessorKey: "contact" },
            { header: "Total Orders", accessorKey: "orders", className: "text-right" },
            { header: "Total Spent", cell: (item) => `$${item.totalSpent.toLocaleString()}`, className: "text-right font-medium" },
            { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
            { header: "Last Order", accessorKey: "lastOrder", className: "text-right text-muted-foreground" },
          ]}
          data={customers.length ? customers : mockCustomers}
          keyExtractor={(item) => item.id}
        />
        <Pagination currentPage={page} totalPages={2} onPageChange={setPage} className="mt-4" />
      </div>
    </PageTransition>
  );
}
