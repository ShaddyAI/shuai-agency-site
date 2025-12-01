# 🚀 Quick Start - Deploy in 5 Minutes

## TL;DR - Fastest Path to Production

### 1️⃣ Push to GitHub (2 min)

**Easy Way - Run the helper script:**
```bash
cd /home/user/shuai-agency-site
./scripts/deploy-to-github.sh
```

**Or manually:**
1. Create repo: https://github.com/new (name: `shuai-agency-site`)
2. Push code:
```bash
cd /home/user/shuai-agency-site
git remote add origin https://github.com/YOUR_USERNAME/shuai-agency-site.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy to Vercel (3 min)

1. **Import Project**
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `shuai-agency-site` repo
   - Click "Import"

2. **Add Environment Variables** (Minimum to get started)
   
   Click "Environment Variables" and add these:
   
   ```
   OPENAI_API_KEY=sk-your-key-here
   ADMIN_PASSWORD_HASH=$2a$10$example_hash_here
   ```
   
   Generate admin hash:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
   ```

3. **Click Deploy** 🎉

   Vercel will give you a URL like: `https://shuai-agency-site-xxx.vercel.app`

### 3️⃣ Add Database (After First Deploy)

**Vercel Postgres (Easiest):**
1. In Vercel dashboard → Project Settings → Storage
2. Click "Create Database" → Select "Postgres"
3. This automatically adds `DATABASE_URL` to your project
4. In your terminal:
   ```bash
   cd /home/user/shuai-agency-site
   vercel env pull .env.local
   npm run db:seed
   npm run index:embeddings
   ```

**Upstash Redis:**
1. In Vercel → Integrations → Upstash
2. Click "Add Integration"
3. This automatically adds `REDIS_URL`

### 4️⃣ Redeploy

After adding database:
```bash
vercel --prod
```

Or trigger redeploy from Vercel dashboard → Deployments → "Redeploy"

---

## ✅ You're Live!

Visit your Vercel URL and:
- Chat widget appears after 6 seconds
- Test chat: "We need more qualified leads"
- Visit: `/case-studies/cs-001`
- Admin: `/admin` (use your password)

---

## 🎯 Optional Enhancements

### Custom Domain
1. Vercel → Settings → Domains
2. Add your domain
3. Update DNS records
4. Add env var: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
5. Redeploy

### GoHighLevel Integration
1. Get API key from GHL
2. Add to Vercel env vars:
   ```
   GHL_API_KEY=your_key
   GHL_ACCOUNT_ID=your_account_id
   ```
3. Follow `handoff/GHL-Setup.md`
4. Redeploy

### n8n Workflows
1. Import `handoff/n8n-import.json` to your n8n instance
2. Add to Vercel:
   ```
   N8N_WEBHOOK_SECRET=your_secret
   N8N_WEBHOOK_BASE=https://your-n8n.com/webhook
   ```
3. Redeploy

### Analytics
Add to Vercel:
```
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 🐛 Troubleshooting

**Build fails?**
- Check env vars are set
- View build logs in Vercel dashboard

**Chat not working?**
- Verify `OPENAI_API_KEY` is set
- Run `npm run index:embeddings`

**Database errors?**
- Check `DATABASE_URL` format
- Verify database was seeded

**Need help?**
- See full guide: `DEPLOYMENT.md`
- Check docs: `README.md`
- Review handoff: `handoff/`

---

## 📋 Environment Variables Reference

### Required (Minimum)
```bash
OPENAI_API_KEY=sk-xxx                    # OpenAI API key
ADMIN_PASSWORD_HASH=bcrypt_hash          # Admin password (bcrypt)
```

### Recommended
```bash
DATABASE_URL=postgres://...              # Postgres with pgvector
REDIS_URL=redis://...                    # Redis for rate limiting
NEXT_PUBLIC_SITE_URL=https://...         # Your domain
```

### Optional
```bash
GHL_API_KEY=ghl_xxx                      # GoHighLevel API key
GHL_ACCOUNT_ID=xxx                       # GoHighLevel account
N8N_WEBHOOK_SECRET=xxx                   # n8n webhook secret
N8N_WEBHOOK_BASE=https://...             # n8n base URL
NEXT_PUBLIC_ANALYTICS_ID=G-XXX           # Google Analytics
SENTRY_DSN=https://...                   # Sentry error tracking
PINECONE_API_KEY=xxx                     # Alternative to pgvector
```

Full list in `.env.example`

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Homepage loads at Vercel URL
- [ ] Chat widget appears (after 6s or scroll)
- [ ] Can send chat messages
- [ ] Case studies page works
- [ ] Admin panel accessible with password
- [ ] No errors in browser console

---

**That's it! Your site is live.** 🚀

For detailed configuration, see `DEPLOYMENT.md` and `handoff/30-day-launch-checklist.md`
