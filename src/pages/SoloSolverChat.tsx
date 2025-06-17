
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Search } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  classifications?: any;
  metadata?: any;
}

interface TransactionSearchResult {
  id: string;
  product_title: string;
  complaint_body_text: string;
  inferred_complaint_driver: string;
  rating_review: number;
  timestamp_review_dt: string;
}

export default function SoloSolverChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userId] = useState('AHINNO2AKJKHFW6UMROPGNVDP4ZA'); // Demo user
  const [searchResults, setSearchResults] = useState<TransactionSearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Create chat session
    createChatSession();
    // Add welcome message
    setMessages([{
      id: '1',
      sender: 'bot',
      message: 'Hello! I\'m SoloSolver, your AI customer service assistant. How can I help you today?',
      timestamp: new Date()
    }]);
  }, []);

  const createChatSession = async () => {
    try {
      await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          session_id: sessionId
        });
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-complaint', {
        body: {
          userId,
          complaintText: inputMessage,
          chatHistory: messages.map(m => ({ sender: m.sender, message: m.message })),
          sessionId
        }
      });

      if (error) throw error;

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: data.botMessage,
        timestamp: new Date(),
        classifications: data.classifications,
        metadata: data
      };

      setMessages(prev => [...prev, botMessage]);

      // Show classification insights
      if (data.classifications) {
        const category = data.classifications.complaint_category;
        const sentiment = data.classifications.sentiment;
        if (category !== 'Other' || sentiment === 'very_negative') {
          toast.info(`Detected: ${category} complaint with ${sentiment} sentiment`);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchTransactions = async (query: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('search-transactions', {
        body: {
          userId,
          searchQuery: query,
          limit: 10
        }
      });

      if (error) throw error;

      setSearchResults(data.transactions || []);
      setShowSearch(true);
      
      if (data.insights) {
        toast.success(`Found ${data.insights.totalResults} related transactions`);
      }
    } catch (error) {
      console.error('Error searching transactions:', error);
      toast.error('Failed to search transactions');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">SoloSolver AI Assistant</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4 mr-1" />
            Search History
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {message.sender === 'user' ? 
                      <User className="h-4 w-4 text-white" /> : 
                      <Bot className="h-4 w-4 text-white" />
                    }
                  </div>
                  <Card className={`p-3 ${
                    message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    {message.classifications && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                        <div>Category: {message.classifications.complaint_category}</div>
                        <div>Sentiment: {message.classifications.sentiment}</div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <Card className="p-3 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-500">SoloSolver is thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your complaint or issue..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Sidebar */}
      {showSearch && (
        <div className="w-80 border-l bg-white">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Transaction Search</h2>
            <Input
              placeholder="Search your history..."
              className="mt-2"
              onChange={(e) => {
                if (e.target.value) {
                  searchTransactions(e.target.value);
                }
              }}
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {searchResults.map((result) => (
                <Card key={result.id} className="p-3 cursor-pointer hover:bg-gray-50">
                  <h4 className="font-medium text-sm">{result.product_title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {result.complaint_body_text}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {result.inferred_complaint_driver}
                    </span>
                    <span className="text-xs text-gray-500">
                      Rating: {result.rating_review}/5
                    </span>
                  </div>
                </Card>
              ))}
              {searchResults.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Search your transaction history to find related issues
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
