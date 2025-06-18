
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { SimulatedUser } from "@/types/chat";

interface ChatHeaderProps {
  currentUser: SimulatedUser;
  sessionId: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ currentUser, sessionId }) => {
  const getBackPath = () => {
    if (currentUser.role === 'admin') return '/admin/dashboard';
    if (currentUser.role === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  return (
    <div className="p-4 border-b border-white/20 bg-black/20 backdrop-blur">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link to={getBackPath()}>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">SoloSolver AI Assistant</h1>
            <p className="text-sm text-white/70">Customer: {currentUser.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/70">Session ID</p>
          <p className="text-xs text-white/50 font-mono">{sessionId}</p>
        </div>
      </div>
    </div>
  );
};
