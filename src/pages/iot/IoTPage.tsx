import { PageHeader, PageToolbar } from '@/components/layout';
import { PageTransition, StaggerList, StaggerItem } from '@/components/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, ActivitySquare, DoorOpen, Plus, Wifi, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockSensors = Array.from({ length: 12 }).map((_, i) => {
  const type = ['temperature', 'humidity', 'motion', 'door'][i % 4];
  const isAlert = i === 2 || i === 7;
  const isOffline = i === 11;
  
  return {
    id: `sen-${i}`,
    name: `Sensor ${type.substring(0, 1).toUpperCase()}${type.substring(1)} ${100 + i}`,
    type,
    status: isAlert ? 'alert' : isOffline ? 'offline' : 'online',
    warehouse: ['SEA-1', 'AUS-1', 'CHI-2'][i % 3],
    value: type === 'temperature' ? `${(Math.random() * 10 + 65).toFixed(1)}°F` :
           type === 'humidity' ? `${(Math.random() * 20 + 30).toFixed(1)}%` :
           type === 'motion' ? (isAlert ? 'Motion Detected' : 'Clear') :
           (isAlert ? 'Open' : 'Closed'),
    lastReading: isOffline ? '2 hours ago' : 'Just now'
  };
});

export default function IoTPage() {
  const [sensors, setSensors] = useState<any[]>([]);
const [open, setOpen] = useState(false);

const [form, setForm] = useState({
  name: "",
  type: "temperature",
  warehouse: "",
  value: "",
});
const fetchSensors = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/iot",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  setSensors(data.sensors || []);
};

useEffect(() => {
  fetchSensors();
}, []);
const createSensor = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/iot",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    }
  );

  const data = await res.json();

  if (data.success) {
    setOpen(false);

    setForm({
      name: "",
      type: "temperature",
      warehouse: "",
      value: "",
    });

    fetchSensors();
  }
};
  return (
    <PageTransition>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>

    <DialogHeader>
      <DialogTitle>Add Sensor</DialogTitle>
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
       <Label>Type</Label>

<select
  className="w-full border rounded-md p-2"
  value={form.type}
  onChange={(e) =>
    setForm({ ...form, type: e.target.value })
  }
>
  <option value="temperature">Temperature</option>
  <option value="humidity">Humidity</option>
  <option value="motion">Motion</option>
  <option value="door">Door</option>
</select>
      </div>

      <div>
        <Label>Warehouse</Label>
        <Input
          value={form.warehouse}
          onChange={(e) =>
            setForm({ ...form, warehouse: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Value</Label>
        <Input
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={createSensor}
      >
        Save Sensor
      </Button>

    </div>

  </DialogContent>
</Dialog>
      <PageHeader title="IoT Monitoring" subtitle="Real-time sensor network telemetry">
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Sensor</Button>
      </PageHeader>
      
      <PageToolbar>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1.5 rounded-md">
            <Wifi className="h-4 w-4" /> 9 Sensors Online
          </div>
          <div className="flex items-center gap-2 text-sm bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-3 py-1.5 rounded-md">
            <AlertTriangle className="h-4 w-4" /> 2 Alerts
          </div>
        </div>
      </PageToolbar>
      
      <div className="p-6 lg:p-8">
        <StaggerList className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(sensors.length ? sensors : sensors).map((sensor) => {
            const Icon = 
              sensor.type === 'temperature' ? Thermometer :
              sensor.type === 'humidity' ? Droplets :
              sensor.type === 'motion' ? ActivitySquare : DoorOpen;
              
            const colorClass = 
              sensor.status === 'alert' ? 'text-red-500' : 
              sensor.status === 'offline' ? 'text-muted-foreground' : 'text-primary';

            return (
              <StaggerItem key={sensor.id}>
                <Card className={`relative overflow-hidden ${sensor.status === 'alert' ? 'border-red-500/50 shadow-sm shadow-red-500/10' : ''}`}>
                  {sensor.status === 'alert' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-muted p-2 rounded-md">
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                      </div>
                      <StatusBadge status={sensor.status as any} />
                    </div>
                    <CardTitle className="text-base mt-2">{sensor.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{sensor.warehouse}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <div className={`text-2xl font-bold tracking-tight ${sensor.status === 'alert' ? 'text-red-500' : ''}`}>
                        {sensor.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                        <span>Last reading:</span>
                        <span>{sensor.lastReading}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </PageTransition>
  );
}
