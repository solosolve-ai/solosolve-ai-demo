import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import DashboardAnalytics from "@/components/DashboardAnalytics";

const complaints = [
  {
    id: "COM-001",
    title: "Account Access Issues",
    description: "Unable to log into my account after password reset. Need immediate assistance.",
    status: "new" as const,
    date: "2024-02-21",
    category: "Account Management",
    priority: "high" as const,
    customerName: "John Smith",
    orderNumber: "ORD-12345",
    channelOfComplaint: "web"
  },
  {
    id: "COM-002",
    title: "Incorrect Billing Amount",
    description: "Last month's bill shows incorrect charges. Need review and adjustment.",
    status: "in-progress" as const,
    date: "2024-02-20",
    category: "Billing",
    priority: "medium" as const,
    customerName: "Sarah Johnson",
    orderNumber: "ORD-12346",
    channelOfComplaint: "phone"
  },
  {
    id: "COM-003",
    title: "App Crashes Frequently",
    description: "Mobile app keeps crashing when trying to make a payment.",
    status: "new" as const,
    date: "2024-02-19",
    category: "Technical Issues",
    priority: "high" as const,
    customerName: "Mike Brown",
    orderNumber: "ORD-12347",
    channelOfComplaint: "app"
  },
  {
    id: "COM-004",
    title: "Service Interruption",
    description: "Experienced service outage for 2 hours. Need compensation.",
    status: "resolved" as const,
    date: "2024-02-18",
    category: "Service Issues",
    priority: "medium" as const,
    customerName: "Emma Wilson",
    orderNumber: "ORD-12348",
    channelOfComplaint: "email"
  },
  {
    id: "COM-005",
    title: "Defective Product Received",
    description: "The product arrived damaged and unusable.",
    status: "new" as const,
    date: "2024-02-22",
    category: "Product",
    priority: "high" as const,
    customerName: "Alex Turner",
    orderNumber: "ORD-12349",
    channelOfComplaint: "web"
  },
  {
    id: "COM-006",
    title: "Wrong Product Specifications",
    description: "Received a product with different specifications than ordered.",
    status: "in-progress" as const,
    date: "2024-02-22",
    category: "Product",
    priority: "medium" as const,
    customerName: "Lisa Chen",
    orderNumber: "ORD-12350",
    channelOfComplaint: "phone"
  },
  {
    id: "COM-007",
    title: "Payment Gateway Error",
    description: "Unable to complete transaction due to payment system error.",
    status: "new" as const,
    date: "2024-02-23",
    category: "Technical Issues",
    priority: "high" as const,
    customerName: "David Park",
    orderNumber: "ORD-12351",
    channelOfComplaint: "web"
  },
  {
    id: "COM-008",
    title: "Website Loading Issues",
    description: "Website is extremely slow and sometimes unresponsive.",
    status: "new" as const,
    date: "2024-02-23",
    category: "Technical Issues",
    priority: "medium" as const,
    customerName: "Maria Garcia",
    orderNumber: "ORD-12352",
    channelOfComplaint: "web"
  },
  {
    id: "COM-009",
    title: "Mobile App Login Failed",
    description: "Cannot login to mobile app after recent update.",
    status: "new" as const,
    date: "2024-02-23",
    category: "Technical Issues",
    priority: "high" as const,
    customerName: "James Wilson",
    orderNumber: "ORD-12353",
    channelOfComplaint: "app"
  }
];

const UserDashboard = () => {
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
    const matchesChannel = channelFilter === "all" || complaint.channelOfComplaint === channelFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesChannel;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F8FAFC]">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader />
            <div className="grid gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <DashboardStats complaints={complaints} />
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <DashboardAnalytics complaints={complaints} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <FilterBar
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
                onCategoryChange={setCategoryFilter}
                onUrgencyChange={setUrgencyFilter}
                onChannelChange={setChannelFilter}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} {...complaint} />
              ))}
              {filteredComplaints.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No complaints found matching your filters.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;