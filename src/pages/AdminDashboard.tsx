import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import DashboardStats from "@/components/DashboardStats";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    channelOfComplaint: "web",
    urgencyLevel: "high" as const,
    sentimentScore: -0.8,
    feedbackRating: 2,
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

const AdminDashboard = () => {
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
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-2">System-wide Complaint Management</p>
            </header>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-navy-light">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="complaints">Complaints</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <DashboardStats complaints={complaints} />
                <DashboardAnalytics complaints={complaints} />
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

              <TabsContent value="analytics">
                <div className="bg-navy-light p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">Advanced Analytics</h2>
                  <DashboardAnalytics complaints={complaints} />
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="bg-navy-light p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-white mb-4">System Settings</h2>
                  <p className="text-gray-400">Configure system-wide settings and integrations.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
