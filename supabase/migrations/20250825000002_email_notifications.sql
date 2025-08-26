-- Add email notification trigger for career applications
-- Created: 2025-08-25

-- Create email notification function with error handling
CREATE OR REPLACE FUNCTION send_application_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to send email notification, fallback to logging if it fails
  BEGIN
    PERFORM net.http_post(
      url := 'https://rarxrbqpndlfxchdxnat.supabase.co/functions/v1/send-application-email'::text,
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.supabase_service_role_key', true) || '"}'::text,
      body := json_build_object(
        'application_id', NEW.id,
        'applicant_email', NEW.email,
        'applicant_name', NEW.first_name || ' ' || NEW.last_name,
        'position_id', NEW.position_id,
        'type', 'confirmation'
      )::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the notification attempt instead of sending HTTP request
    RAISE LOG 'Application notification would be sent for application % (email: %, position: %) - Error: %', 
      NEW.id, NEW.email, NEW.position_id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new applications
CREATE TRIGGER on_application_submitted
  AFTER INSERT ON career_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_application_notification();

-- Create status notification function with error handling
CREATE OR REPLACE FUNCTION send_application_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send email if status actually changed
  IF OLD.status != NEW.status THEN
    BEGIN
      PERFORM net.http_post(
        url := 'https://rarxrbqpndlfxchdxnat.supabase.co/functions/v1/send-application-email'::text,
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.supabase_service_role_key', true) || '"}'::text,
        body := json_build_object(
          'application_id', NEW.id,
          'applicant_email', NEW.email,
          'applicant_name', NEW.first_name || ' ' || NEW.last_name,
          'position_id', NEW.position_id,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'type', 'status_update'
        )::jsonb
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log the notification attempt instead of sending HTTP request
      RAISE LOG 'Application status notification would be sent for application %: % -> % - Error: %', 
        NEW.id, OLD.status, NEW.status, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application status updates
CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON career_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_application_status_notification();