
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Search, MessageSquare, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIInteraction {
  id: string;
  session_id: string;
  user_id: string;
  complaint_text: string;
  gemma_classifications: any;
  gemma_reasoning: string;
  gemini_response: string;
  gemini_reasoning: string;
  search_results: any;
  created_at: string;
}

interface AIInteractionViewerProps {
  className?: string;
}

export const AIInteractionViewer: React.FC<AIInteractionViewerProps> = ({ className }) => {
  const { data: interactions, isLoading } = useQuery({
    queryKey: ['ai-interactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as AIInteraction[];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const formatClassificationBadge = (value: any, type: string) => {
    if (value === null || value === undefined) return null;
    
    const getColorForType = (type: string, value: any) => {
      switch (type) {
        case 'sentiment':
          if (value === 'positive') return 'bg-green-100 text-green-800';
          if (value === 'negative' || value === 'very_negative') return 'bg-red-100 text-red-800';
          return 'bg-yellow-100 text-yellow-800';
        case 'aggression':
          if (value === 'none' || value === 'low') return 'bg-green-100 text-green-800';
          if (value === 'high') return 'bg-red-100 text-red-800';
          return 'bg-orange-100 text-orange-800';
        case 'status':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Badge className={getColorForType(type, value)}>
        {type}: {String(value)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading AI interactions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Interaction Analysis
        </CardTitle>
        <CardDescription>
          Real-time monitoring of Gemma classifications and Gemini responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {interactions?.map((interaction) => (
            <Card key={interaction.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{interaction.user_id}</Badge>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(interaction.created_at).toLocaleString()}
                      </span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {interaction.session_id.slice(-8)}
                    </Badge>
                  </div>

                  {/* Complaint Text */}
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Original Complaint
                    </h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                      {interaction.complaint_text}
                    </p>
                  </div>

                  <Tabs defaultValue="classifications" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="classifications">Gemma Analysis</TabsTrigger>
                      <TabsTrigger value="search">Search Results</TabsTrigger>
                      <TabsTrigger value="response">Gemini Response</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="classifications" className="space-y-2">
                      {interaction.gemma_classifications ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {formatClassificationBadge(interaction.gemma_classifications.complaint_category, 'category')}
                            {formatClassificationBadge(interaction.gemma_classifications.sentiment, 'sentiment')}
                            {formatClassificationBadge(interaction.gemma_classifications.aggression, 'aggression')}
                            {formatClassificationBadge(interaction.gemma_classifications.is_actionable, 'actionable')}
                          </div>
                          <div className="text-xs">
                            <strong>Decision:</strong> {interaction.gemma_classifications.decision_recommendation}
                          </div>
                          <div className="text-xs">
                            <strong>Refund %:</strong> {interaction.gemma_classifications.refund_percentage}%
                          </div>
                          {interaction.gemma_reasoning && (
                            <div className="text-xs bg-blue-50 p-2 rounded">
                              <strong>Reasoning:</strong> {interaction.gemma_reasoning}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No classification data available</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="search" className="space-y-2">
                      {interaction.search_results && interaction.search_results.length > 0 ? (
                        <div className="space-y-1">
                          {interaction.search_results.slice(0, 3).map((result: any, idx: number) => (
                            <div key={idx} className="text-xs bg-green-50 p-2 rounded">
                              <div><strong>Product:</strong> {result.product_title || 'N/A'}</div>
                              <div><strong>Complaint:</strong> {result.inferred_complaint_driver || 'N/A'}</div>
                              <div><strong>Rating:</strong> {result.rating_review || 'N/A'}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No search results found</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="response" className="space-y-2">
                      <div className="text-xs bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                        {interaction.gemini_response || 'No response generated'}
                      </div>
                      {interaction.gemini_reasoning && (
                        <div className="text-xs bg-yellow-50 p-2 rounded">
                          <strong>Reasoning:</strong> {interaction.gemini_reasoning}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
