import { Link, useLocation } from 'wouter';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  collapsed: boolean;
}

export function SidebarItem({ name, path, icon: Icon, collapsed }: SidebarItemProps) {
  const [location] = useLocation();
  const isActive = location === path || (path !== '/dashboard' && location.startsWith(path));

  const content = (
    <Link href={path} className={cn(
      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors group relative overflow-hidden",
      isActive 
        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      collapsed ? "justify-center" : "justify-start"
    )}>
      <Icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />
      {!collapsed && <span>{name}</span>}
      {/* Hover slide indicator */}
      {!isActive && !collapsed && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          {name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
