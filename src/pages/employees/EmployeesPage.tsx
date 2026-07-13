import { PageHeader, PageToolbar } from '@/components/layout';
import { DataTable, StatusBadge, SearchBox, FilterPanel, Pagination } from '@/components/common';
import { PageTransition } from '@/components/animations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/warehouse';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockEmployees: Employee[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `${i}`,
  name: ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'][i % 6] + ` ${i}`,
  role: ['Warehouse Operator', 'Forklift Driver', 'Shift Supervisor', 'Logistics Analyst', 'Quality Inspector'][i % 5],
  department: ['Receiving', 'Putaway', 'Picking', 'Shipping', 'Quality Control'][i % 5],
  shift: ['Morning (06:00-14:00)', 'Afternoon (14:00-22:00)', 'Night (22:00-06:00)'][i % 3],
  status: i % 10 === 0 ? 'inactive' : 'active',
  lastActive: new Date(Date.now() - Math.random() * 86400000).toLocaleString()
}));

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);

const [form, setForm] = useState({
  name: "",
  role: "",
  department: "",
  shift: "",
});
const createEmployee = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/employees",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        status: "active",
      }),
    }
  );

  const data = await res.json();

  if (data) {
    setOpen(false);

    setForm({
      name: "",
      role: "",
      department: "",
      shift: "",
    });

    window.location.reload();
  }
};
  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/employees", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setEmployees(data.employees || []);
    })
    .catch((err) => console.error(err));
}, []);

  return (
    <PageTransition>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Employee</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">

      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Role</Label>
        <Input
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Department</Label>
        <Input
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Shift</Label>
        <Input
          value={form.shift}
          onChange={(e) =>
            setForm({ ...form, shift: e.target.value })
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={createEmployee}
      >
        Save Employee
      </Button>

    </div>
  </DialogContent>
</Dialog>
      <PageHeader title="Employees" subtitle="Manage warehouse staff and shifts">
        <Button onClick={() => setOpen(true)}>
  <UserPlus className="h-4 w-4 mr-2" />
  Add Employee
</Button>
      </PageHeader>
      
      <PageToolbar>
        <SearchBox placeholder="Search by name or role..." className="w-[300px]" />
        <div className="flex items-center gap-2">
          <FilterPanel triggerText="Department">
            <div className="text-sm p-2 text-muted-foreground">Department filters...</div>
          </FilterPanel>
          <FilterPanel triggerText="Shift">
            <div className="text-sm p-2 text-muted-foreground">Shift filters...</div>
          </FilterPanel>
        </div>
      </PageToolbar>
      
      <div className="p-6 lg:px-8">
        <DataTable 
          columns={[
            { 
              header: "Employee", 
              className: "font-medium",
              cell: (item) => (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{item.name}</span>
                </div>
              )
            },
            { header: "Role", accessorKey: "role" },
            { header: "Department", accessorKey: "department" },
            { header: "Shift", accessorKey: "shift" },
            { header: "Status", cell: (item) => <StatusBadge status={item.status} /> },
            { header: "Last Active", accessorKey: "lastActive", className: "text-right text-muted-foreground text-sm" },
          ]}
          data={employees.length ? employees : mockEmployees}
          keyExtractor={(item) => item.id}
        />
        <Pagination currentPage={page} totalPages={3} onPageChange={setPage} className="mt-4" />
      </div>
    </PageTransition>
  );
}
