import { Home, MessageSquare, User, Bell, ArrowLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const items = [
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

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent className="bg-navy pt-6">
        <div className="px-6 mb-6 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Back to main screen"
          >
            <ArrowLeft className="h-5 w-5 text-gray-300 hover:text-white" />
          </button>
          <img
            src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
            alt="SoloSolve AI"
            className="h-24"
          />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}