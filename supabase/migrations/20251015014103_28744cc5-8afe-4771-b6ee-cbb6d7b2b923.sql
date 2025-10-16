-- Fix search_path for sentiment analysis functions
CREATE OR REPLACE FUNCTION public.analyze_sentiment(message_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  sentiment_score INTEGER := 0;
  positive_keywords TEXT[] := ARRAY['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy', 'awesome', 'fantastic', 'excellent', 'better', 'good', 'grateful', 'blessed', 'peaceful'];
  negative_keywords TEXT[] := ARRAY['sad', 'depressed', 'down', 'lonely', 'upset', 'hurt', 'crying', 'hopeless', 'miserable', 'empty', 'angry', 'frustrated', 'mad', 'hate', 'terrible', 'awful', 'worst'];
  keyword TEXT;
BEGIN
  message_text := lower(message_text);
  
  FOREACH keyword IN ARRAY positive_keywords
  LOOP
    IF message_text LIKE '%' || keyword || '%' THEN
      sentiment_score := sentiment_score + 1;
    END IF;
  END LOOP;
  
  FOREACH keyword IN ARRAY negative_keywords
  LOOP
    IF message_text LIKE '%' || keyword || '%' THEN
      sentiment_score := sentiment_score - 1;
    END IF;
  END LOOP;
  
  IF sentiment_score > 0 THEN
    RETURN 'Positive';
  ELSIF sentiment_score < 0 THEN
    RETURN 'Negative';
  ELSE
    RETURN 'Neutral';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_conversation_sentiment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.sentiment := public.analyze_sentiment(NEW.message);
  RETURN NEW;
END;
$$;