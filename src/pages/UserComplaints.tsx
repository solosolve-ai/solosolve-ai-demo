
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const complaints = [
  {
    id: "COM-010",
    title: "Defective Headphones",
    description: "Received headphones with non-functional right ear piece.",
    status: "new" as const,
    date: "2024-02-24",
    category: "Product",
    priority: "high" as const,
    customerName: "Robert Chen",
    orderNumber: "ORD-12354",
    channelOfComplaint: "web"
  },
  {
    id: "COM-011",
    title: "Wrong Product Color",
    description: "Ordered black smartphone case but received blue one.",
    status: "in-progress" as const,
    date: "2024-02-24",
    category: "Product",
    priority: "medium" as const,
    customerName: "Sarah Williams",
    orderNumber: "ORD-12355",
    channelOfComplaint: "app"
  },
  {
    id: "COM-012",
    title: "App Crashes During Checkout",
    description: "Mobile app consistently crashes when trying to complete purchase.",
    status: "new" as const,
    date: "2024-02-24",
    category: "Technical Issues",
    priority: "high" as const,
    customerName: "Michael Thompson",
    orderNumber: "ORD-12356",
    channelOfComplaint: "app"
  },
  {
    id: "COM-013",
    title: "Payment Processing Error",
    description: "Transaction fails with error code 502 during payment confirmation.",
    status: "new" as const,
    date: "2024-02-24",
    category: "Technical Issues",
    priority: "high" as const,
    customerName: "Emily Rodriguez",
    orderNumber: "ORD-12357",
    channelOfComplaint: "web"
  },
  {
    id: "COM-014",
    title: "Login Authentication Failed",
    description: "Cannot login despite correct credentials, system shows error.",
    status: "new" as const,
    date: "2024-02-24",
    category: "Technical Issues",
    priority: "high" as const,
    customerName: "David Kim",
    orderNumber: "ORD-12358",
    channelOfComplaint: "web"
  }
];

const UserComplaints = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <div className="flex gap-4 mb-4">
                <button 
                  onClick={() => navigate('/user')}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                  aria-label="Back to dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Dashboard</span>
                </button>
                
                <button 
                  onClick={() => navigate('/')}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center gap-2 bg-blue-50 border border-blue-200"
                  aria-label="Back to home"
                >
                  <Home className="h-5 w-5" />
                  <span>חזרה לאתר הראשי</span>
                </button>
              </div>
              <h1 className="text-3xl font-bold text-navy">My Complaints</h1>
              <p className="text-gray-600 mt-2">View and manage your complaints</p>
            </header>

            <FilterBar
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onCategoryChange={setCategoryFilter}
              onUrgencyChange={setUrgencyFilter}
              onChannelChange={setChannelFilter}
              showPriorityFilter
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} {...complaint} showPriority />
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

export default UserComplaints;
