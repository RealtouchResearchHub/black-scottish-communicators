import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ClaimBody = {
  email: string;
  firstName: string;
  lastName: string;
  hubId: string;
  consentPrivacy: boolean;
  consentTerms: boolean;
  consentEmail: boolean;
  consentWhatsapp: boolean;
  consentPhoto: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ClaimBody;
    const email = body.email?.trim().toLowerCase();

    if (!email || !body.firstName || !body.lastName || !body.hubId) {
      return NextResponse.json({ error: "Missing required details." }, { status: 400 });
    }
    if (!body.consentPrivacy || !body.consentTerms) {
      return NextResponse.json(
        { error: "Privacy notice and membership terms must be accepted to continue." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Find an existing user by email, or create a new confirmed one.
    // (Confirmed immediately - no email verification step, since the CRM
    // welcome email already served that purpose.)
    let userId: string;
    const { data: existingList, error: listErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      // @ts-expect-error - filter by email is supported by the Admin API at runtime
      email,
    });
    if (listErr) throw listErr;

    const existingUser = existingList?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (createErr || !created.user) {
        throw createErr ?? new Error("Failed to create account.");
      }
      userId = created.user.id;
    }

    const { error: memberErr } = await admin.from("members").upsert({
      id: userId,
      first_name: body.firstName,
      last_name: body.lastName,
      email,
      hub_id: body.hubId,
      status: "active",
      skills: [],
      development_interests: [],
      participation_interests: [],
    });
    if (memberErr) throw memberErr;

    const consentRows = [
      { member_id: userId, consent_type: "privacy_notice", granted: body.consentPrivacy },
      { member_id: userId, consent_type: "membership_terms", granted: body.consentTerms },
      { member_id: userId, consent_type: "marketing_email", granted: !!body.consentEmail },
      { member_id: userId, consent_type: "marketing_whatsapp", granted: !!body.consentWhatsapp },
      { member_id: userId, consent_type: "photo_video_testimonial", granted: !!body.consentPhoto },
    ];
    await admin.from("consents").insert(consentRows);

    const { error: rpcErr } = await admin.rpc("admin_complete_member_signup", {
      target_member_id: userId,
    });
    if (rpcErr) throw rpcErr;

    // Generate a magic link server-side and hand the action_link back to
    // the browser to follow directly - completes sign-in in one round
    // trip, with no dependency on any email actually being delivered.
    const origin = req.nextUrl.origin;
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${origin}/auth/callback?next=/member` },
    });
    if (linkErr || !linkData) throw linkErr ?? new Error("Failed to generate sign-in link.");

    return NextResponse.json({ actionLink: linkData.properties.action_link });
  } catch (err) {
    console.error("claim-account error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
