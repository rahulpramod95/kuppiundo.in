# Deploy Kuppiundo on Vercel

GitHub repo: https://github.com/rahulpramod95/kuppiundo.in

Vercel is the recommended host for this Next.js app (middleware, i18n, server routes).

## 1. Import the project

**Fastest:** open this link while logged into Vercel:

https://vercel.com/new/clone?repository-url=https://github.com/rahulpramod95/kuppiundo.in

Or manually:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Add New…** → **Project**
3. Import **`rahulpramod95/kuppiundo.in`** from GitHub
4. Framework preset: **Next.js** (auto-detected)
5. Build command: `npm run build` (default)
6. Output: default (leave empty — do not use static export)
7. Click **Deploy**

No environment variables are required for the current app.

Every push to `main` will trigger a new production deployment if Git integration is enabled (default).

## 2. Add custom domain `kuppiundo.in`

After the first deploy succeeds:

1. Open the project in Vercel → **Settings** → **Domains**
2. Add:
   - `kuppiundo.in`
   - `www.kuppiundo.in`
3. Vercel shows the DNS records you need. Use **one** of the options below.

### Option A — Domain DNS stays at Hostinger (recommended)

In **Hostinger hPanel** → **Domains** → **kuppiundo.in** → **DNS / DNS Zone**:

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Remove conflicting records (old A/CNAME for `@` or `www` pointing to Hostinger hosting).

DNS can take up to 24–48 hours; often much faster.

Back in Vercel, wait until both domains show **Valid Configuration**.

### Option B — Use Vercel nameservers

In Hostinger, change nameservers to the ones Vercel provides in the Domains panel. Vercel then manages all DNS.

## 3. SSL

Vercel provisions **Let’s Encrypt HTTPS** automatically once DNS is valid.

## 4. Redirects (optional)

In **Domains**, set one primary domain:

- Primary: `kuppiundo.in` → redirect `www` to apex (or the reverse)

## 5. Locales

- Malayalam (default): `https://kuppiundo.in/ml`
- English: `https://kuppiundo.in/en`

You can add a Vercel redirect later so `/` goes to `/ml` if the middleware default is not enough at the edge.

## CLI deploy (optional)

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

## Troubleshooting

**Build fails on Vercel** — Run `npm run build` locally first.

**Domain stuck on “Pending”** — Double-check Hostinger DNS; remove old Hostinger website A records.

**404 on refresh** — Should not happen on Vercel with Next.js App Router; if it does, confirm the project is Next.js, not static export.

**Still on Hostinger Node app** — Disable/remove the Hostinger Node.js site so DNS is not pointing there.
