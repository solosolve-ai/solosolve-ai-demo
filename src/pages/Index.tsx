import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ComplaintCard } from "@/components/ComplaintCard";

const complaints = [
  {
    title: "Delayed Delivery",
    description: "Package was supposed to arrive yesterday but still hasn't been delivered.",
    status: "in-progress" as const,
    date: "2024-02-20",
  },
  {
    title: "Wrong Item Received",
    description: "I received a different item than what I ordered.",
    status: "new" as const,
    date: "2024-02-19",
  },
  {
    title: "Missing Package",
    description: "My package is marked as delivered but I haven't received it.",
    status: "resolved" as const,
    date: "2024-02-18",
  },
];

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and track customer complaints</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint, index) => (
                <ComplaintCard key={index} {...complaint} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;