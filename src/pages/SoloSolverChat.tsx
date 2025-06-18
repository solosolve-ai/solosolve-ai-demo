
import React, { useState, useRef, useEffect } from 'react';
import { PromptInput } from "@/components/PromptInput";
import { AIAgentProgress } from "@/components/AIAgentProgress";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { LoadingMessage } from "@/components/LoadingMessage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AgentTask } from "@/components/AIAgentProgress";
import type { SimulatedUser, ChatMessage as ChatMessageType } from "@/types/chat";

interface SoloSolverChatProps {
  currentUser: SimulatedUser;
}

const SoloSolverChat: React.FC<SoloSolverChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      sender: 'bot',
      content: `Dear ${currentUser.name},\n\nWelcome to SoloSolver Customer Care. I am here to assist you with any complaints or concerns you may have regarding your recent purchases or experiences with our services.\n\nPlease describe the issue you are experiencing, and I will do my best to provide you with a prompt and satisfactory resolution.\n\nBest regards,\nSoloSolver Customer Care Team`,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, files?: FileList) => {
    if (!content.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Initialize agent tasks
    const initialTasks: AgentTask[] = [
      {
        id: 'classify',
        title: 'Analyzing complaint',
        description: 'Using Gemma 3-4B to classify complaint type and sentiment',
        status: 'in-progress',
        tools: ['gemma-classifier']
      },
      {
        id: 'search',
        title: 'Searching transaction history',
        description: 'Finding relevant past transactions and complaints',
        status: 'pending',
        tools: ['supabase-search']
      },
      {
        id: 'orchestrate',
        title: 'Generating response',
        description: 'Creating personalized solution using Gemini',
        status: 'pending',
        tools: ['gemini-orchestrator']
      }
    ];

    setAgentTasks(initialTasks);

    try {
      // Update first task to completed
      setAgentTasks(prev => prev.map(task => 
        task.id === 'classify' 
          ? { ...task, status: 'completed' }
          : task.id === 'search'
          ? { ...task, status: 'in-progress' }
          : task
      ));

      // Simulate some delay for the search
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase.functions.invoke('analyze-complaint', {
        body: {
          userId: currentUser.user_id,
          complaintText: content,
          chatHistory: messages.slice(-5),
          sessionId: sessionId,
          files: files ? Array.from(files) : undefined
        }
      });

      if (error) {
        throw error;
      }

      // Update search task to completed, orchestrate to in-progress
      setAgentTasks(prev => prev.map(task => 
        task.id === 'search' 
          ? { ...task, status: 'completed' }
          : task.id === 'orchestrate'
          ? { ...task, status: 'in-progress' }
          : task
      ));

      // Simulate response generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete all tasks
      setAgentTasks(prev => prev.map(task => 
        task.id === 'orchestrate' 
          ? { ...task, status: 'completed' }
          : task
      ));

      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: data.response || "I apologize, but I'm experiencing technical difficulties. Please contact our support team directly for assistance.",
        timestamp: new Date(),
        metadata: {
          classifications: data.classifications,
          searchResults: data.searchResults
        }
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.classifications) {
        toast({
          title: "Analysis Complete",
          description: `Complaint classified as: ${data.classifications.complaint_category}`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark tasks as failed
      setAgentTasks(prev => prev.map(task => 
        task.status === 'in-progress' || task.status === 'pending'
          ? { ...task, status: 'failed' }
          : task
      ));

      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: "Dear Valued Customer,\n\nI apologize for the technical difficulty we are currently experiencing. Our technical team has been notified and is working to resolve this issue promptly.\n\nIn the meantime, please feel free to contact our customer service team directly at support@company.com or call our helpline for immediate assistance.\n\nThank you for your patience and understanding.\n\nBest regards,\nSoloSolver Customer Care Team",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900">
      <div className="relative z-10 flex flex-col h-screen">
        <ChatHeader currentUser={currentUser} sessionId={sessionId} />

        {/* Main Content */}
        <div className="flex-1 flex max-w-6xl mx-auto w-full">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && <LoadingMessage />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20 bg-black/20 backdrop-blur">
              <PromptInput
                placeholder="Describe your complaint or concern..."
                onSubmit={handleSendMessage}
                onFileUpload={(files) => handleSendMessage("Uploaded files for review", files)}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          {/* Agent Progress Sidebar */}
          {agentTasks.length > 0 && (
            <div className="w-80 border-l border-white/20 bg-black/10 backdrop-blur p-4">
              <AIAgentProgress 
                tasks={agentTasks}
                className="bg-white/10 backdrop-blur border-white/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoloSolverChat;
