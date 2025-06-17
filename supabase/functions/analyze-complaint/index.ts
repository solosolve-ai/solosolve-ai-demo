
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gemma 3-4B Classification Labels
const COMPLAINT_CATEGORIES = ["Sizing Issue", "Damaged Item", "Not as Described", "Shipping Problem", "Policy Inquiry", "Late Delivery", "Wrong Item Received", "Quality Issue", "Return Process Issue", "Other", "N/A"];
const DECISION_TYPES = ["Full_Refund_No_Return", "Full_Refund_With_Return", "Partial_Refund_No_Return", "Partial_Refund_With_Return", "Exchange_Offered", "Deny_Request_Policy_Violation", "Further_Information_Required", "Escalate_To_Human_Agent", "Provide_Policy_Information", "Other", "N/A"];
const EMOTIONAL_TONES = ["Empathetic_Standard", "Neutral_Direct", "Understanding_Apologetic", "Firm_Polite", "Helpful_Informative", "Other", "N/A"];
const SENTIMENT_CATEGORIES = ["positive", "neutral", "negative", "mixed", "very_negative", "N/A"];
const AGGRESSION_LEVELS = ["none", "low", "medium", "high", "N/A"];

// Simulate Gemma 3-4B classifications (in production, this would call the actual model)
function simulateGemmaClassification(complaintText: string) {
  // This is a simplified simulation - in production you'd call the actual Gemma model
  return {
    is_actionable: "True",
    complaint_category: complaintText.toLowerCase().includes('broke') ? "Quality Issue" : 
                      complaintText.toLowerCase().includes('shipping') ? "Shipping Problem" : "Other",
    decision_recommendation: "Further_Information_Required",
    info_complete: "False",
    tone: "Empathetic_Standard",
    refund_percentage: "50",
    sentiment: complaintText.toLowerCase().includes('angry') ? "very_negative" : "negative",
    aggression: "low"
  };
}

async function searchUserTransactions(supabase: any, userId: string, searchQuery?: string) {
  let query = supabase
    .from('transaction_history')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp_review', { ascending: false })
    .limit(10);

  if (searchQuery) {
    query = query.textSearch('complaint_body_text', searchQuery);
  }

  const { data, error } = await query;
  return { data: data || [], error };
}

async function generateUserProfile(supabase: any, userId: string) {
  const { data: transactions } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('user_id', userId);

  if (!transactions?.length) {
    return "New customer with no previous transaction history.";
  }

  const avgRating = transactions.reduce((acc: number, t: any) => acc + (t.rating_review || 0), 0) / transactions.length;
  const complaintCount = transactions.length;
  const commonCategories = [...new Set(transactions.map((t: any) => t.inferred_complaint_driver).filter(Boolean))];

  return `Customer Profile: ${complaintCount} previous transactions, average rating ${avgRating.toFixed(1)}, common complaint categories: ${commonCategories.slice(0, 3).join(', ')}`;
}

async function callGeminiOrchestrator(
  chatHistory: string,
  currentInput: string,
  gemmaClassifications: any,
  userProfile: string,
  transactionContext: string
) {
  const prompt = `
You are "SoloSolver", a customer support AI assistant. Analyze the conversation and provide a helpful response.

**CONTEXT:**
Current message: "${currentInput}"
Chat history: ${chatHistory}

**AI Analysis:**
- Complaint category: ${gemmaClassifications.complaint_category}
- Recommended action: ${gemmaClassifications.decision_recommendation}
- Sentiment: ${gemmaClassifications.sentiment}
- Suggested tone: ${gemmaClassifications.tone}

**Customer Context:**
${userProfile}

**Transaction History:**
${transactionContext}

Provide a helpful, empathetic response that addresses the customer's concern. If more information is needed, ask specific questions. Be professional and solution-focused.
`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + Deno.env.get('GEMINI_API_KEY'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I'm having trouble processing your request right now. Please try again.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, complaintText, chatHistory = [], sessionId } = await req.json();

    if (!userId || !complaintText) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or complaintText' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Search user transaction history
    const { data: transactions } = await searchUserTransactions(supabase, userId, complaintText);
    
    // 2. Generate user profile summary
    const userProfile = await generateUserProfile(supabase, userId);
    
    // 3. Classify with Gemma 3-4B (simulated)
    const gemmaClassifications = simulateGemmaClassification(complaintText);
    
    // 4. Format context
    const chatHistoryStr = chatHistory.map((msg: any) => `${msg.sender}: ${msg.message}`).join('\n');
    const transactionContext = transactions.length > 0 
      ? `Recent transactions: ${transactions.slice(0, 3).map((t: any) => `${t.product_title} - ${t.inferred_complaint_driver}`).join(', ')}`
      : 'No recent transactions found.';
    
    // 5. Call Gemini 2.5 Flash orchestrator
    const botResponse = await callGeminiOrchestrator(
      chatHistoryStr,
      complaintText,
      gemmaClassifications,
      userProfile,
      transactionContext
    );

    // 6. Store conversation in database
    if (sessionId) {
      // Store user message
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender: 'user',
          message: complaintText,
          metadata: { user_id: userId }
        });

      // Store bot response
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender: 'bot',
          message: botResponse,
          classifications: gemmaClassifications,
          metadata: { 
            user_profile: userProfile,
            transaction_context: transactionContext
          }
        });
    }

    return new Response(
      JSON.stringify({
        botMessage: botResponse,
        classifications: gemmaClassifications,
        userProfile,
        transactionContext: transactions.slice(0, 3)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-complaint function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
