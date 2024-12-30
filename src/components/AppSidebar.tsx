import { Home, MessageSquare, User, Bell } from "lucide-react";
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

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Complaints",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-navy pt-6">
        <div className="px-6 mb-6">
          <img
            src="/lovable-uploads/7ce98f22-edb3-447e-bced-b38cae04687d.png"
            alt="SoloSolve AI"
            className="h-8"
          />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-gray-300 hover:text-white">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
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