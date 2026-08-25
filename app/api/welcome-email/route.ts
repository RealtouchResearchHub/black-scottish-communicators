import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = (await req.json()) as { email: string; firstName: string };

    if (!email || !firstName) {
      return NextResponse.json({ error: "Missing email or firstName" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.RESEND_FROM_ADDRESS || "Black Scottish Communicators <hello@realtouchhr.com>";

    if (!apiKey) {
      // Not configured yet — fail quietly so signup itself is never blocked.
      console.warn("RESEND_API_KEY not set; skipping welcome email.");
      return NextResponse.json({ skipped: true });
    }

    const html = `
      <!doctype html>
      <html>
        <body style="margin:0;padding:0;background:#f3efe6;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe6;padding:32px 0;">
            <tr><td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
                <tr><td style="background:#0e0d0c;padding:28px 32px;">
                  <p style="color:#cba968;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0;">Black Scottish Communicators</p>
                  <h1 style="color:#f3efe6;font-family:Georgia,serif;font-size:24px;margin:10px 0 0;">Welcome to BSC, ${firstName}.</h1>
                </td></tr>
                <tr><td style="padding:28px 32px;color:#2a2a2a;font-size:14px;line-height:1.6;">
                  <p>Your BSC profile is ready. Here's how to get back in any time:</p>
                  <table cellpadding="0" cellspacing="0" style="background:#f3efe6;border-radius:8px;width:100%;margin:16px 0;">
                    <tr><td style="padding:14px 18px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#6b6b6b;text-transform:uppercase;letter-spacing:0.5px;">Your login email</p>
                      <p style="margin:0;font-size:15px;font-weight:bold;color:#0e0d0c;">${email}</p>
                    </td></tr>
                  </table>
                  <p>BSC uses secure, passwordless sign-in — no password to remember. Just visit the Member Login page, enter this email, and we'll send you a one-time secure link.</p>
                  <p style="margin-top:24px;">
                    <a href="https://www.britishscottishcommunicators.org.uk/login" style="background:#a9843c;color:#0e0d0c;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold;display:inline-block;">Go to Member Login</a>
                  </p>
                  <p style="margin-top:28px;color:#6b6b6b;font-size:13px;">Questions? Just reply to this email or reach hello@britishscottishcommunicators.org.uk.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: "Welcome to Black Scottish Communicators",
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend send failed:", text);
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 502 });
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Welcome email route error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
