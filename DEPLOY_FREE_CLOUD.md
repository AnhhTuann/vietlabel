# Vietlabel full-stack — cloud Free deployment review

## Current state

The Render static frontend is live at https://vietlabel-preview.onrender.com.
This Blueprint would create **another** Render Free Node web service serving frontend and backend at one origin.
It is NOT activated by this PR.

## Required production checks

1. In Neon, confirm existing project `vietlabel`, correct database, valid backup and schema. NEVER reset it or import demo users over production.
2. Review migration script: it includes CMS seeds and initial-Admin bootstrap. Do **not** run it automatically on the existing production DB. The only new schema this change needs is:
   ```sql
   CREATE TABLE IF NOT EXISTS private_uploads (
     id UUID PRIMARY KEY,
     content BYTEA NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```
3. Approve Render Blueprint only when the `DATABASE_URL` (Neon pooled, SSL) and `APP_BASE_URL` are set privately in Render. The URL must be the actual Render hostname or eventual custom domain.
4. The Blueprint generates `JWT_SECRET` once: keep it stable across redeploys; changing it invalidates existing sessions.
5. On Render set `UPLOAD_STORAGE_BACKEND=postgres`. Private CVs and artwork then use a non-public PostgreSQL BYTEA table rather than Render's ephemeral filesystem. A hard 256 MiB application quota is enforced for all stored file bytes; Neon Free has a finite total per-project storage limit. Monitor this usage.
6. The default `AI_PROVIDER=rules` avoids Gemini billing. Features requiring Gemini, Telegram, Google Sheets, SMTP or other paid integrations remain disabled until explicitly configured.
7. Test /api/health, CMS, admin login, contact, upload and **authenticated** CV download, and check browser network and CORS before switching `vietlabel.duckdns.org`.

## Free-tier caveats

- Render Free 512 MiB RAM; sleeps after 15 minutes idle, ~1-minute wakeup.
- 750 monthly free instance hours shared by **all** free web services in the same workspace.
- Render filesystem is ephemeral. Never set `UPLOAD_STORAGE_BACKEND` to the default disk for production; this patch fails closed.
- Store business and client data with a reviewed retention policy; PostgreSQL BYTEA is intentionally a temporary low-volume solution. If uploads grow, migrate to access-controlled object storage.
- If the Neon project hits its Free usage/storage ceiling, DB requests can fail until limits reset/plan changed.
- Keep secrets in hosting settings, never committed to GitHub.

## DNS

Do not change DuckDNS to point at the Render service until the full-stack service is live and its domain has been verified. Keep Portfolio's `anhhtuann.duckdns.org` untouched.
