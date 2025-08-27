# Email Notification Setup Guide

## 1. Setup Resend for Email Delivery

### Sign up for Resend

1. Go to https://resend.com
2. Create an account
3. Verify your domain or use their subdomain for testing
4. Get your API key from the dashboard

### Add Environment Variables to Supabase

```bash
# In your Supabase project settings > Environment Variables
RESEND_API_KEY=re_xxxxxxxxx
```

## 2. Deploy Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the edge function
supabase functions deploy send-application-email
```

## 3. Setup Database Triggers

Run the migration file to create the email notification triggers:

```bash
# Apply the migration
supabase db push
```

Or manually run the SQL in your Supabase SQL editor:

```sql
-- The content of 20250825000002_email_notifications.sql
```

## 4. Update Edge Function URL

In the migration file `20250825000002_email_notifications.sql`, replace:

- `your-project-ref` with your actual Supabase project reference
- Update the email domain in the Edge Function

## 5. Test Email Notifications

1. Submit a job application through your website
2. Check that confirmation email is sent
3. Update application status in admin dashboard
4. Check that status update email is sent

## 6. Email Templates

The Edge Function includes professional HTML email templates for:

- **Application Confirmation**: Sent when someone submits an application
- **Status Updates**: Sent when application status changes (interview scheduled, offered, rejected, etc.)

## 7. Customization

You can customize:

- Email templates in `supabase/functions/send-application-email/index.ts`
- From address (must be verified domain in Resend)
- Company branding and styling
- Email content and messaging

## 8. Alternative Email Providers

Instead of Resend, you can use:

- **SendGrid**: Change the API endpoint and headers
- **Mailgun**: Similar setup with different API
- **Amazon SES**: AWS email service
- **Postmark**: Transactional email service

## 9. Monitoring

Monitor email delivery through:

- Resend dashboard for delivery status
- Supabase Edge Function logs
- Database logs for trigger execution

## 10. Production Considerations

- Set up proper domain verification in Resend
- Configure SPF, DKIM, and DMARC records
- Set up email bounce and complaint handling
- Consider rate limiting for email sends
- Add proper error handling and retries
