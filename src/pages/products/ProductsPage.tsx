import {
  MetricCard,
  DataTable,
  SearchBox,
  FilterPanel,
  Pagination,
  StatusBadge,
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
  Package,
  Boxes,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { PageHeader, PageToolbar } from '@/components/layout';
import { PageTransition } from '@/components/animations';
import { Plus, Download, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Product } from '@/types/warehouse';
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";



export default function ProductsPage() {
 const [page, setPage] = useState(1);
const [pages, setPages] = useState(1);
const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [categories, setCategories] = useState<string[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [open, setOpen] = useState(false);

const [form, setForm] = useState({
  sku: "",
  name: "",
  category: "",
  price: "",
  description: "",
  minStock: "10",
});

const fetchProducts = async (
    searchText = search,
    currentPage = page,
    currentCategory = category
) => {

    const token = localStorage.getItem("token");

    try {

        const res = await fetch(
            `http://localhost:5000/api/products?page=${currentPage}&search=${searchText}&category=${currentCategory}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        setProducts(data.products || []);
        setPages(data.pages || 1);

    } catch(err){

        console.log(err);

    }

    setLoading(false);

};

const fetchCategories = async()=>{

    const token = localStorage.getItem("token");

    const res = await fetch(
        "http://localhost:5000/api/products/categories",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await res.json();

    setCategories(data.categories || []);

};
const exportCSV = () => {
  const csv = [
    ["SKU", "Name", "Category", "Price", "Stock"],
    ...products.map((p: any) => [
      p.sku,
      p.name,
      p.category,
      p.price,
      p.stock,
    ]),
  ];

  const content = csv.map((row) => row.join(",")).join("\n");

  const blob = new Blob([content], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "products.csv";

  a.click();

  URL.revokeObjectURL(url);
};
const deleteProduct = async (id: string) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchProducts();
};
const addProduct = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sku: form.sku,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        minStock: Number(form.minStock),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setOpen(false);

      setForm({
        sku: "",
        name: "",
        category: "",
        price: "",
        description: "",
        minStock: "10",
      });

      fetchProducts();
    }
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchProducts();
  fetchCategories();
}, []);
if (loading) {
  return <div className="p-8">Loading products...</div>;
}
  return (
    <PageTransition>
      <PageHeader
  title="Products"
  subtitle="Manage, organize and monitor every product across your warehouse network."
>
       <Button
  variant="outline"
  className="rounded-xl"
  onClick={exportCSV}
><Download className="h-4 w-4 mr-2" /> Export</Button>
        <Button
  className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  onClick={() => setOpen(true)}
><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </PageHeader>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Product</DialogTitle>
    </DialogHeader>

<div className="space-y-4">

  <div>
    <Label>SKU</Label>
    <Input
      value={form.sku}
      onChange={(e) =>
        setForm({ ...form, sku: e.target.value })
      }
    />
  </div>

  <div>
    <Label>Product Name</Label>
    <Input
      value={form.name}
      onChange={(e) =>
        setForm({ ...form, name: e.target.value })
      }
    />
  </div>

  <div>
    <Label>Category</Label>
    <Input
      value={form.category}
      onChange={(e) =>
        setForm({ ...form, category: e.target.value })
      }
    />
  </div>

  <div>
    <Label>Price</Label>
    <Input
      type="number"
      value={form.price}
      onChange={(e) =>
        setForm({ ...form, price: e.target.value })
      }
    />
  </div>

  <div>
    <Label>Minimum Stock</Label>
    <Input
      type="number"
      value={form.minStock}
      onChange={(e) =>
        setForm({ ...form, minStock: e.target.value })
      }
    />
  </div>

  <div>
    <Label>Description</Label>
    <Input
      value={form.description}
      onChange={(e) =>
        setForm({ ...form, description: e.target.value })
      }
    />
  </div>

  <Button
    className="w-full"
    onClick={addProduct}
  >
    Save Product
  </Button>

</div>
  </DialogContent>
</Dialog>
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">
  <CardContent className="flex items-center justify-between gap -12 px-10 py-5">
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold text-slate-900">
        Products
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Manage products, categories and stock efficiently across your warehouse.
      </p>
      <div className="mt-6 flex gap-4">
  <Button
  size="lg"
  onClick={() => setOpen(true)}
>
    <Plus className="mr-2 h-5 w-5" />
    Add Product
  </Button>

  <Button
  size="lg"
  variant="outline"
  onClick={exportCSV}
>
    <Download className="mr-2 h-5 w-5" />
    Export
  </Button>
</div>
    </div>

    <motion.img
  src="/images/products/products-hero.png"
  alt="Products"
  className="w-40 h-40 object-contain"
  animate={{ y: [0, -8, 0] }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>

  </CardContent>
</Card>
      <Card className="mx-6 lg:mx-8 mb-6 rounded-2xl shadow-sm">
  <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5">

    <SearchBox
value={search}
onChange={(e:any)=>{

setSearch(e.target.value);

fetchProducts(e.target.value,page,category);

}}
placeholder="Search by SKU, Name, or Category..."
className="lg:w-[420px]"
/>

    <div className="flex gap-3">

      <FilterPanel triggerText="Category">
        <div className="space-y-2">

<Button
variant="ghost"
className="w-full justify-start"
onClick={()=>{
setCategory("");
fetchProducts(search,page,"");
}}
>
All
</Button>

{
categories.map((cat)=>(
<Button

key={cat}

variant="ghost"

className="w-full justify-start"

onClick={()=>{

setCategory(cat);

fetchProducts(search,page,cat);

}}

>

{cat}

</Button>
))
}

</div>
      </FilterPanel>

      <FilterPanel triggerText="Status">
        <div className="text-sm p-2 text-muted-foreground">
          Status filters
        </div>
      </FilterPanel>

    </div>

  </CardContent>
</Card>
      <div className="p-6 lg:px-8">
        
        <DataTable 
          columns={[
            {
  header: "",
  cell: (item: any) => (
    <img
      src={item.image || "/images/products/default-product.png"}
      alt={item.name}
      className="w-12 h-12 rounded-xl object-cover border"
    />
  ),
},
{
  header: "Product",
  cell: (item: any) => (
    <div className="flex items-center gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-xl object-cover border"
      />

      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-xs text-slate-500">{item.sku}</p>
      </div>
    </div>
  ),
},
            {
  header: "Category",
  cell: (item: any) => {
    const colors: Record<string, string> = {
      Electronics: "bg-blue-100 text-blue-700",
      Hardware: "bg-orange-100 text-orange-700",
      Packaging: "bg-purple-100 text-purple-700",
      Safety: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[item.category] || "bg-slate-100 text-slate-700"
        }`}
      >
        {item.category}
      </span>
    );
  },
},
            { header: "Stock", accessorKey: "stock", className: "text-right" },
          
            { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
            { header: "Price", cell: (item) => `$${item.price.toFixed(2)}`, className: "text-right" },
            { 
              header: "", 
              className: "w-10",
                cell: (item: any) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem
  className="text-destructive"
  onClick={() => deleteProduct(item._id)}
><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
          ]}
          data={products}
          keyExtractor={(item: any) => item._id}
        />
        <Pagination currentPage={page} totalPages={pages} onPageChange={(p)=>{

setPage(p);

fetchProducts(search,p,category);

}} className="mt-4" />
      </div>
    </PageTransition>
  );
}
