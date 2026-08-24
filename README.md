# Black Scottish Communicators (BSC) — Phase 1 Platform

Next.js 15 + Supabase Phase 1 build: multi-page public site, Team page,
member onboarding (magic-link auth), member dashboard, and a fully gated
`/admin` control centre with real CRUD (members, team, hubs, events,
programmes, membership pricing, website content editor) plus image uploads
via Supabase Storage. The guardrailed "BSC Assistant" AI chat widget is
included on the public site.

## Stack
- Next.js 15.5.9 (App Router, TypeScript, Tailwind v4)
- Supabase (Postgres, Auth, RLS, Storage)
- Deployed via Netlify (Git-connected, continuous deployment)

## Environment variables required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY` (for the BSC Assistant chat widget)

## Admin access
Visit `/admin` — separate, gated sign-in (magic link) restricted to staff
roles (staff_admin, finance_admin, impact_admin, director, super_admin) in
the `member_roles` table. Grant the first admin manually via Supabase SQL.

## Local development
```bash
npm install
npm run dev
```
