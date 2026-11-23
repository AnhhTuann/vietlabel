# Vietlabel full-stack — free-cloud deployment

## Deployment design

- One Render Free Node web service serves both the built Vite frontend and Express API on the same origin.
- Existing Neon PostgreSQL project `vietlabel` remains the system of record.
- A cloned Neon branch named `vietlabel-free-cloud-staging` is used for deployment verification first. It preserves a copy of current data while keeping production separate.
- Private CV/design files use the `private_uploads` PostgreSQL BYTEA table with a 256 MiB application quota. Render's ephemeral filesystem is never used for production uploads.
- `AI_PROVIDER=rules` avoids paid AI calls. Real email delivery is optional and disabled until `RESEND_API_KEY` and a verified `EMAIL_FROM` are supplied.
- Existing admin accounts are preserved. The deployment does not set `INITIAL_ADMIN_EMAIL` or `INITIAL_ADMIN_PASSWORD`, and it does not run the full seed migration.

## Verified database snapshot

At staging creation, the clone contained:
- 1 active ADMIN account
- 12 products
- 4 posts
- 3 job listings
- 4 knowledge-base documents
- 0 leads and 0 job applications

The staging branch has the same initial records as the source production branch. The additive `private_uploads` table was created and verified on staging only.

## Safe startup

Render runs `npm run db:ensure && node --import tsx server.ts`.
The `db:ensure` script only executes `CREATE TABLE IF NOT EXISTS private_uploads`; it does not reseed, reset, delete, or alter existing users/CMS/CRM records.
The server fails to start if PostgreSQL is unreachable, so the Render health check cannot report a working service while the database is disconnected.

## Required manual secret

On the Render service Environment page, set `DATABASE_URL` to the **pooled** Neon connection string for:
- Project: `vietlabel`
- Branch: `vietlabel-free-cloud-staging`
- Database: `neondb`
- Role: `neondb_owner`
- SSL: required

Never commit or paste this URL into GitHub issues, PR comments, or public chat. Keep it in Render's secret environment variable UI.

The Blueprint generates `JWT_SECRET` automatically. Keep it stable after deployment because changing it invalidates existing login tokens.

## Optional email

For real email notifications, configure a verified sender domain in Resend, then set `RESEND_API_KEY` and `EMAIL_FROM` in Render. Without these, leads are still saved to CRM and visible in Admin, but email is not sent. No SMTP is used because Render Free blocks outbound SMTP ports.

## Free-tier limitations

- Render Free web services have 512 MiB RAM, spin down after 15 minutes without inbound traffic, and take about a minute to wake.
- 750 Free instance hours are shared across the workspace per calendar month. Other Free web services (including Portfolio) also use this allowance when running.
- Render says Free instances are for testing/hobby projects and not production applications. This is a no-cost compromise, not production-grade availability.
- Render filesystem is ephemeral; the upload adapter stores private files in Neon instead.
- Neon Free has finite compute, storage and egress allowances. Monitor usage. Current Neon Free docs list 1 GB storage and 100 CU-hours per project per month.
- The 256 MiB file quota is intentionally below the database storage allowance. Large file libraries should move to a dedicated object-storage bucket.

## DNS / cutover

Do not change any DuckDNS or other custom domain until the new full-stack service passes public-page, health, Admin login, CRM lead, CMS edit, CV upload/download, and mobile checks.
Keep the current static preview and the Portfolio domain untouched during staging.
