
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
    console.log('Complaint text:', complaintText);

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

    // 3. Enhanced complaint analysis for better classification
    const complaintLower = complaintText.toLowerCase();
    const complaintLength = complaintText.length;
    
    // Detect specific issue types
    const isSizingIssue = /size|sizing|fit|fitting|too small|too big|large|small|doesn't fit|wrong size/i.test(complaintText);
    const isDamageIssue = /damage|damaged|broken|crack|tear|defect|quality/i.test(complaintText);
    const isShippingIssue = /shipping|delivery|arrived|late|delay|missing/i.test(complaintText);
    const isReturnIssue = /return|refund|exchange|money back/i.test(complaintText);
    
    // Detect emotional content
    const hasEmotionalWords = /angry|frustrated|disappointed|upset|terrible|awful|hate|love|amazing|horrible|worst|best/i.test(complaintText);
    const hasUrgentWords = /urgent|immediately|asap|right now|quickly|fast/i.test(complaintText);
    
    // Create enhanced fallback classification
    const createSmartClassification = (): GemmaClassification => {
      let category = "General Inquiry";
      let recommendation = "Provide_Policy_Information";
      let refundPercentage = 0;
      let tone = "Neutral_Direct";
      
      if (isSizingIssue) {
        category = "Sizing Issue";
        recommendation = "Exchange_Offered";
        refundPercentage = 0; // Exchange first, then refund if needed
        tone = hasEmotionalWords ? "Empathetic_Standard" : "Helpful_Informative";
      } else if (isDamageIssue) {
        category = "Damaged Item";
        recommendation = "Full_Refund_With_Return";
        refundPercentage = 100;
        tone = "Understanding_Apologetic";
      } else if (isShippingIssue) {
        category = "Shipping Problem";
        recommendation = "Further_Information_Required";
        refundPercentage = 25;
        tone = "Empathetic_Standard";
      } else if (isReturnIssue) {
        category = "Return Process Issue";
        recommendation = "Provide_Policy_Information";
        refundPercentage = 0;
        tone = "Helpful_Informative";
      } else if (complaintLength > 30) {
        category = "Quality Issue";
        recommendation = "Further_Information_Required";
        refundPercentage = 25;
        tone = hasEmotionalWords ? "Empathetic_Standard" : "Neutral_Direct";
      }

      return {
        is_actionable: complaintLength > 10 && (isSizingIssue || isDamageIssue || isShippingIssue || isReturnIssue),
        complaint_category: category,
        decision_recommendation: recommendation,
        info_complete: complaintLength > 20,
        tone: tone,
        refund_percentage: refundPercentage,
        sentiment: hasEmotionalWords ? "negative" : "neutral",
        aggression: hasUrgentWords ? "medium" : hasEmotionalWords ? "low" : "none",
        reasoning: `Smart classification: detected ${category.toLowerCase()} based on keywords and content analysis`
      };
    };

    // 4. Try Gemma classification with improved error handling
    let gemmaResponse: GemmaClassification = createSmartClassification();
    let gemmaReasoning = gemmaResponse.reasoning;
    let gemmaSuccess = false;

    try {
      console.log('Attempting Gemma classification...');
      
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
              return_full_text: false,
            },
          }),
        }
      );

      console.log('Gemma API response status:', huggingFaceResponse.status);
      
      if (!huggingFaceResponse.ok) {
        throw new Error(`Gemma API returned ${huggingFaceResponse.status}: ${huggingFaceResponse.statusText}`);
      }

      const gemmaResult = await huggingFaceResponse.json();
      console.log('Gemma raw response:', gemmaResult);

      if (gemmaResult && Array.isArray(gemmaResult) && gemmaResult[0] && gemmaResult[0].generated_text) {
        const generatedText = gemmaResult[0].generated_text;
        console.log('Generated text:', generatedText);
        
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsedResponse = JSON.parse(jsonMatch[0]);
            console.log('Parsed Gemma response:', parsedResponse);
            
            // Validate the parsed response has required fields
            if (parsedResponse.is_actionable !== undefined && parsedResponse.complaint_category) {
              gemmaResponse = parsedResponse;
              gemmaReasoning = parsedResponse.reasoning || "Gemma classification completed";
              gemmaSuccess = true;
              console.log('Gemma classification successful');
            } else {
              console.log('Gemma response missing required fields, using fallback');
            }
          } catch (parseError) {
            console.error('Failed to parse Gemma JSON:', parseError);
          }
        } else {
          console.log('No JSON found in Gemma response, using fallback');
        }
      } else {
        console.log('Unexpected Gemma response format, using fallback');
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

      // Generate specific response based on complaint category
      let specificGuidance = "";
      switch (gemmaResponse.complaint_category) {
        case "Sizing Issue":
          specificGuidance = `This is a sizing issue. Offer an exchange first, and if that's not suitable, offer a refund. Be understanding about sizing challenges with online shopping.`;
          break;
        case "Damaged Item":
          specificGuidance = `This is a damaged item complaint. Apologize sincerely, offer a full refund with return, and expedite the resolution process.`;
          break;
        case "Shipping Problem":
          specificGuidance = `This is a shipping-related issue. Show empathy for the inconvenience and provide clear next steps for resolution.`;
          break;
        default:
          specificGuidance = `Address this ${gemmaResponse.complaint_category.toLowerCase()} with appropriate empathy and solution-focused approach.`;
      }

      return `You are "SoloSolver", a professional customer service AI assistant representing our company. You must respond in a formal, courteous, and professional manner appropriate for business correspondence.

**Current Customer Inquiry:**
"${complaintText}"

**AI Classification Analysis:**
Category: ${gemmaResponse.complaint_category}
Recommendation: ${gemmaResponse.decision_recommendation}
Suggested Tone: ${gemmaResponse.tone}
Refund Percentage: ${gemmaResponse.refund_percentage}%
${gemmaSuccess ? 'Classification Source: Gemma AI Model' : 'Classification Source: Smart Fallback System'}

**Customer Profile & History:**
${profile ? JSON.stringify(profile, null, 2) : 'No profile available'}

**Relevant Transaction History:**
${hasTransactionHistory ? JSON.stringify(searchResults, null, 2) : 'No relevant transactions found'}

**Specific Instructions:**
${specificGuidance}

**General Response Guidelines:**
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
    console.log('Generated Gemini prompt for complaint category:', gemmaResponse.complaint_category);

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

      console.log('Gemini API response status:', geminiResponse.status);
      
      if (!geminiResponse.ok) {
        throw new Error(`Gemini API returned ${geminiResponse.status}`);
      }

      const geminiResult = await geminiResponse.json();
      console.log('Gemini response received successfully');

      let finalResponse = "Dear Valued Customer,\n\nI apologize for the technical difficulty we are currently experiencing. Our technical team has been notified and is working to resolve this issue promptly.\n\nIn the meantime, please feel free to contact our customer service team directly at support@company.com or call our helpline for immediate assistance.\n\nThank you for your patience and understanding.\n\nBest regards,\nSoloSolver Customer Care Team";
      let geminiReasoning = "Fallback response due to technical error";

      if (geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text) {
        finalResponse = geminiResult.candidates[0].content.parts[0].text;
        geminiReasoning = `Generated contextual response for ${gemmaResponse.complaint_category} using ${gemmaSuccess ? 'Gemma' : 'Smart Fallback'} classification`;
        console.log('Gemini response generated successfully');
      } else {
        console.log('Gemini response structure unexpected, using fallback');
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
          status: 'success',
          debug: {
            gemmaSuccess: gemmaSuccess,
            classificationSource: gemmaSuccess ? 'Gemma AI' : 'Smart Fallback',
            complaintCategory: gemmaResponse.complaint_category
          }
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );

    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Enhanced fallback response based on complaint type
      let fallbackResponse = "Dear Valued Customer,\n\n";
      
      if (isSizingIssue) {
        fallbackResponse += "Thank you for contacting us regarding the sizing issue with your recent purchase. I understand how frustrating it can be when an item doesn't fit as expected.\n\n";
        fallbackResponse += "We would be happy to arrange an exchange for a different size, or if you prefer, we can process a full refund for you. Please let me know your order number and preferred resolution.\n\n";
      } else if (isDamageIssue) {
        fallbackResponse += "I sincerely apologize that you received a damaged item. This is not the quality standard we strive for.\n\n";
        fallbackResponse += "We will immediately process a full refund and arrange for the return of the damaged item. Please provide your order number so we can expedite this resolution.\n\n";
      } else {
        fallbackResponse += "Thank you for contacting SoloSolver Customer Care. I have received your inquiry and our team is reviewing your concern.\n\n";
        fallbackResponse += "To provide you with the best possible assistance, could you please provide your order number and any additional details about the issue you're experiencing?\n\n";
      }
      
      fallbackResponse += "We appreciate your patience and will ensure this matter is resolved promptly.\n\n";
      fallbackResponse += "Best regards,\nSoloSolver Customer Care Team";
      
      return new Response(
        JSON.stringify({
          response: fallbackResponse,
          error: 'API error - using enhanced fallback',
          classifications: gemmaResponse,
          searchResults: searchResults,
          status: 'fallback',
          debug: {
            gemmaSuccess: gemmaSuccess,
            classificationSource: 'Smart Fallback',
            complaintCategory: gemmaResponse.complaint_category,
            errorType: 'Gemini API Error'
          }
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
        message: error.message,
        status: 'error'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});
