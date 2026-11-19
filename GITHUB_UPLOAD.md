# GitHub me upload kaise karein

Ye ZIP download karke extract karein. Andar pura clean project milta hai — `node_modules`, `.next` aur real `.env` isme nahi hain.

## Method 1 — GitHub website se direct upload

1. GitHub par login karein → **New repository** → name kuch bhi rakhein, jaise `promiseme`.
2. Repository banane ke baad **Add file → Upload files** par jayein.
3. Extract ki gayi folder ke **andar ki saari files/folders** select karke drag-drop karein. (`promiseme` folder khud upload na karein, uske andar ki cheezein upload karein.)
4. Commit message likhein: `Initial PromiseMe source` → **Commit changes**.

## Method 2 — Terminal se push (recommended)

Extract ki gayi folder me terminal kholein:

```bash
git init
git add .
git commit -m "Initial PromiseMe source"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

`YOUR_USERNAME` aur `YOUR_REPO` apne GitHub account ke hisaab se badlein.

## Upload ke baad locally chalane ke liye

```bash
npm install
cp .env.example .env
# .env me DATABASE_URL set karein
npx drizzle-kit push
npm run dev
```

## Important

- Real `.env` ZIP me nahi hai; sirf `.env.example` hai. Secret kabhi commit na karein.
- `node_modules` bhi nahi hai; `npm install` se ban jayega.
- `public/images/` me site ki saari artwork already included hai.
- Is ZIP me deployment nahi kiya gaya hai — sirf source code hai.

Aur detail ke liye `DEPLOYMENT.md` aur `OWNERSHIP.md` dekhein.
