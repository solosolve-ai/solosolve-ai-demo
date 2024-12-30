import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";

const complaints = [
  {
    id: "COM-001",
    title: "My Package is Late",
    description: "I was supposed to receive my package yesterday but it hasn't arrived yet. The tracking number shows no updates for 48 hours.",
    status: "new" as const,
    date: "2024-02-21",
    category: "Delivery",
    priority: "medium" as const,
    customerName: "John Smith",
    orderNumber: "ORD-12345"
  },
  {
    id: "COM-002",
    title: "Damaged Product Received",
    description: "The product arrived in damaged condition. The box was crushed and the item inside is broken.",
    status: "in-progress" as const,
    date: "2024-02-20",
    category: "Product",
    priority: "high" as const,
    customerName: "John Smith",
    orderNumber: "ORD-12346"
  },
  {
    id: "COM-003",
    title: "Wrong Item Shipped",
    description: "I received a different item than what I ordered. Need immediate replacement.",
    status: "resolved" as const,
    date: "2024-02-19",
    category: "Product",
    priority: "medium" as const,
    customerName: "John Smith",
    orderNumber: "ORD-12347"
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

  const getStatusCounts = () => {
    const counts = {
      new: 0,
      "in-progress": 0,
      resolved: 0
    };
    complaints.forEach(complaint => {
      counts[complaint.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">New</div>
                <div className="mt-2 text-3xl font-bold text-blue-500">{statusCounts.new}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">In Progress</div>
                <div className="mt-2 text-3xl font-bold text-yellow-500">{statusCounts["in-progress"]}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Resolved</div>
                <div className="mt-2 text-3xl font-bold text-green-500">{statusCounts.resolved}</div>
              </div>
            </div>

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