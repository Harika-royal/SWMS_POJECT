import { useLocation, Link } from 'wouter';
import { Bell, Sun, Moon, Plus } from 'lucide-react';
import { useAuthStore, useThemeStore, useNotificationStore } from '@/store';
import { SearchBox } from '@/components/common/SearchBox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { navigationConfig } from '@/constants';

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  // Find current page title for breadcrumb
  let currentGroup = '';
  let currentPage = 'Dashboard';
  
  for (const group of navigationConfig) {
    const item = group.items.find(i => location.startsWith(i.path));
    if (item) {
      currentGroup = group.group;
      currentPage = item.name;
      break;
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-background px-6 shadow-sm">
      {/* Left: Breadcrumb */}
      <div className="flex flex-1 items-center gap-2 font-medium">
        <span className="text-muted-foreground hidden sm:inline-block">{currentGroup}</span>
        <span className="text-muted-foreground hidden sm:inline-block">/</span>
        <span className="text-foreground">{currentPage}</span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-md hidden md:flex">
        <SearchBox 
          placeholder="Search products, orders, shipments..." 
          className="w-full bg-muted/40"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:flex h-9 gap-1 bg-muted/40">
              <Plus className="h-4 w-4" />
              <span>New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>New Order</DropdownMenuItem>
            <DropdownMenuItem>New Shipment</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Add Product</DropdownMenuItem>
            <DropdownMenuItem>Add Employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-background">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
          {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user ? getInitials(user.name) : 'US'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
