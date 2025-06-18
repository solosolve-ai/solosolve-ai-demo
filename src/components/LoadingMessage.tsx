
import React from 'react';
import { Bot } from "lucide-react";

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-2 max-w-[80%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/20 backdrop-blur text-white">
          <Bot className="h-4 w-4" />
        </div>
        <div className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Processing your request...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
