import { Package2, ChevronLeft, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore, useAuthStore } from '@/store';
import { navigationConfig } from '@/constants';
import { SidebarItem } from './SidebarItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
      className="flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground relative z-20 shrink-0"
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center px-4 shrink-0 border-b border-sidebar-border/50">
        <Package2 className="h-6 w-6 shrink-0 text-sidebar-primary" />
        {!sidebarCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap"
          >
            SWMS
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-6 px-2">
          {navigationConfig.map((group, index) => (
            <div key={index} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <div className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.group}
                </div>
              )}
              {sidebarCollapsed && index > 0 && (
                <div className="mx-3 my-2 h-px bg-sidebar-border/50" />
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.path}
                    name={item.name}
                    path={item.path}
                    icon={item.icon}
                    collapsed={sidebarCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer Area */}
      <div className="p-3 mt-auto border-t border-sidebar-border/50 flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive",
            sidebarCollapsed && "justify-center px-0"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
          {!sidebarCollapsed && <span>Log out</span>}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent z-50 shadow-md"
          onClick={toggleSidebar}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>
    </motion.aside>
  );
}
