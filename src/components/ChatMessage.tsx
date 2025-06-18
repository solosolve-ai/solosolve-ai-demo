
import React from 'react';
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.sender === 'user' 
            ? 'bg-purple-600 text-white' 
            : 'bg-white/20 backdrop-blur text-white'
        }`}>
          {message.sender === 'user' ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <div className={`p-4 rounded-lg ${
          message.sender === 'user'
            ? 'bg-purple-600 text-white border border-purple-500'
            : 'bg-white/10 backdrop-blur border border-white/20 text-white'
        }`}>
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          <div className="mt-2 text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
