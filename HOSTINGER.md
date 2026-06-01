# Deploy Kuppiundo on Hostinger

This app needs **Hostinger Node.js Web Apps** (Business or Cloud plan). Shared PHP-only hosting will not run Next.js.

GitHub repo: https://github.com/rahulpramod95/kuppiundo.in

## 1. hPanel — create the app

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com).
2. Go to **Websites** → **Add Website**.
3. Choose **Node.js Apps** (or **Frontend web app**).
4. Select **Import Git Repository**.
5. Connect GitHub and pick **`rahulpramod95/kuppiundo.in`**.
6. Branch: **`main`**.

## 2. Build settings

Use these values if auto-detect is wrong:

| Setting | Value |
|--------|--------|
| Framework | **Next.js** |
| Node.js version | **20** |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm run start -- -p $PORT` |
| Output directory | `.next` (leave default if Next.js is detected) |

## 3. Environment variables

Optional for this app (no secrets required today):

```env
NODE_ENV=production
```

Add later if needed:

```env
NEXT_PUBLIC_APP_URL=https://kuppiundo.in
```

## 4. Deploy

Click **Deploy** and wait for the build to finish. Hostinger will assign a temporary URL first.

## 5. Connect domain `kuppiundo.in`

1. In hPanel, open the Node.js site → **Domains**.
2. Add **kuppiundo.in** and **www.kuppiundo.in**.
3. If the domain is on another Hostinger site, remove the old website first (download a backup if needed).
4. DNS (if domain is at Hostinger): point the domain to this Node.js app when prompted.
5. Enable **SSL** (Let’s Encrypt) in hPanel after DNS propagates.

External DNS (domain not on Hostinger):

- **A record** `@` → your Hostinger app IP (shown in hPanel)
- **CNAME** `www` → your Hostinger hostname (or A record to same IP)

## 6. Auto-deploy from GitHub

After the first deploy, pushes to `main` can trigger rebuilds if **Auto deployment** is enabled in the app settings.

## Local check before deploy

```bash
npm ci
npm run build
npm run start -- -p 3000
```

Open http://localhost:3000/ml

## Troubleshooting

**Build fails** — Run `npm run build` locally and fix errors first.

**App crashes on start** — Start command must be `npm run start -- -p $PORT` (Hostinger sets `$PORT`).

**404 on routes** — Do not use static export; this app uses Next.js server mode + middleware (next-intl).

**Wrong language** — Default locale is Malayalam (`/ml`). English is at `/en`.
