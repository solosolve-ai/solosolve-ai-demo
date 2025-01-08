import { Home, MessageSquare, User, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
      <SidebarContent className="bg-navy pt-6 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="text-gray-300 hover:text-white cursor-pointer transition-all duration-200 hover:bg-navy-light hover:translate-x-1"
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