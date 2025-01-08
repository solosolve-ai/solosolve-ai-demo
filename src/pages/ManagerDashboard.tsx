import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import DashboardStats from "@/components/DashboardStats";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";

const complaints = [
  {
    id: "COM-001",
    title: "Delayed Delivery",
    description: "Package was supposed to arrive yesterday but still hasn't been delivered.",
    status: "in-progress" as const,
    date: "2024-02-20",
    category: "Delivery",
    priority: "high" as const,
    customerName: "John Doe",
    orderNumber: "ORD-12345",
  },
  {
    id: "COM-002",
    title: "Wrong Item Received",
    description: "I received a different item than what I ordered.",
    status: "new" as const,
    date: "2024-02-19",
    category: "Product",
    priority: "medium" as const,
    customerName: "Jane Smith",
    orderNumber: "ORD-12346",
  },
  {
    id: "COM-003",
    title: "Missing Package",
    description: "My package is marked as delivered but I haven't received it.",
    status: "resolved" as const,
    date: "2024-02-18",
    category: "Delivery",
    priority: "low" as const,
    customerName: "Alice Johnson",
    orderNumber: "ORD-12347",
  },
  {
    id: "COM-004",
    title: "Poor Customer Service",
    description: "The customer service representative was unhelpful and rude.",
    status: "new" as const,
    date: "2024-02-21",
    category: "Service",
    priority: "high" as const,
    customerName: "Bob Wilson",
    orderNumber: "ORD-12348",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    role: "Senior Agent",
    status: "active",
    assignedComplaints: 12,
    resolutionRate: "95%",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Customer Service Agent",
    status: "active",
    assignedComplaints: 8,
    resolutionRate: "88%",
  },
  {
    id: 3,
    name: "Mike Wilson",
    role: "Customer Service Agent",
    status: "away",
    assignedComplaints: 5,
    resolutionRate: "92%",
  },
];

const ManagerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-navy">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
              <p className="text-gray-400 mt-2">Team and Complaint Management Overview</p>
            </header>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-navy-light">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team Management</TabsTrigger>
                <TabsTrigger value="complaints">Complaints</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 bg-navy-light text-white">
                    <Users className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold">Team Members</h3>
                    <p className="text-3xl font-bold mt-2">{teamMembers.length}</p>
                  </Card>
                  <Card className="p-6 bg-navy-light text-white">
                    <UserCheck className="h-8 w-8 mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold">Active Agents</h3>
                    <p className="text-3xl font-bold mt-2">
                      {teamMembers.filter((m) => m.status === "active").length}
                    </p>
                  </Card>
                  <Card className="p-6 bg-navy-light text-white">
                    <UserX className="h-8 w-8 mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Away Agents</h3>
                    <p className="text-3xl font-bold mt-2">
                      {teamMembers.filter((m) => m.status === "away").length}
                    </p>
                  </Card>
                </div>
                <DashboardStats complaints={complaints} />
                <DashboardAnalytics complaints={complaints} />
              </TabsContent>

              <TabsContent value="team">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="p-6 bg-navy-light text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          member.status === "active" ? "bg-green-500" : "bg-yellow-500"
                        }`}>
                          {member.status}
                        </span>
                      </div>
                      <p className="text-gray-400">{member.role}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Assigned Complaints:</span>
                          <span>{member.assignedComplaints}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resolution Rate:</span>
                          <span>{member.resolutionRate}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="complaints">
                <FilterBar
                  onSearchChange={setSearchQuery}
                  onStatusChange={setStatusFilter}
                  onPriorityChange={setPriorityFilter}
                  onCategoryChange={setCategoryFilter}
                  onUrgencyChange={setUrgencyFilter}
                  onChannelChange={setChannelFilter}
                  showPriorityFilter={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredComplaints.map((complaint) => (
                    <ComplaintCard 
                      key={complaint.id} 
                      {...complaint}
                      showPriority={true}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="p-6 bg-navy-light text-white">
                  <h2 className="text-xl font-semibold mb-4">Team Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">Complaint Assignment Rules</h3>
                      <p className="text-gray-400">Configure automatic complaint distribution among team members</p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">Performance Metrics</h3>
                      <p className="text-gray-400">Set KPIs and performance targets for the team</p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">Notification Preferences</h3>
                      <p className="text-gray-400">Manage team notifications and alerts</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboard;