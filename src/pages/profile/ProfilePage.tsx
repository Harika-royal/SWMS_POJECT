import { PageHeader } from '@/components/layout';
import { PageTransition } from '@/components/animations';
import { useAuthStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
  name: "",
  email: "",
  role: "",
});
useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setForm({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
    }
  };

  fetchProfile();
}, []);
  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
const saveProfile = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      "http://localhost:5000/api/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Profile updated successfully");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};
  return (
    <PageTransition>
      <PageHeader title="Profile" subtitle="Manage your personal information and preferences" />
      
      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
    {initials}
  </AvatarFallback>
</Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
  id="name"
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value,
    })
  }
/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
  id="email"
  type="email"
  value={form.email}
  onChange={(e) =>
    setForm({
      ...form,
      email: e.target.value,
    })
  }
/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
  id="role"
  value={form.role}
  disabled
  className="bg-muted"
/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="Operations" disabled className="bg-muted" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={saveProfile}>
  Save Changes
</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
