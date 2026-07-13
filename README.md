# SWMS — Smart Warehouse Management System

A production-ready enterprise React application for managing warehouse operations.

## Tech Stack

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS v4** — utility-first styling
- **wouter** — lightweight routing
- **Zustand** — global state management
- **TanStack Query** — async data management
- **Framer Motion** — animations
- **Recharts** — data visualization
- **shadcn/ui** — component library
- **Lucide React** — icons
- **React Hook Form** + **Zod** — form validation

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

Output is in `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run typecheck
```

## Project Structure

```
src/
├── app/              # App-level providers
├── assets/           # Static assets
├── components/
│   ├── animations/   # Framer Motion animation wrappers
│   ├── cards/        # Card components
│   ├── charts/       # Recharts wrappers
│   ├── common/       # Shared components (StatusBadge, MetricCard, etc.)
│   ├── forms/        # Form components
│   ├── layout/       # AppLayout, PageHeader, PageToolbar
│   ├── navbar/       # Top navigation bar
│   ├── sidebar/      # Collapsible sidebar
│   ├── tables/       # Table components
│   └── ui/           # shadcn/ui primitives
├── constants/        # Navigation config and constants
├── hooks/            # Custom React hooks
├── pages/            # Page components (one per route)
├── routes/           # Route definitions
├── services/         # API service stubs
├── store/            # Zustand state stores
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Pages

| Route | Page |
|-------|------|
| `/dashboard` | Main KPI dashboard with charts |
| `/products` | Product catalog management |
| `/inventory` | Inventory tracking |
| `/warehouse` | Warehouse setup and overview |
| `/inbound` | Inbound shipments (ASN) |
| `/outbound` | Outbound work orders |
| `/orders` | Sales and fulfillment orders |
| `/shipments` | Carrier shipment tracking |
| `/warehouse-map` | Visual warehouse layout |
| `/employees` | Employee management |
| `/customers` | Customer management |
| `/reports` | Analytics and reporting |
| `/ai` | AI insights and recommendations |
| `/iot` | IoT sensor monitoring |
| `/notifications` | Notification center |
| `/profile` | User profile |
| `/settings` | Application settings |
| `/login` | Authentication |

## Features

- **Dark / Light mode** — persisted in localStorage
- **Collapsible sidebar** — icon-only or full expanded mode
- **Animated page transitions** — Framer Motion
- **Responsive layout** — works on desktop and tablet
- **Demo auth** — pre-authenticated as Alex Johnson (no backend required)
- **Realistic placeholder data** — all tables populated with sample warehouse data
- **Code splitting** — lazy-loaded routes for optimal performance

## Deployment

This project can be deployed to any static hosting platform:

- **Vercel**: Connect your repo, set framework to Vite
- **Netlify**: Connect repo, build command `npm run build`, publish dir `dist`
- **GitHub Pages**: Use `vite build` and deploy `dist/`

No environment variables are required for the frontend-only build.

## Future Backend Integration

The `src/services/` and `src/api/` directories are structured for future REST API integration. Zustand stores in `src/store/` are ready to be wired to real API endpoints via TanStack Query hooks.
