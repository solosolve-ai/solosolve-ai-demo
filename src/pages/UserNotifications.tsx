import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, AlertCircle, Clock } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Complaint Status Updated",
    description: "Your complaint #COM-001 has been marked as 'In Progress'",
    timestamp: "2 hours ago",
    type: "status",
    isRead: false,
  },
  {
    id: 2,
    title: "Response Received",
    description: "Support team has responded to your complaint #COM-002",
    timestamp: "1 day ago",
    type: "response",
    isRead: true,
  },
  {
    id: 3,
    title: "Complaint Resolved",
    description: "Your complaint #COM-004 has been resolved",
    timestamp: "2 days ago",
    type: "resolution",
    isRead: true,
  },
  {
    id: 4,
    title: "New Update Available",
    description: "Additional information is required for complaint #COM-003",
    timestamp: "3 days ago",
    type: "update",
    isRead: false,
  }
];

const UserNotifications = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
          {notifications.filter(n => !n.isRead).length} unread
        </span>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id}
            className={`transition-colors ${!notification.isRead ? 'bg-secondary' : ''}`}
          >
            <CardContent className="flex items-start space-x-4 p-4">
              <div className="mt-1">
                {notification.type === 'status' && <Clock className="h-5 w-5 text-blue-500" />}
                {notification.type === 'response' && <Bell className="h-5 w-5 text-yellow-500" />}
                {notification.type === 'resolution' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {notification.type === 'update' && <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserNotifications;