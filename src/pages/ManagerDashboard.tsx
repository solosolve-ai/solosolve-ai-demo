import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";

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

const ManagerDashboard = () => {
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
              <h1 className="text-3xl font-bold text-navy">Manager Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor complaint trends and team performance</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Total Complaints</h3>
                  <p className="mt-2 text-3xl font-semibold">{complaints.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Average Resolution Time</h3>
                  <p className="mt-2 text-3xl font-semibold">2.5d</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Customer Satisfaction</h3>
                  <p className="mt-2 text-3xl font-semibold">4.2/5</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Resolution Rate</h3>
                  <p className="mt-2 text-3xl font-semibold">92%</p>
                </div>
              </div>
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

export default ManagerDashboard;
