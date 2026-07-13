export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  price: number;
}

export interface InventoryItem {
  id: string;
  item: string;
  sku: string;
  location: string;
  quantity: number;
  reserved: number;
  available: number;
  lastUpdated: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment: string;
  created: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'pending' | 'shipped' | 'transit' | 'delivered' | 'error';
  eta: string;
  weight: string;
}

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  department: string;
  shift: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface Customer {
  id: string;
  company: string;
  contact: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  lastOrder: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  utilization: number;
  capacity: number;
  zones: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
}

export interface AISInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  metric: string;
  impact: string;
}

export interface IoTSensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'motion' | 'door';
  status: 'online' | 'offline' | 'alert';
  warehouse: string;
  value: string;
  lastReading: string;
}

export interface InboundShipment {
  id: string;
  asnNumber: string;
  supplier: string;
  expectedItems: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  eta: string;
  receivedBy?: string;
}

export interface OutboundShipment {
  id: string;
  woNumber: string;
  destination: string;
  items: number;
  status: 'pending' | 'processing' | 'shipped' | 'error';
  scheduled: string;
  carrier: string;
}
