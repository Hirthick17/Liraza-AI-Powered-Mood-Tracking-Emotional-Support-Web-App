-- Add UPDATE policy for mood_logs table
CREATE POLICY "Users can update their own mood logs"
  ON public.mood_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

