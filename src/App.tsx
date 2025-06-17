
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { WelcomeScreen } from "@/pages/WelcomeScreen";
import { LoginScreen } from "@/pages/LoginScreen";
import Index from "@/pages/Index";
import SoloSolverChat from "@/pages/SoloSolverChat";
import UserDashboard from "@/pages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import UserComplaints from "@/pages/UserComplaints";
import UserNotifications from "@/pages/UserNotifications";
import ManagerDashboard from "@/pages/ManagerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

interface SimulatedUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [currentUser, setCurrentUser] = React.useState<SimulatedUser | null>(null);
  const [showWelcome, setShowWelcome] = React.useState(true);

  const handleUserSelect = (user: SimulatedUser) => {
    setCurrentUser(user);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowWelcome(true);
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          {showWelcome && !currentUser ? (
            <WelcomeScreen onGetStarted={handleGetStarted} />
          ) : !currentUser ? (
            <LoginScreen onUserSelect={handleUserSelect} />
          ) : (
            <Routes>
              <Route path="/" element={<Index currentUser={currentUser} onLogout={handleLogout} />} />
              <Route path="/chat" element={<SoloSolverChat currentUser={currentUser} />} />
              <Route path="/user/dashboard" element={<UserDashboard currentUser={currentUser} />} />
              <Route path="/user/profile" element={<UserProfile currentUser={currentUser} />} />
              <Route path="/user/complaints" element={<UserComplaints />} />
              <Route path="/user/notifications" element={<UserNotifications />} />
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/login" element={<LoginScreen onUserSelect={handleUserSelect} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
