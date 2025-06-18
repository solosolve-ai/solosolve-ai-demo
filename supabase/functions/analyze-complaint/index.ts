
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

    // 3. Determine complaint characteristics for better classification
    const complaintLength = complaintText.length;
    const hasSpecificDetails = /order|product|delivery|size|color|quality|damaged|broken|wrong/i.test(complaintText);
    const hasEmotionalWords = /angry|frustrated|disappointed|upset|terrible|awful|hate|love|amazing/i.test(complaintText);
    
    // Create fallback classification based on complaint analysis
    const fallbackClassification: GemmaClassification = {
      is_actionable: complaintLength > 20 && hasSpecificDetails,
      complaint_category: hasSpecificDetails ? "Product Issue" : "General Inquiry",
      decision_recommendation: hasSpecificDetails ? "Further_Information_Required" : "Provide_Policy_Information",
      info_complete: complaintLength > 50 && hasSpecificDetails,
      tone: hasEmotionalWords ? "Empathetic_Standard" : "Neutral_Direct",
      refund_percentage: hasSpecificDetails && hasEmotionalWords ? 50 : 0,
      sentiment: hasEmotionalWords ? "negative" : "neutral",
      aggression: hasEmotionalWords ? "medium" : "low",
      reasoning: `Classified based on complaint content analysis: ${complaintLength} characters, specific details: ${hasSpecificDetails}, emotional content: ${hasEmotionalWords}`
    };

    // 4. Try Gemma classification (will use fallback if it fails)
    let gemmaResponse: GemmaClassification = fallbackClassification;
    let gemmaReasoning = fallbackClassification.reasoning;

    try {
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
            const parsedResponse = JSON.parse(jsonMatch[0]);
            gemmaResponse = parsedResponse;
            gemmaReasoning = parsedResponse.reasoning || "Classification completed successfully";
          } catch (parseError) {
            console.error('Failed to parse Gemma JSON:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Gemma API error:', error);
    }

    // 5. Generate appropriate Gemini prompt based on classification and complaint content
    const generateContextualPrompt = () => {
      const hasTransactionHistory = searchResults && searchResults.length > 0;
      const isSpecificComplaint = gemmaResponse.is_actionable && gemmaResponse.info_complete;
      
      if (complaintText.toLowerCase().includes('hello') || complaintText.length < 10) {
        return `You are "SoloSolver", a professional customer service AI assistant. The customer has just said "${complaintText}". 

Respond with a warm, professional greeting and ask them to describe their specific concern or complaint so you can assist them properly.

Keep the response professional but friendly, and encourage them to share details about any issues they're experiencing.`;
      }

      if (!isSpecificComplaint) {
        return `You are "SoloSolver", a professional customer service AI assistant. A customer has contacted you saying: "${complaintText}"

This appears to be a general inquiry that needs more specific information. 

Respond professionally by:
1. Acknowledging their concern
2. Explaining that you need more specific details to help them effectively
3. Ask for relevant information such as:
   - Order number (if applicable)
   - Product details
   - Specific issue they're experiencing
   - When the issue occurred

Be helpful and guide them to provide the information you need to assist them properly.`;
      }

      return `You are "SoloSolver", a professional customer service AI assistant representing our company. You must respond in a formal, courteous, and professional manner appropriate for business correspondence.

**Current Customer Inquiry:**
"${complaintText}"

**AI Classification Analysis:**
${JSON.stringify(gemmaResponse, null, 2)}

**Customer Profile & History:**
${profile ? JSON.stringify(profile, null, 2) : 'No profile available'}

**Relevant Transaction History:**
${hasTransactionHistory ? JSON.stringify(searchResults, null, 2) : 'No relevant transactions found'}

**Instructions:**
1. Respond in a professional, formal tone appropriate for customer service
2. Address the customer courteously (use "Dear Valued Customer" or similar)
3. Acknowledge their specific concern with empathy
4. ${hasTransactionHistory ? 'Reference their transaction history when relevant' : 'Note that you are reviewing their account for relevant information'}
5. Provide clear, actionable next steps based on the complaint classification
6. Use proper business letter formatting
7. Sign off professionally as "SoloSolver Customer Care Team"
8. If offering refunds/exchanges, be specific about terms and conditions
9. If escalation is needed, explain the process clearly
10. Maintain a helpful, solution-oriented approach

Please provide a complete, professional customer service response:`;
    };

    const geminiPrompt = generateContextualPrompt();

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
        geminiReasoning = `Generated contextual response based on complaint analysis and classification`;
      }

      // 6. Store the interaction for admin review
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
