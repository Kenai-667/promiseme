# Is promiseme.com mine?

## Short answer

The application code and files in this workspace are yours to copy, modify, deploy and use. You control what users see once you deploy it. I cannot buy a domain, create a hosting/billing account, or legally transfer a trademark from this sandbox.

## What you already control

- The full Next.js + PostgreSQL source code in this project.
- The `promiseme.com` branding, layout, sections and UI text shown in the app.
- The editable owner profile and social handles on the About page.
- Every comic, voice clip, thread and chat message you upload or publish.
- The database and asset storage after you deploy to your own hosting account.

## What is not yet yours automatically

- The real internet domain `promiseme.com`: it is only displayed as a brand name here. It has not been purchased, registered or connected by this workspace. Check availability and trademark status before buying it.
- The sandbox preview URL: it is platform-managed and temporary.
- Permanent hosting: whoever controls the Vercel/hosting account, `DATABASE_URL`, DNS and billing controls the live production site. Use your own account for real ownership.
- Legal ownership of third-party or copyrighted material: only upload art, manga and audio you have the rights to share.

## Starter content

The eight illustrated series, generated cover art, sample voice scripts and demo community posts are starter/demo content so the site looks complete. Replace or remove them with your own stories, artwork and social links before a public launch. Content you create or upload remains under your control, subject to the rights you hold in it.

## Why the site is open by design

You asked for **no user verification**, so readers and creators can publish comics, add voices, post, comment, vote and chat with only a display name. That means a public site is intentionally open to everyone.

To protect only the owner identity controls without adding verification for users, set a private server-side secret:

- `OWNER_EDIT_KEY` = a long random string known only to you.

When this variable is set, the About page owner tools require that key in a private field. All normal user features remain completely verification-free. When the variable is not set, the local/demo owner tools stay open for easy testing.

See `DEPLOYMENT.md` for permanent hosting, database and domain setup.
