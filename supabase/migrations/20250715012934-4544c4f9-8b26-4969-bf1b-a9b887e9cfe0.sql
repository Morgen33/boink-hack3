-- Create whale applications table
CREATE TABLE public.whale_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  holdings_percentage text,
  contact_method text NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.whale_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public form submissions)
CREATE POLICY "Anyone can submit whale applications" 
ON public.whale_applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy to only allow admins to view applications (for privacy)
CREATE POLICY "Only admins can view whale applications" 
ON public.whale_applications 
FOR SELECT 
USING (false); -- This will need to be updated when admin roles are implemented

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_whale_applications_updated_at
BEFORE UPDATE ON public.whale_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();