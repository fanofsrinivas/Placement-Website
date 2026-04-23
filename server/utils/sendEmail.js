const createTransporter = require('../config/email');

// Emails that should be redirected to the test email
const REDIRECT_EMAIL = 'js23mab0a11@student.nitw.ac.in';
const REDIRECT_LIST = ['admin@nitw.ac.in', 'tpo@nitw.ac.in', 'coordinator@nitw.ac.in'];

const getRecipient = (to) => {
  const lower = to.toLowerCase().trim();
  // If the email is in the explicit redirect list, send to test email
  if (REDIRECT_LIST.includes(lower)) {
    console.log(`[Email Redirect] ${to} -> ${REDIRECT_EMAIL}`);
    return REDIRECT_EMAIL;
  }
  // All faculty coordinators (faculty.*@nitw.ac.in) redirect to test email
  if (/^faculty\..+@nitw\.ac\.in$/i.test(lower)) {
    console.log(`[Email Redirect - Faculty] ${to} -> ${REDIRECT_EMAIL}`);
    return REDIRECT_EMAIL;
  }
  // All other emails (students, companies, etc.) go to their actual email
  return to;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const finalTo = getRecipient(to);

    // If actual email credentials exist, send it for real
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      const transporter = createTransporter();
      const info = await transporter.sendMail({
        from: `"NITW Placement Portal" <${process.env.EMAIL_USER}>`,
        to: finalTo,
        subject,
        html,
      });
      console.log(`Email sent to ${finalTo} (original: ${to}) | MessageID: ${info.messageId}`);
      return info;
    }

    // MOCK EMAIL Fallback — used when no real email creds are configured
    console.log('\n================== MOCK EMAIL ==================');
    console.log(`TO: ${finalTo} (Original: ${to})`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT (HTML): \n${html.replace(/<[^>]+>/g, '').trim()}`);
    console.log('================================================\n');

    return { messageId: 'mock-id-123' };
  } catch (error) {
    console.error('Email send error:', error.message);
    // Don't throw — let login/register continue even if email fails
    return null;
  }
};

const sendOTPEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'NITW Placement Portal - OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a237e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0;">NIT Warangal</h1>
          <p style="color: #ffc107; margin: 5px 0 0;">Placement Cell</p>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <p>Your OTP for verification is:</p>
          <div style="background: #1a237e; color: #fff; font-size: 32px; letter-spacing: 8px; text-align: center; padding: 15px; border-radius: 6px; margin: 15px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this with anyone.</p>
        </div>
      </div>
    `,
  });
};

const sendStatusEmail = async (email, name, jobTitle, newStatus) => {
  return sendEmail({
    to: email,
    subject: `Application Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a237e; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0;">NIT Warangal</h1>
          <p style="color: #ffc107; margin: 5px 0 0;">Placement Cell</p>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <p>Dear ${name},</p>
          <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #1a237e; margin: 15px 0;">
            New Status: <strong>${newStatus}</strong>
          </div>
          <p>Please log in to the portal for more details.</p>
        </div>
      </div>
    `,
  });
};

const sendJobNotificationEmail = async (email, studentName, jobTitle, companyName, deadline, jobDetails = {}) => {
  const deadlineDate = deadline ? new Date(deadline).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) : 'N/A';

  const packageText = jobDetails.packageLPA
    ? `${jobDetails.packageLPA.min}${jobDetails.packageLPA.max ? ' - ' + jobDetails.packageLPA.max : ''} LPA`
    : 'Not specified';

  return sendEmail({
    to: email,
    subject: `🎯 New Opportunity: ${jobTitle} at ${companyName} — Apply Now!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #1a237e 0%, #283593 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">NIT Warangal</h1>
          <p style="color: #ffc107; margin: 5px 0 0; font-size: 14px; letter-spacing: 1px;">Centre for Career Planning & Development</p>
        </div>
        <div style="background: #ffffff; padding: 30px 24px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear <strong>${studentName || 'Student'}</strong>,</p>
          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            Great news! A new placement opportunity matching your profile is now available:
          </p>
          <div style="background: linear-gradient(135deg, #e8eaf6, #f5f5f5); border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #1a237e;">
            <h2 style="margin: 0 0 8px; color: #1a237e; font-size: 20px;">${jobTitle}</h2>
            <p style="margin: 0 0 4px; font-size: 15px; color: #555;">🏢 <strong>${companyName}</strong></p>
            ${jobDetails.jobType ? `<p style="margin: 0 0 4px; font-size: 14px; color: #666;">📋 ${jobDetails.jobType}</p>` : ''}
            ${jobDetails.location ? `<p style="margin: 0 0 4px; font-size: 14px; color: #666;">📍 ${jobDetails.location}</p>` : ''}
            <p style="margin: 0 0 4px; font-size: 14px; color: #666;">💰 Package: <strong>${packageText}</strong></p>
            ${jobDetails.stipend ? `<p style="margin: 0 0 4px; font-size: 14px; color: #666;">🎓 Stipend: ₹${jobDetails.stipend}/month</p>` : ''}
            <p style="margin: 0; font-size: 14px; color: #d32f2f;">⏰ Deadline: <strong>${deadlineDate}</strong></p>
          </div>
          ${jobDetails.eligibility ? `
          <div style="background: #f9fbe7; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #558b2f; font-weight: 600;">✅ You are eligible for this opportunity based on your profile.</p>
          </div>
          ` : ''}
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/student/apply"
               style="background: linear-gradient(135deg, #1a237e, #3949ab); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
              Apply Now →
            </a>
          </div>
          <p style="font-size: 13px; color: #888; line-height: 1.5;">
            Log in to the placement portal to view full details and submit your application before the deadline.
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 16px 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            This is an automated notification from NITW Placement Portal.<br/>
            You received this because you match the eligibility criteria for this job.
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendOTPEmail, sendStatusEmail, sendJobNotificationEmail };
