-- Fix handle_new_user function with proper schema qualification
-- This ensures all references are schema-qualified when using SET search_path = ''
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, age, location, gender)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    (new.raw_user_meta_data->>'age')::integer,
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'gender'
  );
  RETURN new;
END;
$$;

-- Fix update_updated_at function to use proper schema qualification
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

