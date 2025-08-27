// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  application_id: string;
  applicant_email: string;
  applicant_name: string;
  position_id: string;
  type: "confirmation" | "status_update";
  old_status?: string;
  new_status?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      application_id,
      applicant_email,
      applicant_name,
      position_id,
      type,
      old_status,
      new_status,
    }: EmailRequest = await req.json();

    // Get position details from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const positionResponse = await fetch(
      `${supabaseUrl}/rest/v1/career_positions?id=eq.${position_id}&select=title,slug,company_id`,
      {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          "Content-Type": "application/json",
        },
      }
    );

    const positions = await positionResponse.json();
    const position = positions[0];

    if (!position) {
      throw new Error("Position not found");
    }

    let subject: string;
    let htmlContent: string;

    if (type === "confirmation") {
      subject = `Application Received - ${position.title}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Application Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${applicant_name},</p>
              
              <p>Thank you for your interest in the <strong>${
                position.title
              }</strong> position at our company. We have successfully received your application.</p>
              
              <p><strong>Application Details:</strong></p>
              <ul>
                <li>Position: ${position.title}</li>
                <li>Application ID: ${application_id}</li>
                <li>Submitted: ${new Date().toLocaleDateString()}</li>
                <li>Status: Under Review</li>
              </ul>
              
              <p>Our team will review your application and get back to you within 5-7 business days. If you have any questions, please don't hesitate to contact us.</p>
              
              <a href="https://yourcompany.com/career/${
                position.slug
              }" class="button">View Job Details</a>
              
              <p>Best regards,<br>
              The Hiring Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© 2025 Tekna Company. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Status update email
      const statusLabels: { [key: string]: string } = {
        submitted: "Submitted",
        reviewing: "Under Review",
        interview_scheduled: "Interview Scheduled",
        interview_completed: "Interview Completed",
        offered: "Offer Extended",
        accepted: "Offer Accepted",
        rejected: "Application Closed",
        withdrawn: "Application Withdrawn",
      };

      subject = `Application Update - ${position.title}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Application Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status { background: #e8f5e8; color: #2d5016; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <p>Dear ${applicant_name},</p>
              
              <p>We have an update regarding your application for the <strong>${
                position.title
              }</strong> position.</p>
              
              <div class="status">
                Your application status has been updated to: <br>
                <strong>${statusLabels[new_status || "submitted"]}</strong>
              </div>
              
              <p><strong>Application Details:</strong></p>
              <ul>
                <li>Position: ${position.title}</li>
                <li>Application ID: ${application_id}</li>
                <li>Previous Status: ${
                  statusLabels[old_status || "submitted"]
                }</li>
                <li>Current Status: ${
                  statusLabels[new_status || "submitted"]
                }</li>
                <li>Updated: ${new Date().toLocaleDateString()}</li>
              </ul>
              
              ${
                new_status === "interview_scheduled"
                  ? "<p><strong>Next Steps:</strong> Our team will contact you soon to schedule your interview. Please keep an eye on your email and phone.</p>"
                  : new_status === "offered"
                  ? "<p><strong>Congratulations!</strong> We are pleased to extend an offer for this position. Our team will contact you with details soon.</p>"
                  : new_status === "rejected"
                  ? "<p>While we were impressed with your qualifications, we have decided to move forward with other candidates. We encourage you to apply for future openings that match your skills.</p>"
                  : "<p>We will keep you updated as your application progresses through our hiring process.</p>"
              }
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>
              The Hiring Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© 2025 Tekna Company. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send email using Resend
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@tekna.onresend.com", // Use Resend subdomain for testing
        to: [applicant_email],
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailData.id,
        message: "Email sent successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
