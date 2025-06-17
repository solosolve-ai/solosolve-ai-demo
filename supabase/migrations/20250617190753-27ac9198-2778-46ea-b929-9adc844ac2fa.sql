
-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  complaint_count INTEGER DEFAULT 0,
  avg_satisfaction_rating DECIMAL,
  is_chronic_complainer BOOLEAN DEFAULT false,
  is_aggressive_tendency BOOLEAN DEFAULT false,
  total_purchase_value DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transaction_history table based on CSV structure
CREATE TABLE public.transaction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_review DECIMAL,
  title_review TEXT,
  text_review TEXT,
  images_review JSONB,
  asin_review TEXT,
  parent_asin TEXT,
  user_id TEXT NOT NULL,
  timestamp_review BIGINT,
  helpful_vote_review INTEGER,
  verified_purchase_review BOOLEAN,
  text_review_cleaned TEXT,
  title_review_cleaned TEXT,
  timestamp_review_dt TIMESTAMP,
  inferred_complaint_driver TEXT,
  main_category TEXT,
  title TEXT,
  average_rating DECIMAL,
  rating_number INTEGER,
  features JSONB,
  description TEXT,
  price DECIMAL,
  images JSONB,
  videos JSONB,
  store TEXT,
  categories JSONB,
  details JSONB,
  bought_together JSONB,
  subtitle TEXT,
  author TEXT,
  features_str TEXT,
  description_str TEXT,
  categories_str TEXT,
  bought_together_str TEXT,
  complaint_title_text TEXT,
  complaint_body_text TEXT,
  complaint_rating_given DECIMAL,
  complaint_verified_purchase BOOLEAN,
  complaint_helpful_votes INTEGER,
  product_title TEXT,
  product_asin_display TEXT,
  product_price_numeric DECIMAL,
  product_main_category TEXT,
  product_store TEXT,
  product_features TEXT,
  product_avg_rating DECIMAL,
  product_rating_number INTEGER,
  image_urls_str TEXT,
  product_price_display TEXT,
  product_sub_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_sessions table for conversation management
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table for storing conversation history
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.chat_sessions(session_id),
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  message TEXT NOT NULL,
  classifications JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on transaction_history" ON public.transaction_history FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_sessions" ON public.chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_messages" ON public.chat_messages FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_transaction_user_id ON public.transaction_history(user_id);
CREATE INDEX idx_transaction_complaint_category ON public.transaction_history(inferred_complaint_driver);
CREATE INDEX idx_transaction_product_category ON public.transaction_history(product_main_category);
CREATE INDEX idx_transaction_timestamp ON public.transaction_history(timestamp_review_dt);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);

-- Enable full-text search on complaint content
CREATE INDEX idx_transaction_text_search ON public.transaction_history 
USING gin(to_tsvector('english', COALESCE(complaint_body_text, '') || ' ' || COALESCE(complaint_title_text, '')));

-- Insert sample data based on your CSV example
INSERT INTO public.profiles (user_id, email, name) VALUES
('AHINNO2AKJKHFW6UMROPGNVDP4ZA', 'user1@example.com', 'Customer One'),
('AE2DE6QWK2Z2L7SS4FRHWOKB4E3A', 'user2@example.com', 'Customer Two');

INSERT INTO public.transaction_history (
  rating_review, title_review, text_review, user_id, timestamp_review,
  verified_purchase_review, inferred_complaint_driver, main_category,
  title, price, complaint_title_text, complaint_body_text,
  complaint_rating_given, complaint_verified_purchase, product_title,
  product_asin_display, product_main_category
) VALUES
(1.0, 'One Star', 'Broke the first day. Very cheap material', 
 'AHINNO2AKJKHFW6UMROPGNVDP4ZA', 1484385176000, true, 'Quality Issue',
 'AMAZON FASHION', 'Cute Elephant Family Stroll Necklace', -1.0,
 'One Star', 'Broke the first day. Very cheap material', 1.0, true,
 'One Star', 'B01B9VRJ3Y', 'N/A'),
(1.0, 'Buyer Beware', 'The packaging is horrible. They came vacuum packed and they did not puff up when opened.',
 'AE2DE6QWK2Z2L7SS4FRHWOKB4E3A', 1608431859817, true, 'Shipping Problem',
 'AMAZON FASHION', 'meekoo Red Sponge Noses Red Clown Nose', 10.99,
 'Buyer Beware', 'The packaging is horrible. They came vacuum packed and they did not puff up when opened.', 1.0, true,
 'Buyer Beware', 'B07TJQLF17', 'N/A');
