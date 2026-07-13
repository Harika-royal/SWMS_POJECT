import {
  LayoutDashboard,
  Package,
  Boxes,
  Warehouse,
  PackageOpen,
  PackageCheck,
  ClipboardList,
  Truck,
  Map,
  Users,
  UserCheck,
  BarChart3,
  Brain,
  Activity,
  Bell,
  CircleUser,
  Settings
} from 'lucide-react';

export const navigationConfig = [
  {
    group: 'Main',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Products', path: '/products', icon: Package },
      { name: 'Inventory', path: '/inventory', icon: Boxes },
      { name: 'Warehouses', path: '/warehouse', icon: Warehouse },
    ],
  },
  {
    group: 'Operations',
    items: [
      { name: 'Inbound', path: '/inbound', icon: PackageOpen },
      { name: 'Outbound', path: '/outbound', icon: PackageCheck },
      { name: 'Orders', path: '/orders', icon: ClipboardList },
      { name: 'Shipments', path: '/shipments', icon: Truck },
      { name: 'Warehouse Map', path: '/warehouse-map', icon: Map },
    ],
  },
  {
    group: 'People',
    items: [
      { name: 'Employees', path: '/employees', icon: Users },
      { name: 'Customers', path: '/customers', icon: UserCheck },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'AI Insights', path: '/ai', icon: Brain },
      { name: 'IoT Monitoring', path: '/iot', icon: Activity },
    ],
  },
  {
    group: 'System',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Profile', path: '/profile', icon: CircleUser },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];
