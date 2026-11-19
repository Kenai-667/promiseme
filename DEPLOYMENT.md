# promiseme.com — Permanent browser deployment

The sandbox preview URL is managed by this workspace and is **not a permanent public host**. To keep the site live forever in a browser, deploy this exact project to a host such as Vercel and connect a real domain. The app is already production-ready; no code rewrite is needed.

## Who owns the deployed site?

The code in this workspace is yours to copy, modify and deploy. Once you deploy it under your own hosting account, database and domain, you control the live site. The real `promiseme.com` domain has not been purchased or registered here; buy it and connect DNS yourself. See `OWNERSHIP.md` for the full breakdown, including demo artwork and starter content.

## What is already persistent

- Comics, episodes, uploaded high-resolution image bytes, audio clips, social handles, threads, comments and live chat are all saved in PostgreSQL through Drizzle ORM.
- Uploaded images/audio live in the `assets` table (`bytea`), not in an ephemeral local folder. As long as you keep the **same database**, your uploads survive redeploys and browser restarts.
- Demo content is seeded once on the first request through `src/lib/seed.ts`.
- No sign-up, email, OTP or verification is required for readers and creators.

## 1. Create a permanent database

Use Neon, Supabase, Vercel Postgres, Railway or any managed PostgreSQL provider. Copy its connection string, including `?sslmode=require` when required.

Never commit the real connection string. Set it as `DATABASE_URL` in your hosting dashboard.

## 2. Push this repo to GitHub

```bash
git init
git add .
git commit -m "PromiseMe fullstack app"
git remote add origin https://github.com/YOUR_USERNAME/promiseme.git
git push -u origin main
```

`.env` should remain local/uncommitted. Use `.env.example` as the template.

## 3. Import into Vercel

1. Create a new Vercel project from the GitHub repository. Vercel auto-detects Next.js; `vercel.json` is included as an explicit hint.
2. Add these environment variables before deploying:
   - `DATABASE_URL` = your managed PostgreSQL connection string
   - `NEXT_PUBLIC_SITE_URL` = `https://promiseme.com`
   - `OWNER_EDIT_KEY` = a long random private string (recommended)
3. Deploy. Build command: `npm run build`.

`OWNER_EDIT_KEY` protects only the About-page owner profile and social-handle controls. It does **not** add verification for readers, creators, chat, posts, comments or voice uploads. If you leave it unset, owner tools stay open in demo mode and anyone on a public site could edit them.

## 4. Create the tables once

Run this from your local machine against the production database string:

```bash
DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require' npx drizzle-kit push --force
```

`drizzle.config.ts` now reads `DATABASE_URL` from the environment instead of a hardcoded local URL. Running the command again is safe; it only reconciles the schema. The first page request then seeds the starter comics/rooms automatically.

## 5. Connect promiseme.com

1. Buy/own the `promiseme.com` domain from any registrar.
2. In Vercel → Project → Settings → Domains, add `promiseme.com` and `www.promiseme.com`.
3. Add the DNS records Vercel shows at your registrar (usually an A record for the apex domain and a CNAME for `www`).
4. Wait for DNS/SSL verification. Vercel issues HTTPS automatically.
5. Set `NEXT_PUBLIC_SITE_URL=https://promiseme.com` and redeploy so `robots.txt`, the sitemap and social metadata use the final domain.

## 6. Verify the live site

- `/api/health` should return `{"ok":true}`.
- `/comics`, `/upload`, `/voice`, `/community`, `/chat` and `/about` should return 200.
- Upload one test comic and one voice clip, redeploy, and confirm both are still there. That proves database persistence.
- With `OWNER_EDIT_KEY` set, saving owner details without the key should fail, while comic/voice/chat/post actions should still work without any verification.

## Notes for scale

- For a large public site, move binary assets from PostgreSQL `bytea` to object storage such as Vercel Blob, S3 or Cloudflare R2, and save only the returned URL in `assets`/`pages`. The current design is fully functional for a small-to-medium launch.
- `public/manifest.webmanifest` and `public/icon.svg` make the site installable as a browser/app shortcut on supported devices.
- The domain purchase, DNS ownership and hosting account must be completed by the site owner; those require account/billing access outside this workspace.
