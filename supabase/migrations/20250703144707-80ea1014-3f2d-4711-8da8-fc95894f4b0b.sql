-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily match generation to run at midnight UTC every day
SELECT cron.schedule(
  'generate-daily-matches',
  '0 0 * * *', -- At midnight UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://pizlzaomylxreizohewd.supabase.co/functions/v1/generate-daily-matches',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpemx6YW9teWx4cmVpem9oZXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDQyOTUsImV4cCI6MjA2NjA4MDI5NX0.KsD1rrVyRQxM0rckta5p_50xahz_ju4XiPw-LCaTnpI"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);