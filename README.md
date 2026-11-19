# promiseme.com

A Webtoon-inspired fullstack community app for high-resolution manga uploads, webtoon-style reading, voice clips, Reddit-style discussions, live chat, and editable owner social handles. Readers and creators need **no sign-up, email, OTP or verification**.

## Stack

- Next.js 16 App Router
- React 19 + Tailwind CSS 4
- PostgreSQL via Drizzle ORM
- TypeScript, lucide-react icons

## Local setup

```bash
npm install
cp .env.example .env
# edit .env and set DATABASE_URL
npx drizzle-kit push
npm run dev
```

Open `http://localhost:3000`. The first request seeds starter comics, voice clips, chat rooms and discussion threads once.

## Routes

- `/` — home feed and featured carousel
- `/comics`, `/comics/[id]` — library and series detail
- `/read/[episodeId]` — vertical full-quality reader
- `/upload` — new series / add episode with high-res panels
- `/voice` — voice library, upload and browser recording
- `/community`, `/community/[id]` — threads, votes and nested comments
- `/chat` — live rooms with polling
- `/about` — owner profile and social handles
- `/api/health` — healthcheck

## Uploads

Images and audio are stored as `bytea` in the `assets` table and served through `/api/assets/[id]`. Max 20 MB per image and 30 MB per audio file. Panels keep their original bytes/quality.

## Owner tools

The About page edits the owner profile and social handles. Set `OWNER_EDIT_KEY` in the environment to protect only those controls. Regular users still never see any verification step.

See `GITHUB_UPLOAD.md` to push this folder to GitHub, `DEPLOYMENT.md` for permanent hosting, and `OWNERSHIP.md` for ownership details.
