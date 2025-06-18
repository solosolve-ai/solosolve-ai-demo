
import React, { useState, useRef, useEffect } from 'react';
import { EnhancedPromptInput } from "@/components/EnhancedPromptInput";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { AIAgentProgress } from "@/components/AIAgentProgress";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { LoadingMessage } from "@/components/LoadingMessage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
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
      content: `שלום ${currentUser.name},\n\nברוכים הבאים לשירות לקוחות SoloSolver. אני כאן כדי לסייע לכם עם כל תלונה או דאגה שיש לכם בנוגע לרכישות האחרונות שלכם או חוויות עם השירותים שלנו.\n\nאנא תארו את הבעיה שאתם חווים, ואני אעשה כל שביכולתי כדי לספק לכם פתרון מהיר ומספק.\n\nבברכה,\nצוות שירות הלקוחות SoloSolver`,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
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
        title: 'מנתח את התלונה',
        description: 'משתמש ב-Gemma 3-4B לסיווג סוג התלונה ותחושות',
        status: 'in-progress',
        tools: ['gemma-classifier']
      },
      {
        id: 'search',
        title: 'חיפוש היסטוריית עסקאות',
        description: 'מחפש עסקאות קודמות ותלונות רלוונטיות',
        status: 'pending',
        tools: ['supabase-search']
      },
      {
        id: 'orchestrate',
        title: 'יצירת תגובה',
        description: 'יוצר פתרון מותאם אישית באמצעות Gemini',
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
        content: data.response || "אני מתנצל, אבל אני חווה קשיים טכניים. אנא צור קשר עם צוות התמיכה שלנו ישירות לקבלת סיוע.",
        timestamp: new Date(),
        metadata: {
          classifications: data.classifications,
          searchResults: data.searchResults
        }
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.classifications) {
        toast({
          title: "ניתוח הושלם",
          description: `התלונה סווגה כ: ${data.classifications.complaint_category}`,
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
        content: "לקוח יקר,\n\nאני מתנצל על הקושי הטכני שאנו חווים כעת. הצוות הטכני שלנו קיבל הודעה ופועל לפתרון מהיר של הבעיה.\n\nבינתיים, אנא פנה לצוות שירות הלקוחות שלנו ישירות בכתובת support@company.com או התקשר לקו הסיוע שלנו לקבלת סיוע מיידי.\n\nתודה על הסבלנות וההבנה.\n\nבברכה,\nצוות שירות הלקוחות SoloSolver",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "שגיאת חיבור",
        description: "לא ניתן לעבד את הבקשה. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = () => {
    setShowFeedbackDialog(true);
  };

  const handleFeedbackSubmit = (rating: number, feedback?: string) => {
    console.log('Feedback submitted:', { rating, feedback, sessionId });
    
    toast({
      title: "תודה על הפידבק!",
      description: `דירגת את השירות ${rating}/10. התגובה שלך חשובה לנו.`,
    });
    
    setConversationEnded(true);
    
    // Here you could send the feedback to your backend
    // await supabase.functions.invoke('submit-feedback', { body: { rating, feedback, sessionId } });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900">
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <ChatHeader currentUser={currentUser} sessionId={sessionId} />

        {/* Main Content */}
        <div className="flex-1 flex max-w-6xl mx-auto w-full bg-transparent">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-transparent">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && <LoadingMessage />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* End Conversation Button */}
            {messages.length > 1 && !conversationEnded && (
              <div className="p-4 border-t border-white/20 bg-black/20 backdrop-blur">
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={handleEndConversation}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    סיים שיחה ודרג פתרון
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            {!conversationEnded && (
              <div className="p-4 border-t border-white/20 bg-black/20 backdrop-blur">
                <EnhancedPromptInput
                  placeholder="תאר את התלונה או הבעיה שלך בפירוט..."
                  onSubmit={handleSendMessage}
                  onFileUpload={(files) => handleSendMessage("קבצים הועלו לבדיקה", files)}
                  disabled={isLoading}
                  className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            )}

            {conversationEnded && (
              <div className="p-4 border-t border-white/20 bg-black/20 backdrop-blur">
                <div className="text-center text-white/70">
                  <p>השיחה הסתיימה. תודה שפנית אלינו!</p>
                </div>
              </div>
            )}
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

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default SoloSolverChat;
