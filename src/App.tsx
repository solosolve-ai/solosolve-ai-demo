
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserProfile from "./pages/UserProfile";
import UserNotifications from "./pages/UserNotifications";
import UserComplaints from "./pages/UserComplaints";
import SoloSolverChat from "./pages/SoloSolverChat";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
          <Route path="/user/complaints" element={<UserComplaints />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/chat" element={<SoloSolverChat />} />
        </Routes>
        <Toaster />
        <SonnerToaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
