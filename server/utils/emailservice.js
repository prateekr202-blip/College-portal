const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendStatusUpdateEmail = async ({ to, studentName, requestId, requestType, status, remark }) => {
  const statusColors = {
    SUBMITTED: "#6366f1",
    UNDER_REVIEW: "#b45309",
    IN_PROGRESS: "#0369a1",
    APPROVED: "#166534",
    REJECTED: "#dc2626",
    READY_FOR_COLLECTION: "#7c3aed",
    COMPLETED: "#166534",
  };

  const color = statusColors[status] || "#2d5a27";
  const statusLabel = status.replace(/_/g, " ");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2ddd5;">
        
        <!-- Header -->
        <div style="background:#1c3319;padding:32px 40px;">
          <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
            Campus<span style="color:#b8943c;">Portal</span>
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;">Administrative Services Management</div>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <p style="font-size:15px;color:#4a5568;margin:0 0 8px;">Hello, <strong style="color:#1c2b1a;">${studentName}</strong></p>
          <p style="font-size:15px;color:#4a5568;margin:0 0 32px;">Your administrative request has been updated. Here are the details:</p>

          <!-- Request Info -->
          <div style="background:#f8f7f4;border-radius:10px;padding:24px;margin-bottom:24px;border:1px solid #e2ddd5;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <div>
                <div style="font-size:12px;color:#9ca3af;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Request ID</div>
                <div style="font-size:18px;font-weight:700;color:#1c2b1a;">${requestId}</div>
              </div>
              <div style="background:${color}15;color:${color};font-size:13px;font-weight:700;padding:8px 18px;border-radius:100px;border:1px solid ${color}30;">
                ${statusLabel}
              </div>
            </div>
            <div style="border-top:1px solid #e2ddd5;padding-top:16px;">
              <div style="font-size:12px;color:#9ca3af;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Request Type</div>
              <div style="font-size:15px;color:#1c2b1a;font-weight:500;">${requestType}</div>
            </div>
          </div>

          ${remark ? `
          <!-- Remark -->
          <div style="border-left:4px solid #2d5a27;padding:16px 20px;background:#f0fdf4;border-radius:0 8px 8px 0;margin-bottom:24px;">
            <div style="font-size:12px;color:#6b7a69;font-weight:600;margin-bottom:6px;">MESSAGE FROM ADMINISTRATION</div>
            <div style="font-size:14px;color:#1c2b1a;line-height:1.6;">${remark}</div>
          </div>
          ` : ""}

          ${status === "READY_FOR_COLLECTION" ? `
          <div style="background:#fffbeb;border:1px solid #fbbf24;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <div style="font-size:14px;color:#92400e;font-weight:600;">📋 Ready for Collection</div>
            <div style="font-size:13px;color:#92400e;margin-top:4px;">Please visit the admin office during working hours to collect your document. Bring your student ID card.</div>
          </div>
          ` : ""}

          ${status === "REJECTED" ? `
          <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <div style="font-size:14px;color:#dc2626;font-weight:600;">❌ Request Rejected</div>
            <div style="font-size:13px;color:#dc2626;margin-top:4px;">You may submit a new request with the required corrections. Check the remark above for details.</div>
          </div>
          ` : ""}

          <a href="http://localhost:3000/dashboard" style="display:inline-block;background:#2d5a27;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;">
            View Your Dashboard →
          </a>
        </div>

        <!-- Footer -->
        <div style="background:#f8f7f4;border-top:1px solid #e2ddd5;padding:24px 40px;text-align:center;">
          <div style="font-size:12px;color:#9ca3af;">This is an automated notification from CampusPortal.</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Please do not reply to this email.</div>
        </div>

      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"CampusPortal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[CampusPortal] Request ${requestId} — ${statusLabel}`,
    html,
  });
};

const sendWelcomeEmail = async ({ to, studentName }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2ddd5;">
        
        <div style="background:#1c3319;padding:32px 40px;">
          <div style="font-size:22px;font-weight:700;color:#ffffff;">
            Campus<span style="color:#b8943c;">Portal</span>
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;">Administrative Services Management</div>
        </div>

        <div style="padding:40px;">
          <h2 style="font-size:24px;color:#1c2b1a;margin:0 0 16px;">Welcome, ${studentName}! 🎉</h2>
          <p style="font-size:15px;color:#4a5568;line-height:1.7;margin:0 0 24px;">
            Your CampusPortal account has been created successfully. You can now submit and track administrative requests online — no more office queues.
          </p>

          <div style="background:#f8f7f4;border-radius:10px;padding:24px;margin-bottom:32px;border:1px solid #e2ddd5;">
            <div style="font-size:14px;font-weight:600;color:#1c2b1a;margin-bottom:16px;">What you can do:</div>
            ${["Submit bonafide certificates, transcripts & more", "Track your requests in real-time", "Receive instant notifications on status changes", "View admin remarks and feedback"].map(item => `
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <div style="width:6px;height:6px;border-radius:50%;background:#2d5a27;flex-shrink:0;"></div>
                <div style="font-size:14px;color:#4a5568;">${item}</div>
              </div>
            `).join("")}
          </div>

          <a href="http://localhost:3000/dashboard" style="display:inline-block;background:#2d5a27;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;">
            Go to Dashboard →
          </a>
        </div>

        <div style="background:#f8f7f4;border-top:1px solid #e2ddd5;padding:24px 40px;text-align:center;">
          <div style="font-size:12px;color:#9ca3af;">This is an automated notification from CampusPortal.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"CampusPortal" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to CampusPortal — Your account is ready",
    html,
  });
};

const sendOTPEmail = async ({ to, studentName, otp }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2ddd5;">
        <div style="background:#1c3319;padding:32px 40px;">
          <div style="font-size:22px;font-weight:700;color:#ffffff;">
            Campus<span style="color:#b8943c;">Portal</span>
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;">Password Reset Request</div>
        </div>
        <div style="padding:40px;">
          <p style="font-size:15px;color:#4a5568;margin:0 0 8px;">Hello, <strong style="color:#1c2b1a;">${studentName}</strong></p>
          <p style="font-size:15px;color:#4a5568;margin:0 0 32px;">We received a request to reset your password. Use the OTP below — it expires in <strong>10 minutes</strong>.</p>

          <div style="text-align:center;margin:32px 0;">
            <div style="display:inline-block;background:#f8f7f4;border:2px dashed #2d5a27;border-radius:16px;padding:24px 48px;">
              <div style="font-size:11px;color:#9ca3af;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your OTP</div>
              <div style="font-size:48px;font-weight:800;color:#1c2b1a;letter-spacing:12px;">${otp}</div>
            </div>
          </div>

          <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px 20px;margin-top:24px;">
            <div style="font-size:13px;color:#dc2626;font-weight:600;">⚠️ Security Notice</div>
            <div style="font-size:13px;color:#dc2626;margin-top:4px;">If you didn't request this, please ignore this email. Your password will not be changed.</div>
          </div>
        </div>
        <div style="background:#f8f7f4;border-top:1px solid #e2ddd5;padding:24px 40px;text-align:center;">
          <div style="font-size:12px;color:#9ca3af;">This OTP expires in 10 minutes.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"CampusPortal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${otp} is your CampusPortal password reset OTP`,
    html,
  });
};

module.exports = { sendStatusUpdateEmail, sendWelcomeEmail, sendOTPEmail };