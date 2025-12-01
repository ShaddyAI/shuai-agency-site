# Deployment Guide: GitHub + Vercel

## Step 1: Create GitHub Repository

### Option A: Via GitHub CLI (Recommended)

```bash
cd /home/user/shuai-agency-site

# Install GitHub CLI if not already installed
# (May already be available in your environment)

# Login to GitHub
gh auth login

# Create repository
gh repo create shuai-agency-site --public --source=. --remote=origin --push

# This will:
# - Create a new public repository on GitHub
# - Add it as the origin remote
# - Push all code to GitHub
```

### Option B: Via GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `shuai-agency-site`
3. Description: "Production Next.js website for ShuAI - AI agency with chat, voice agent, and integrations"
4. Visibility: Public (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

Then push your code:

```bash
cd /home/user/shuai-agency-site

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shuai-agency-site.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended for first-time)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find and select `shuai-agency-site`
5. Click "Import"

**Configure Project:**
- Framework Preset: Next.js (auto-detected)
- Root Directory: `./` (leave default)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

6. Click "Environment Variables" to expand

**Add Required Environment Variables:**

```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
DATABASE_URL=your_database_url_here
REDIS_URL=your_redis_url_here
OPENAI_API_KEY=your_openai_key_here
OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o-mini
ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
```

**Optional (for integrations):**
```
GHL_API_KEY=your_ghl_key
GHL_ACCOUNT_ID=your_ghl_account
N8N_WEBHOOK_SECRET=your_n8n_secret
NEXT_PUBLIC_ANALYTICS_ID=your_ga_id
SENTRY_DSN=your_sentry_dsn
COOKIE_CONSENT_KEY=random_secret_key
```

7. Click "Deploy"

Vercel will:
- Clone your repository
- Install dependencies
- Build the project
- Deploy to production
- Give you a URL like: https://shuai-agency-site.vercel.app

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the project directory
cd /home/user/shuai-agency-site
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name: shuai-agency-site
# - Directory: ./ (default)
# - Override settings? No

# Vercel will give you a preview URL

# Add environment variables via CLI or dashboard
vercel env add OPENAI_API_KEY
# (Enter the value when prompted)

# Deploy to production
vercel --prod
```

## Step 3: Setup Database & Services

Before your deployment works fully, you need to provision these services:

### 1. PostgreSQL with pgvector

**Option A: Vercel Postgres (Recommended)**
```bash
# In your Vercel dashboard
# Project Settings → Storage → Create Database → Postgres
# This auto-adds DATABASE_URL to env vars
```

After creation:
```bash
# Connect and initialize
vercel env pull .env.local
npm run db:seed
npm run index:embeddings
```

**Option B: Supabase**
1. Go to https://supabase.com/dashboard/projects
2. Create new project
3. Go to Database → Extensions → Enable "vector"
4. Copy connection string to DATABASE_URL
5. Run migrations

**Option C: Neon**
1. Go to https://neon.tech
2. Create database with "pgvector" enabled
3. Copy connection string

### 2. Redis

**Option A: Upstash (Recommended for Vercel)**
```bash
# In Vercel dashboard
# Integrations → Upstash → Add Integration
# This auto-adds REDIS_URL
```

**Option B: Vercel KV**
```bash
# Project Settings → Storage → Create → KV
```

### 3. OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy to OPENAI_API_KEY env var

### 4. Generate Admin Password Hash

```bash
# On your local machine
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD', 10))"

# Copy output to ADMIN_PASSWORD_HASH in Vercel
```

## Step 4: Initialize Database

After database is provisioned:

```bash
# Option A: Run locally then sync
npm run db:seed
npm run index:embeddings

# Option B: Via Vercel CLI (connect to production DB)
vercel env pull .env.local
npm run db:seed
npm run index:embeddings
```

## Step 5: Verify Deployment

Visit your Vercel URL and check:

- [ ] Homepage loads
- [ ] Chat widget appears after 6 seconds
- [ ] Case study page loads: /case-studies/cs-001
- [ ] Admin panel accessible: /admin
- [ ] No console errors

## Step 6: Setup Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain: `shuai.com` or `yourdomain.com`
3. Configure DNS records (Vercel will show you what to add)
4. Update NEXT_PUBLIC_SITE_URL to your custom domain
5. Redeploy

## Step 7: Setup Integrations (Optional)

### GoHighLevel
- Follow `handoff/GHL-Setup.md`
- Add GHL_API_KEY and GHL_ACCOUNT_ID to Vercel env vars
- Redeploy

### n8n
- Import workflows from `handoff/n8n-import.json`
- Add N8N_WEBHOOK_SECRET to Vercel
- Redeploy

### Google Analytics
- Add NEXT_PUBLIC_ANALYTICS_ID to Vercel
- Redeploy

## Troubleshooting

### Build fails
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing env vars → Add them
# - TypeScript errors → Fix in code and push
```

### Database connection fails
```bash
# Verify DATABASE_URL format
# Should be: postgres://user:pass@host:5432/dbname
# Enable SSL if required: ?sslmode=require
```

### Chat not working
```bash
# Check:
# - OPENAI_API_KEY is set
# - Database has embeddings (run index:embeddings)
# - No CORS errors in console
```

## Quick Commands Reference

```bash
# Push code changes
git add .
git commit -m "Your message"
git push

# Vercel will auto-deploy on push to main branch

# Deploy specific branch
vercel --prod

# View logs
vercel logs

# Pull env vars
vercel env pull

# Open project in browser
vercel --open
```

## Next Steps

After successful deployment:

1. ✅ Test all features on staging URL
2. ✅ Follow `handoff/30-day-launch-checklist.md`
3. ✅ Import n8n workflows
4. ✅ Setup GoHighLevel if needed
5. ✅ Configure custom domain
6. ✅ Announce launch! 🚀

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Project README: `/home/user/shuai-agency-site/README.md`
- Handoff docs: `/home/user/shuai-agency-site/handoff/`

---

**Your project is ready to deploy!** 

The code is in `/home/user/shuai-agency-site` and ready to push to GitHub.
