import { PageHeader } from '@/components/layout';
import { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  Database,
  Bell,
} from "lucide-react";
import { MetricCard } from "@/components/common";
import { PageTransition } from '@/components/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
  companyName: "",
  currency: "",
  timezone: "",
});

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/settings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setSettings({
        companyName: data.companyName || "",
        currency: data.currency || "",
        timezone: data.timezone || "",
      });
    })
    .catch(console.error);
}, []);

const saveSettings = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

const data = await res.json();

if (data.success) {
    alert("Settings saved successfully!");
} else {
    alert(data.message || "Failed to save settings.");
}
};
  return (
    <PageTransition>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />
      <Card className="mx-6 lg:mx-8 mb-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-50 via-white to-slate-50 shadow-lg">

  <CardContent className="flex items-center justify-between px-10 py-5">

    <div className="max-w-xl">

      <h2 className="text-3xl font-bold text-slate-900">
        Settings
      </h2>

      <p className="mt-3 text-lg text-slate-600">
        Configure your warehouse system, manage security, notifications and application preferences.
      </p>

      <div className="mt-6 flex gap-4">
<Button onClick={saveSettings}>
  Save Changes
</Button>
        <Button variant="outline">
          Reset Settings
        </Button><Button
  variant="outline"
  onClick={() =>
    setSettings({
      companyName: "",
      currency: "",
      timezone: "",
    })
  }
></Button>
      </div>

    </div>

    <img
      src="/images/settings/settings-hero.png"
      alt="Settings"
      className="w-40 h-40 object-contain"
    />

  </CardContent>

</Card>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">

  <MetricCard
    title="Users"
    value="124"
    trend="5 Online"
    trendDirection="up"
    icon={<Users />}
  />

  <MetricCard
    title="Security"
    value="Protected"
    trend="No Threats"
    trendDirection="up"
    icon={<Shield />}
  />

  <MetricCard
    title="Backup"
    value="Daily"
    trend="Healthy"
    trendDirection="up"
    icon={<Database />}
  />

  <MetricCard
    title="Notifications"
    value="12"
    trend="Unread"
    trendDirection="neutral"
    icon={<Bell />}
  />

</div>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="w-full justify-start rounded-2xl bg-slate-100 p-2 border shadow-sm">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card className="rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Global settings for the warehouse management system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
  value={settings.companyName}
  onChange={(e) =>
    setSettings({
      ...settings,
      companyName: e.target.value,
    })
  }
/>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                <Input
  value={settings.currency}
  onChange={(e) =>
    setSettings({
      ...settings,
      currency: e.target.value,
    })
  }
/>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input
  value={settings.timezone}
  onChange={(e) =>
    setSettings({
      ...settings,
      timezone: e.target.value,
    })
  }
/>
                </div>
                <Button
  className="mt-4 rounded-xl px-8"
  onClick={saveSettings}
>
  Save Configuration
</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what events trigger alerts and how they are delivered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when items hit reorder points.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Orders</Label>
                    <p className="text-sm text-muted-foreground">Notify on new incoming sales orders.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">IoT System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical alerts from warehouse sensors.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Daily Summary Email</Label>
                    <p className="text-sm text-muted-foreground">Receive a daily digest of operations.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage security settings and active sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Security settings go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card className="rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with external ERPs and carrier networks.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Integration settings go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
