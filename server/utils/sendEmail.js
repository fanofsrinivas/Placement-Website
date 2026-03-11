// const createTransporter = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // MOCK EMAIL: Just log it to the console for local testing
    console.log('\n================== MOCK EMAIL ==================');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT (HTML): \n${html.replace(/<[^>]+>/g, '').trim()}`);
    console.log('================================================\n');

    return { messageId: 'mock-id-123' };
  } catch (error) {
    console.error('Email error:', error.message);
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

module.exports = { sendEmail, sendOTPEmail, sendStatusEmail };
