import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";

const complaints = [
  {
    id: "COM-001",
    title: "My Package is Late",
    description: "I was supposed to receive my package yesterday but it hasn't arrived.",
    status: "new" as const,
    date: "2024-02-21",
    category: "Delivery",
    priority: "medium" as const,
    customerName: "John Smith",
    orderNumber: "ORD-12345"
  }
];

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-navy">My Complaints</h1>
              <p className="text-gray-600 mt-2">Track and manage your complaints</p>
            </header>

            <FilterBar
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onCategoryChange={setCategoryFilter}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} {...complaint} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;