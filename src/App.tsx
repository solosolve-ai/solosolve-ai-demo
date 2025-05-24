import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserProfile from "./pages/UserProfile";
import UserNotifications from "./pages/UserNotifications";
import UserComplaints from "./pages/UserComplaints";
import SubmitComplaint from "./pages/SubmitComplaint";

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
          <Route path="/user/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;