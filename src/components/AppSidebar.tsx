import { Home, MessageSquare, User, Bell, LogOut, UserCog, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const userItems = [
  {
    title: "Dashboard",
    path: "/user",
    icon: Home,
  },
  {
    title: "Complaints",
    path: "/user/complaints",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: User,
  },
  {
    title: "Notifications",
    path: "/user/notifications",
    icon: Bell,
  },
];

const managerItems = [
  {
    title: "Dashboard",
    path: "/manager",
    icon: Home,
  },
  {
    title: "Team Management",
    path: "/manager/team",
    icon: Users,
  },
  {
    title: "Complaints Overview",
    path: "/manager/complaints",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    path: "/manager/settings",
    icon: UserCog,
  },
];

const adminItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: Home,
  },
  {
    title: "System Overview",
    path: "/admin/system",
    icon: UserCog,
  },
  {
    title: "User Management",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Complaints Analytics",
    path: "/admin/analytics",
    icon: MessageSquare,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const getItems = () => {
    if (location.pathname.startsWith("/admin")) return adminItems;
    if (location.pathname.startsWith("/manager")) return managerItems;
    return userItems;
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-navy pt-6 flex flex-col h-full">
        <div className="px-6 mb-6">
          <img
            src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
            alt="SoloSolve AI"
            className="h-24"
          />
        </div>
        <SidebarGroup className="flex-grow">
          <SidebarGroupContent>
            <SidebarMenu>
              {getItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="text-gray-300 hover:text-white hover:bg-navy-light transition-colors cursor-pointer"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarFooter className="mt-auto pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-navy-light transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}