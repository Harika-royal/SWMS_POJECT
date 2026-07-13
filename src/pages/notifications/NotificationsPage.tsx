import { PageHeader } from '@/components/layout';
import { PageTransition, StaggerList, StaggerItem } from '@/components/animations';
import { useNotificationStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle, XCircle, CheckCircle2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EmptyState } from '@/components/common';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <PageTransition>
      <PageHeader title="Notifications" subtitle={`You have ${unreadCount} unread messages`}>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" /> Mark all as read
          </Button>
        )}
      </PageHeader>
      
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {notifications.length === 0 ? (
          <EmptyState title="All caught up" description="You have no notifications at this time." />
        ) : (
          <StaggerList className="space-y-4">
            {notifications.map((notification) => (
              <StaggerItem key={notification.id}>
                <Card className={`transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}>
                  <CardContent className="p-4 flex gap-4">
                    <div className="mt-1 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="shrink-0"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    </PageTransition>
  );
}
