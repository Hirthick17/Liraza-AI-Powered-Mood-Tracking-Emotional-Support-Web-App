-- Create conversations table with sentiment analysis
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  sentiment TEXT CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_conversations_user_timestamp ON public.conversations(user_id, timestamp DESC);

-- Function to analyze sentiment from message text
CREATE OR REPLACE FUNCTION public.analyze_sentiment(message_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  sentiment_score INTEGER := 0;
  positive_keywords TEXT[] := ARRAY['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy', 'awesome', 'fantastic', 'excellent', 'better', 'good', 'grateful', 'blessed', 'peaceful'];
  negative_keywords TEXT[] := ARRAY['sad', 'depressed', 'down', 'lonely', 'upset', 'hurt', 'crying', 'hopeless', 'miserable', 'empty', 'angry', 'frustrated', 'mad', 'hate', 'terrible', 'awful', 'worst'];
  keyword TEXT;
BEGIN
  -- Convert message to lowercase for comparison
  message_text := lower(message_text);
  
  -- Count positive keywords
  FOREACH keyword IN ARRAY positive_keywords
  LOOP
    IF message_text LIKE '%' || keyword || '%' THEN
      sentiment_score := sentiment_score + 1;
    END IF;
  END LOOP;
  
  -- Count negative keywords
  FOREACH keyword IN ARRAY negative_keywords
  LOOP
    IF message_text LIKE '%' || keyword || '%' THEN
      sentiment_score := sentiment_score - 1;
    END IF;
  END LOOP;
  
  -- Determine sentiment
  IF sentiment_score > 0 THEN
    RETURN 'Positive';
  ELSIF sentiment_score < 0 THEN
    RETURN 'Negative';
  ELSE
    RETURN 'Neutral';
  END IF;
END;
$$;

-- Trigger to automatically update sentiment on insert
CREATE OR REPLACE FUNCTION public.update_conversation_sentiment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.sentiment := public.analyze_sentiment(NEW.message);
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_conversation_sentiment
  BEFORE INSERT ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_sentiment();