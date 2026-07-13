import { PageHeader, PageToolbar } from "@/components/layout";
import { DataTable, StatusBadge, SearchBox, Pagination } from "@/components/common";
import { PageTransition } from "@/components/animations";
import { Plus, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InboundShipment } from "@/types/warehouse";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockInbound: InboundShipment[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `${i}`,
  asnNumber: `ASN-${2024000 + i}`,
  supplier: ["Global Mfg", "Tech Parts LLC", "PackCo", "Industrial Supply"][i % 4],
  expectedItems: Math.floor(Math.random() * 500) + 50,
  status: ["pending", "processing", "completed", "error"][i % 4] as any,
  eta: new Date(Date.now() + (Math.random() * 7 - 2) * 86400000).toLocaleDateString(),
  receivedBy: i % 4 === 2 ? "John D." : undefined,
}));

export default function InboundPage() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
  const [inbound, setInbound] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    asnNumber: "",
    supplier: "",
    expectedItems: "",
    eta: "",
  });

  useEffect(() => {
    fetchInbound();
  }, []);

  const fetchInbound = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/inbound", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setInbound(data.inbound || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const addInbound = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/inbound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asnNumber: form.asnNumber,
          supplier: form.supplier,
          expectedItems: Number(form.expectedItems),
          eta: form.eta,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOpen(false);

        setForm({
          asnNumber: "",
          supplier: "",
          expectedItems: "",
          eta: "",
        });

        fetchInbound();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const processInbound = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/inbound/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "completed",
        }),
      });

      fetchInbound();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8">Loading inbound records...</div>;
  }
    return (
    <PageTransition>
      <PageHeader
        title="Inbound Operations"
        subtitle="Manage receiving and putaway"
      >
        <Button variant="outline">
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Receive ASN
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Inbound
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inbound</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <div>
                <Label>ASN Number</Label>
                <Input
                  value={form.asnNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      asnNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Supplier</Label>
                <Input
                  value={form.supplier}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      supplier: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Expected Items</Label>
                <Input
                  type="number"
                  value={form.expectedItems}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expectedItems: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>ETA</Label>
                <Input
                  type="date"
                  value={form.eta}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      eta: e.target.value,
                    })
                  }
                />
              </div>

              <Button
                className="w-full"
                onClick={addInbound}
              >
                Save
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <PageToolbar>
        <SearchBox
          placeholder="Search ASN or Supplier..."
          className="w-[300px]"
        />
      </PageToolbar>

      <div className="p-6 lg:px-8">
        <DataTable
          columns={[
            {
              header: "ASN #",
              accessorKey: "asnNumber",
              className: "font-medium",
            },
            {
              header: "Supplier",
              accessorKey: "supplier",
            },
            {
              header: "Expected Items",
              accessorKey: "expectedItems",
              className: "text-right",
            },
            {
              header: "Status",
              cell: (item: any) => (
                <StatusBadge status={item.status} />
              ),
            },
            {
              header: "ETA / Date",
              accessorKey: "eta",
              className: "text-right",
            },
            {
              header: "Received By",
              cell: (item: any) => item.receivedBy || "-",
            },
            {
              header: "Action",
              className: "text-right",
              cell: (item: any) =>
                item.status === "pending" ||
                item.status === "processing" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      processInbound(item._id || item.id)
                    }
                  >
                    Process
                  </Button>
                ) : (
                  <span className="text-green-600 font-medium">
                    Completed
                  </span>
                ),
            },
          ]}
          data={inbound.length ? inbound : mockInbound}
          keyExtractor={(item: any) => item._id || item.id}
        />

        <Pagination
          currentPage={page}
          totalPages={3}
          onPageChange={setPage}
          className="mt-4"
        />
      </div>
    </PageTransition>
  );
}