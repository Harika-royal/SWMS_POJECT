import { ReactNode } from 'react';
import { Sidebar } from '../sidebar';
import { Navbar } from '../navbar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
