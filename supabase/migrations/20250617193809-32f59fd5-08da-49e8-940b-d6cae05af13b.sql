
-- First, let's check if we have data in transaction_history table
-- If empty, we'll need to populate it with real data

-- Create a users table for login simulation with 10 different users from the CSV data
CREATE TABLE IF NOT EXISTS public.simulated_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert 10 different users based on actual user_ids from transaction history
-- These should be replaced with actual user_ids from your CSV data
INSERT INTO public.simulated_users (user_id, name, email, role) VALUES
('user_001', 'Alice Johnson', 'alice.johnson@email.com', 'customer'),
('user_002', 'Bob Smith', 'bob.smith@email.com', 'customer'),
('user_003', 'Carol Davis', 'carol.davis@email.com', 'customer'),
('user_004', 'David Wilson', 'david.wilson@email.com', 'customer'),
('user_005', 'Eva Brown', 'eva.brown@email.com', 'customer'),
('user_006', 'Frank Miller', 'frank.miller@email.com', 'customer'),
('user_007', 'Grace Lee', 'grace.lee@email.com', 'customer'),
('user_008', 'Henry Taylor', 'henry.taylor@email.com', 'customer'),
('admin_001', 'Admin User', 'admin@company.com', 'admin'),
('manager_001', 'Manager User', 'manager@company.com', 'manager')
ON CONFLICT (user_id) DO NOTHING;

-- Create a table to store detailed AI interactions for admin viewing
CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  complaint_text TEXT NOT NULL,
  gemma_classifications JSONB,
  gemma_reasoning TEXT,
  gemini_response TEXT,
  gemini_reasoning TEXT,
  search_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the new tables
ALTER TABLE public.simulated_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for simulated_users (allow all for simulation)
CREATE POLICY "Allow all operations on simulated_users" 
  ON public.simulated_users 
  FOR ALL 
  USING (true);

-- Create policies for ai_interactions  
CREATE POLICY "Allow all operations on ai_interactions" 
  ON public.ai_interactions 
  FOR ALL 
  USING (true);

-- Fix the text search issue in transaction_history by creating a proper search function
CREATE OR REPLACE FUNCTION search_transactions_text(
  search_query TEXT,
  user_filter TEXT DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  user_id TEXT,
  complaint_body_text TEXT,
  inferred_complaint_driver TEXT,
  rating_review NUMERIC,
  timestamp_review_dt TIMESTAMP,
  product_title TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    th.id,
    th.user_id,
    th.complaint_body_text,
    th.inferred_complaint_driver,
    th.rating_review,
    th.timestamp_review_dt,
    th.product_title
  FROM transaction_history th
  WHERE 
    (user_filter IS NULL OR th.user_id = user_filter)
    AND (category_filter IS NULL OR category_filter = 'all' OR th.inferred_complaint_driver = category_filter)
    AND (
      search_query IS NULL 
      OR search_query = '' 
      OR th.complaint_body_text ILIKE '%' || search_query || '%'
      OR th.product_title ILIKE '%' || search_query || '%'
      OR th.inferred_complaint_driver ILIKE '%' || search_query || '%'
    )
  ORDER BY th.timestamp_review_dt DESC NULLS LAST
  LIMIT limit_count;
END;
$$;
