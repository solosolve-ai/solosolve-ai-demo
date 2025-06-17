
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      userId, 
      searchQuery, 
      category, 
      timeRange, 
      limit = 20 
    } = await req.json();

    let query = supabase
      .from('transaction_history')
      .select('*');

    // Filter by user if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Full-text search
    if (searchQuery) {
      query = query.textSearch('complaint_body_text', searchQuery);
    }

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('inferred_complaint_driver', category);
    }

    // Filter by time range
    if (timeRange) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
      query = query.gte('timestamp_review_dt', cutoffDate.toISOString());
    }

    const { data, error } = await query
      .order('timestamp_review', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Generate insights
    const insights = {
      totalResults: data?.length || 0,
      categories: [...new Set(data?.map(t => t.inferred_complaint_driver).filter(Boolean))] || [],
      avgRating: data?.length ? 
        data.reduce((acc, t) => acc + (t.rating_review || 0), 0) / data.length : 0,
      verifiedPurchases: data?.filter(t => t.verified_purchase_review).length || 0
    };

    return new Response(
      JSON.stringify({
        transactions: data || [],
        insights,
        query: {
          userId,
          searchQuery,
          category,
          timeRange
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in search-transactions function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
