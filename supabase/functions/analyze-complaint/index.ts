
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeComplaintRequest {
  userId: string;
  complaintText: string;
  chatHistory: any[];
  sessionId: string;
  files?: any[];
}

interface GemmaClassification {
  is_actionable: boolean;
  complaint_category: string;
  decision_recommendation: string;
  info_complete: boolean;
  tone: string;
  refund_percentage: number;
  sentiment: string;
  aggression: string;
  reasoning: string;
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

    const { userId, complaintText, chatHistory, sessionId, files }: AnalyzeComplaintRequest = await req.json();

    console.log('Processing complaint for user:', userId);

    // 1. Search user's transaction history using the new function
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_transactions_text', {
        search_query: complaintText,
        user_filter: userId,
        limit_count: 5
      });

    if (searchError) {
      console.error('Search error:', searchError);
    }

    console.log('Search results:', searchResults);

    // 2. Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 3. Call Gemma 3-4B for classification
    const gemmaPrompt = `
<start_of_turn>user
You are a specialized AI classifier for customer complaints. Analyze the following complaint and provide structured classification.

Customer Complaint: "${complaintText}"

User Profile: ${profile ? JSON.stringify(profile) : 'No profile data'}
Transaction History: ${searchResults ? JSON.stringify(searchResults.slice(0, 3)) : 'No transaction history'}

Provide your analysis in this exact JSON format:
{
  "is_actionable": boolean,
  "complaint_category": "one of: Sizing Issue, Damaged Item, Not as Described, Shipping Problem, Policy Inquiry, Late Delivery, Wrong Item Received, Quality Issue, Return Process Issue, Other",
  "decision_recommendation": "one of: Full_Refund_No_Return, Full_Refund_With_Return, Partial_Refund_No_Return, Partial_Refund_With_Return, Exchange_Offered, Deny_Request_Policy_Violation, Further_Information_Required, Escalate_To_Human_Agent, Provide_Policy_Information, Other",
  "info_complete": boolean,
  "tone": "one of: Empathetic_Standard, Neutral_Direct, Understanding_Apologetic, Firm_Polite, Helpful_Informative",
  "refund_percentage": number between 0-100,
  "sentiment": "one of: positive, neutral, negative, mixed, very_negative",
  "aggression": "one of: none, low, medium, high",
  "reasoning": "detailed explanation of your classification logic"
}
<end_of_turn>
<start_of_turn>model
`;

    let gemmaResponse: GemmaClassification | null = null;
    let gemmaReasoning = "";

    try {
      const huggingFaceResponse = await fetch(
        'https://api-inference.huggingface.co/models/ShovalBenjer/gemma-3-4b-fashion-multitask_A4000_v7',
        {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: gemmaPrompt,
            parameters: {
              max_new_tokens: 512,
              temperature: 0.1,
              do_sample: false,
            },
          }),
        }
      );

      const gemmaResult = await huggingFaceResponse.json();
      console.log('Gemma raw response:', gemmaResult);

      if (gemmaResult && gemmaResult[0] && gemmaResult[0].generated_text) {
        const generatedText = gemmaResult[0].generated_text;
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            gemmaResponse = JSON.parse(jsonMatch[0]);
            gemmaReasoning = gemmaResponse?.reasoning || "No reasoning provided";
          } catch (parseError) {
            console.error('Failed to parse Gemma JSON:', parseError);
            gemmaResponse = {
              is_actionable: true,
              complaint_category: "Other",
              decision_recommendation: "Further_Information_Required",
              info_complete: false,
              tone: "Empathetic_Standard",
              refund_percentage: 0,
              sentiment: "negative",
              aggression: "none",
              reasoning: "Failed to parse classification"
            };
          }
        }
      }
    } catch (error) {
      console.error('Gemma API error:', error);
    }

    // 4. Call Gemini for orchestrated response
    const geminiPrompt = `
You are "SoloSolver", a professional customer service AI assistant representing our company. You must respond in a formal, courteous, and professional manner appropriate for business correspondence.

**Current Customer Inquiry:**
"${complaintText}"

**AI Classification Analysis:**
${gemmaResponse ? JSON.stringify(gemmaResponse, null, 2) : 'Classification unavailable'}

**Customer Profile & History:**
${profile ? JSON.stringify(profile, null, 2) : 'No profile available'}

**Relevant Transaction History:**
${searchResults && searchResults.length > 0 ? JSON.stringify(searchResults, null, 2) : 'No relevant transactions found'}

**Instructions:**
1. Respond in a professional, formal tone appropriate for customer service
2. Address the customer courteously (use "Dear Valued Customer" or similar)
3. Acknowledge their concern with empathy
4. Reference specific transaction history when relevant
5. Provide clear, actionable next steps
6. Use proper business letter formatting
7. Sign off professionally as "SoloSolver Customer Care Team"
8. If offering refunds/exchanges, be specific about terms and conditions
9. If escalation is needed, explain the process clearly
10. Maintain a helpful, solution-oriented approach

Please provide a complete, professional customer service response:
`;

    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: geminiPrompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const geminiResult = await geminiResponse.json();
      console.log('Gemini response:', geminiResult);

      let finalResponse = "I apologize, but I'm experiencing technical difficulties. Please contact our support team directly for assistance.";
      let geminiReasoning = "Technical error occurred";

      if (geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text) {
        finalResponse = geminiResult.candidates[0].content.parts[0].text;
        geminiReasoning = `Generated formal response based on complaint category: ${gemmaResponse?.complaint_category}, sentiment: ${gemmaResponse?.sentiment}, recommended action: ${gemmaResponse?.decision_recommendation}`;
      }

      // 5. Store the interaction for admin review
      const { error: insertError } = await supabase
        .from('ai_interactions')
        .insert({
          session_id: sessionId,
          user_id: userId,
          complaint_text: complaintText,
          gemma_classifications: gemmaResponse,
          gemma_reasoning: gemmaReasoning,
          gemini_response: finalResponse,
          gemini_reasoning: geminiReasoning,
          search_results: searchResults
        });

      if (insertError) {
        console.error('Failed to store interaction:', insertError);
      }

      return new Response(
        JSON.stringify({
          response: finalResponse,
          classifications: gemmaResponse,
          searchResults: searchResults,
          status: 'success'
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );

    } catch (error) {
      console.error('Gemini API error:', error);
      return new Response(
        JSON.stringify({
          response: "I apologize for the technical difficulty. Our team has been notified and will review your complaint manually. You can expect a response within 24 hours.",
          error: 'API error',
          classifications: gemmaResponse,
          searchResults: searchResults
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200
        }
      );
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});
