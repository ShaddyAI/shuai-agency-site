# ShuAI Agency Website

Production Next.js website with AI chat, voice agent, GoHighLevel + n8n integration, and admin panel.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

### Local Development

1. **Clone and install**
```bash
git clone <your-repo>
cd shuai-agency-site
npm install
```

2. **Setup environment**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Start services**
```bash
docker-compose up -d
```

4. **Run migrations and seed**
```bash
npm run db:migrate
npm run db:seed
npm run index:embeddings
```

5. **Start dev server**
```bash
npm run dev
```

Open http://localhost:3000

## 📋 Environment Variables

### Required
```bash
DATABASE_URL=postgres://user:pass@localhost:5432/shuai
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-xxx
ADMIN_PASSWORD_HASH=bcrypt_hash_here
```

### Optional (Integrations)
```bash
GHL_API_KEY=ghl_xxx
GHL_ACCOUNT_ID=xxx
N8N_WEBHOOK_SECRET=xxx
PINECONE_API_KEY=xxx
```

See `.env.example` for full list.

## 🔧 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run all tests
npm run test:unit    # Run unit tests
npm run test:integration  # Run integration tests
npm run db:seed      # Seed database
npm run index:embeddings  # Reindex site content
npm run audit        # Security audit
```

## 📦 Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with pgvector
- **Cache**: Redis
- **AI**: OpenAI (GPT-4o-mini, Whisper, TTS, Embeddings)
- **Integrations**: GoHighLevel, n8n

### Directory Structure
```
/shuai-agency-site
├─ app/              # Next.js app directory
│  ├─ components/    # React components
│  ├─ lib/           # Client utilities
│  ├─ api/           # API routes
│  ├─ admin/         # Admin panel
│  └─ case-studies/  # Case study pages
├─ server/           # Server-side logic
│  ├─ db.ts          # Database operations
│  ├─ chat-agent.ts  # AI chat logic
│  ├─ gh-api.ts      # GHL integration
│  └─ n8n-webhooks.ts # n8n integration
├─ scripts/          # Maintenance scripts
├─ tests/            # Test files
└─ handoff/          # Documentation
```

## 🤖 Chat & Voice Agent

### Chat Features
- Proactive engagement (6s delay or 40% scroll)
- RAG-powered responses using pgvector embeddings
- Qualification in ≤3 questions
- Suggested actions (book, case study, email)

### Voice Features
- Click-to-talk with Web Speech API
- OpenAI Whisper transcription
- TTS responses
- Consent recording

## 🔗 Integrations

### GoHighLevel
- Contact creation with custom fields
- Pipeline automation (ai-audit → booked)
- Email/SMS triggers
- See `handoff/GHL-Setup.md`

### n8n Workflows
1. **Lead Enrichment**: Clearbit/FullContact lookup
2. **Backup to Sheets**: All leads logged to Google Sheets
3. **Follow-up Sequence**: 48h email, 7d SMS
- Import: `handoff/n8n-import.json`

## 🛡️ Admin Panel

Access: `/admin`

Features:
- Edit hero copy and metrics (ISR)
- Configure chat behavior
- View and export leads
- Update chat prompts (versioned)
- Reindex embeddings

Default password: Set `ADMIN_PASSWORD_HASH` in env.

Generate hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

Key test: `tests/integration/leadflow.test.ts`
- Simulates full chat → qualify → GHL → sheets flow

### Lighthouse CI
```bash
npx lhci autorun
```
Targets: Performance ≥90, Accessibility ≥95

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect repo to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy**
```bash
vercel --prod
```

Preview: Provided in handoff/deploy.txt

### Docker

```bash
docker build -t shuai-agency-site .
docker run -p 3000:3000 --env-file .env shuai-agency-site
```

## 🔄 How to...

### Rotate API Keys

1. Generate new key in provider (OpenAI, GHL, etc)
2. Update Vercel env variables
3. Redeploy (automatic with env change)
4. Revoke old key

### Reindex Embeddings

When site content changes:
```bash
npm run index:embeddings
```

Or via admin panel: `/admin/reindex`

### Update Chat Prompts

1. Login to admin: `/admin`
2. Navigate to Chat Settings
3. Edit system prompt
4. Save (creates new version)

Or directly in `server/chat-agent.ts` and redeploy.

### Add New Case Study

1. Add entry to seed script: `scripts/seed-db.ts`
2. Run seed: `npm run db:seed`
3. Reindex: `npm run index:embeddings`

Or via database:
```sql
INSERT INTO case_studies (...) VALUES (...);
```

## 📊 Monitoring

### Logs
- Vercel: Dashboard → Logs
- Local: `docker-compose logs -f app`

### Analytics
- Google Analytics: Set `NEXT_PUBLIC_ANALYTICS_ID`
- Sentry errors: Set `SENTRY_DSN`

### Lead Tracking
Query database:
```sql
SELECT * FROM leads WHERE created_at > NOW() - INTERVAL '7 days';
```

Or export via admin: `/admin/leads`

## 🔒 Security

- All secrets in env vars (never in code)
- Rate limiting: 5 req/min per IP
- PII masking in logs
- Cookie consent with granular opt-in
- HTTPS only in production
- CORS restricted to domain

## 🐛 Troubleshooting

### Chat not responding
- Check OpenAI API key
- Verify embeddings indexed: `SELECT COUNT(*) FROM documents;`
- Check logs for errors

### GHL integration failing
- See `handoff/GHL-Setup.md`
- Verify API key and account ID
- Test with mock mode first

### Database connection errors
- Ensure Docker containers running: `docker-compose ps`
- Check DATABASE_URL format
- Verify pgvector extension: `SELECT * FROM pg_extension;`

### Build fails
- Clear cache: `rm -rf .next node_modules && npm install`
- Check TypeScript errors: `npm run build`

## 📞 Support

For issues:
1. Check `handoff/` documentation
2. Review logs
3. Check database state
4. Contact dev team

## 📝 License

Proprietary - ShuAI 2025
