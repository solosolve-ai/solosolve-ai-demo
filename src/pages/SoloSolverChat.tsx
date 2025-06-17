
import React, { useState, useEffect } from 'react';
import { PromptInput } from '@/components/PromptInput';
import { AIAgentProgress, AgentTask } from '@/components/AIAgentProgress';
import { BeamsBackground } from '@/components/BeamsBackground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, User, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  agentData?: any;
  files?: FileList;
}

const SoloSolverChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: 'Hello! I\'m SoloSolver AI, your complaint resolution assistant. I can analyze your complaints using advanced AI and search through your transaction history. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);

  // Mock user ID - replace with real auth
  const userId = "test_user_123";

  const initializeAgentTasks = (): AgentTask[] => [
    {
      id: '1',
      title: 'Analyzing complaint with Gemma 3-4B',
      description: 'Classifying complaint into categories and detecting sentiment',
      status: 'pending',
      tools: ['gemma-classifier']
    },
    {
      id: '2', 
      title: 'Searching transaction history',
      description: 'Finding relevant past transactions and complaints',
      status: 'pending',
      tools: ['supabase-search']
    },
    {
      id: '3',
      title: 'Generating response with Gemini',
      description: 'Creating personalized response based on analysis',
      status: 'pending',
      tools: ['gemini-orchestrator']
    }
  ];

  const updateTaskStatus = (taskId: string, status: AgentTask['status']) => {
    setAgentTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleSendMessage = async (messageContent: string, files?: FileList) => {
    if (!messageContent.trim() && !files) return;
    
    setIsLoading(true);
    
    // Initialize agent tasks
    const tasks = initializeAgentTasks();
    setAgentTasks(tasks);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageContent,
      timestamp: new Date(),
      files
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Step 1: Analyze complaint with Gemma (via analyze-complaint function)
      updateTaskStatus('1', 'in-progress');
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-complaint', {
        body: { 
          userId,
          complaintText: messageContent,
          deepSearchActive: true
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        updateTaskStatus('1', 'failed');
        throw new Error('Failed to analyze complaint');
      }

      updateTaskStatus('1', 'completed');
      
      // Step 2: Search transactions
      updateTaskStatus('2', 'in-progress');
      
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-transactions', {
        body: {
          userId,
          searchQuery: messageContent,
          category: analysisData?.classifications?.complaint_category || 'all',
          timeRange: '30'
        }
      });

      if (searchError) {
        console.error('Search error:', searchError);
        updateTaskStatus('2', 'failed');
      } else {
        updateTaskStatus('2', 'completed');
        setSearchResults(searchData?.transactions || []);
        
        // Show search results in sidebar
        if (searchData?.transactions?.length > 0) {
          setShowSearchSidebar(true);
          toast({
            title: "Found Related History",
            description: `Found ${searchData.transactions.length} related transactions`,
          });
        }
      }

      // Step 3: Generate final response
      updateTaskStatus('3', 'in-progress');
      
      // Simulate response generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: `I've analyzed your complaint and found it relates to **${analysisData?.classifications?.complaint_category || 'general service'}** issues. Based on your transaction history, I can see patterns that help me provide a more personalized response.

**Analysis Results:**
- Category: ${analysisData?.classifications?.complaint_category || 'Unknown'}
- Sentiment: ${analysisData?.classifications?.sentiment || 'Neutral'}
- Priority: ${analysisData?.classifications?.priority || 'Medium'}
- Recommendation: ${analysisData?.classifications?.recommendation || 'Standard resolution process'}

${searchData?.transactions?.length > 0 ? `I found ${searchData.transactions.length} related transactions in your history which I've considered in my response.` : ''}

How would you like me to proceed with resolving this issue?`,
        timestamp: new Date(),
        agentData: analysisData
      };

      setMessages(prev => [...prev, botMessage]);
      updateTaskStatus('3', 'completed');

      // Show classification results as toast
      if (analysisData?.classifications) {
        toast({
          title: "Complaint Classified",
          description: `Category: ${analysisData.classifications.complaint_category}, Sentiment: ${analysisData.classifications.sentiment}`,
        });
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      // Mark all remaining tasks as failed
      setAgentTasks(prev => prev.map(task => 
        task.status === 'pending' || task.status === 'in-progress' 
          ? { ...task, status: 'failed' } 
          : task
      ));

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: 'I apologize, but I encountered an error while processing your complaint. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Processing Error",
        description: "Failed to process your complaint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (files: FileList) => {
    const fileNames = Array.from(files).map(f => f.name).join(', ');
    toast({
      title: "Files Uploaded",
      description: `Uploaded: ${fileNames}`,
    });
  };

  return (
    <BeamsBackground>
      <div className="min-h-screen flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/user')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">SoloSolver AI</h1>
                <p className="text-sm text-gray-600">AI-Powered Complaint Resolution</p>
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearchSidebar(!showSearchSidebar)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search History
                </Button>
              </div>
            </div>
          </div>

          {/* Messages and Agent Progress */}
          <div className="flex-1 flex gap-4 p-4 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <Card className={`max-w-md p-3 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/90 backdrop-blur-sm border'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      {message.files && (
                        <div className="mt-2 text-xs opacity-75">
                          📎 {Array.from(message.files).map(f => f.name).join(', ')}
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Card>

                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border">
                <PromptInput
                  onSubmit={handleSendMessage}
                  onFileUpload={handleFileUpload}
                  disabled={isLoading}
                  placeholder="Describe your complaint or upload relevant files..."
                />
              </div>
            </div>

            {/* Agent Progress Sidebar */}
            {agentTasks.length > 0 && (
              <div className="w-80">
                <AIAgentProgress tasks={agentTasks} className="bg-white/90 backdrop-blur-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Search Results Sidebar */}
        {showSearchSidebar && (
          <div className="w-80 bg-white/90 backdrop-blur-sm border-l p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSearchSidebar(false)}>
                ×
              </Button>
            </div>
            <div className="space-y-3 overflow-y-auto">
              {searchResults.map((result, index) => (
                <Card key={index} className="p-3">
                  <div className="text-sm font-medium truncate">
                    {result.complaint_body_text || 'Transaction'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Category: {result.inferred_complaint_driver || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp_review_dt || result.timestamp_review).toLocaleDateString()}
                  </div>
                </Card>
              ))}
              {searchResults.length === 0 && (
                <p className="text-gray-600 text-sm">No related transactions found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </BeamsBackground>
  );
};

export default SoloSolverChat;
