
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
import { useToast } from "@/hooks/use-toast";

const userItems = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: Home,
  },
  {
    title: "SoloSolver Chat",
    path: "/chat",
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
    path: "/manager/dashboard",
    icon: Home,
  },
  {
    title: "SoloSolver Chat",
    path: "/chat",
    icon: MessageSquare,
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
];

const adminItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "SoloSolver Chat",
    path: "/chat",
    icon: MessageSquare,
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
            src="/lovable-uploads/704cd890-e36f-4688-8aa1-a02ffa01eb64.png"
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
