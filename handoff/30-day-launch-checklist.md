# 30-Day Launch Checklist

## Pre-Launch (Days 1-7)

### Day 1: Environment Setup
- [ ] Fork/clone repository to your organization
- [ ] Setup Vercel account and connect repo
- [ ] Provision PostgreSQL database (Vercel Postgres or Supabase)
- [ ] Provision Redis instance (Upstash or Vercel KV)
- [ ] Generate OpenAI API key
- [ ] Setup GoHighLevel account
- [ ] Setup n8n instance (cloud or self-hosted)

### Day 2: Environment Configuration
- [ ] Add all required environment variables to Vercel
- [ ] Generate admin password hash
- [ ] Configure database connection strings
- [ ] Test database connection
- [ ] Verify Redis connection

### Day 3: Database Setup
- [ ] Run database migrations
- [ ] Seed case studies (cs-001, cs-002, cs-003)
- [ ] Seed admin content
- [ ] Verify pgvector extension installed
- [ ] Index embeddings for first time

### Day 4: GHL Integration
- [ ] Follow `GHL-Setup.md` guide
- [ ] Create API key in GHL
- [ ] Create custom fields
- [ ] Setup pipeline (ai-audit)
- [ ] Create email automation
- [ ] Test integration with mock data

### Day 5: n8n Integration
- [ ] Import workflows from `n8n-import.json`
- [ ] Configure Clearbit/enrichment API
- [ ] Setup Google Sheets connection
- [ ] Configure GHL credentials in n8n
- [ ] Test enrichment webhook
- [ ] Test sheets backup webhook

### Day 6: Content Review
- [ ] Review and customize hero copy
- [ ] Update metrics (ensure they link to case studies)
- [ ] Customize trust badge logos
- [ ] Review chat greeting message
- [ ] Customize footer links and legal pages
- [ ] Add real client logos (replace placeholders)

### Day 7: Testing
- [ ] Run unit tests: `npm run test:unit`
- [ ] Run integration tests: `npm run test:integration`
- [ ] Test chat end-to-end on staging
- [ ] Test voice agent (if enabled)
- [ ] Test GHL lead creation
- [ ] Verify n8n webhooks firing

## Soft Launch (Days 8-14)

### Day 8: Staging Deployment
- [ ] Deploy to Vercel staging
- [ ] Verify staging URL works
- [ ] Test all pages load correctly
- [ ] Verify chat widget appears
- [ ] Test proactive chat trigger
- [ ] Check mobile responsiveness

### Day 9: Analytics & Monitoring
- [ ] Setup Google Analytics
- [ ] Add GA tracking ID to env
- [ ] Setup Sentry for error tracking
- [ ] Configure Vercel Analytics
- [ ] Test analytics events firing
- [ ] Setup uptime monitoring (UptimeRobot/Pingdom)

### Day 10: SEO Foundation
- [ ] Submit sitemap to Google Search Console
- [ ] Verify JSON-LD schemas valid (use schema.org validator)
- [ ] Check meta tags on all pages
- [ ] Verify canonical URLs
- [ ] Test Open Graph preview (LinkedIn/Twitter)
- [ ] Setup robots.txt

### Day 11: Performance Optimization
- [ ] Run Lighthouse audit (target: Performance ≥90)
- [ ] Optimize images (convert to AVIF)
- [ ] Test page load speed
- [ ] Check bundle size
- [ ] Verify lazy loading working
- [ ] Test on slow 3G connection

### Day 12: Security Review
- [ ] Run `npm audit` and fix critical issues
- [ ] Verify all secrets in env (not in code)
- [ ] Test rate limiting on chat endpoint
- [ ] Verify admin password protection
- [ ] Check CORS configuration
- [ ] Test HTTPS redirect

### Day 13: Admin Panel Testing
- [ ] Login to admin panel
- [ ] Edit hero content, verify ISR update
- [ ] Update chat configuration
- [ ] View leads list
- [ ] Export leads to CSV
- [ ] Trigger embeddings reindex

### Day 14: Soft Launch
- [ ] Deploy to production with limited traffic
- [ ] Share with internal team
- [ ] Collect feedback
- [ ] Monitor error logs
- [ ] Track first real leads
- [ ] Verify GHL contacts created correctly

## Full Launch (Days 15-21)

### Day 15: Content Finalization
- [ ] Finalize all copy based on feedback
- [ ] Add real case study screenshots
- [ ] Update client testimonials
- [ ] Proofread all content
- [ ] Verify links work
- [ ] Check grammar/spelling

### Day 16: Marketing Prep
- [ ] Setup UTM parameters for campaigns
- [ ] Create launch announcement posts
- [ ] Prepare email to existing leads
- [ ] Setup LinkedIn/Twitter posts
- [ ] Create case study PDFs for download

### Day 17: DNS & Domain
- [ ] Point custom domain to Vercel
- [ ] Configure DNS records
- [ ] Setup SSL certificate
- [ ] Test domain resolution
- [ ] Update NEXT_PUBLIC_SITE_URL
- [ ] Redeploy with new domain

### Day 18: Launch Rehearsal
- [ ] Simulate full user journey
- [ ] Test from mobile device
- [ ] Test from different browsers (Chrome, Safari, Firefox)
- [ ] Verify email notifications work
- [ ] Check SMS notifications (if enabled)
- [ ] Review all integrations one final time

### Day 19: Go Live
- [ ] Remove any "beta" or "staging" notices
- [ ] Enable full traffic
- [ ] Announce on social media
- [ ] Send email to mailing list
- [ ] Monitor real-time analytics
- [ ] Watch error logs closely

### Day 20-21: Post-Launch Monitoring
- [ ] Monitor chat interactions
- [ ] Review lead quality
- [ ] Check GHL pipeline activity
- [ ] Track conversion rates
- [ ] Collect user feedback
- [ ] Fix any bugs discovered

## Optimization (Days 22-30)

### Day 22-24: Data Analysis
- [ ] Review first week of lead data
- [ ] Analyze chat conversation logs
- [ ] Identify common objections
- [ ] Track booking rate
- [ ] Calculate cost per lead
- [ ] Review traffic sources

### Day 25-27: A/B Testing
- [ ] Test different hero copy variations
- [ ] Test chat greeting variations
- [ ] Test proactive timing (6s vs 10s)
- [ ] Test CTA button colors/text
- [ ] Track which case study performs best

### Day 28-30: Continuous Improvement
- [ ] Update chat prompts based on learnings
- [ ] Refine qualification questions
- [ ] Add FAQ content based on common questions
- [ ] Optimize slow-loading pages
- [ ] Plan next features
- [ ] Document lessons learned

## Ongoing (Daily/Weekly)

### Daily Tasks
- [ ] Check error logs (5 min)
- [ ] Review new leads in GHL
- [ ] Monitor uptime status
- [ ] Check chat for unanswered questions

### Weekly Tasks
- [ ] Review analytics dashboard
- [ ] Export and analyze lead data
- [ ] Update embeddings if content changed
- [ ] Security updates (`npm audit`)
- [ ] Backup database
- [ ] Review and respond to user feedback

### Monthly Tasks
- [ ] Review and optimize chat prompts
- [ ] Add new case studies
- [ ] Update metrics on homepage
- [ ] Rotate API keys (security best practice)
- [ ] Review and optimize costs
- [ ] Plan new features/improvements

## Success Metrics to Track

### Traffic
- Unique visitors
- Page views
- Bounce rate
- Time on site
- Traffic sources (organic, paid, referral)

### Engagement
- Chat open rate
- Chat completion rate
- Proactive chat effectiveness
- Pages per session
- Case study views

### Conversion
- Lead form submissions
- Chat qualifications
- Audit bookings
- Booking attendance rate
- Qualified lead rate

### Quality
- Lead quality score
- Response time
- Customer satisfaction
- Close rate
- Average deal size

## Emergency Contacts

**Technical Issues:**
- Vercel Support: vercel.com/support
- Database Provider: [your provider]
- OpenAI Status: status.openai.com

**Integration Issues:**
- GoHighLevel Support: support@gohighlevel.com
- n8n Community: community.n8n.io

## Notes

- Keep this checklist updated as you complete items
- Document any deviations from the plan
- Track time spent on each phase
- Note any blockers or dependencies
- Celebrate wins along the way! 🎉
