const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailParams) {
  if (RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Wujood <onboarding@wujood.app>", to, subject, text, html }),
    });
    if (!res.ok) console.error("Email send failed:", await res.text());
    return res.ok;
  }
  console.log(`[DEV EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
  return true;
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Wujood!",
    text: `Hi ${name},\n\nWelcome to Wujood! We're excited to help you build your online presence.\n\nGet started by running your first audit.\n\nBest,\nThe Wujood Team`,
    html: `<p>Hi ${name},</p><p>Welcome to Wujood! We're excited to help you build your online presence.</p><p>Get started by running your first audit.</p><p>Best,<br>The Wujood Team</p>`,
  });
}

export async function sendPaymentConfirmation(email: string, amount: number) {
  return sendEmail({
    to: email,
    subject: "Payment Confirmed - Wujood",
    text: `Your payment of EGP ${amount} has been confirmed.\n\nThank you for your purchase!\n\nBest,\nThe Wujood Team`,
    html: `<p>Your payment of <strong>EGP ${amount}</strong> has been confirmed.</p><p>Thank you for your purchase!</p><p>Best,<br>The Wujood Team</p>`,
  });
}

export async function sendAuditCompleteEmail(email: string, url: string, score: number) {
  return sendEmail({
    to: email,
    subject: "Your Audit is Ready - Wujood",
    text: `Your audit for ${url} is complete! Score: ${score}/100.\n\nLog in to view the full report.\n\nBest,\nThe Wujood Team`,
    html: `<p>Your audit for <strong>${url}</strong> is complete!</p><p>Score: <strong>${score}/100</strong></p><p><a href="https://wujood.app/dashboard">Log in</a> to view the full report.</p><p>Best,<br>The Wujood Team</p>`,
  });
}
