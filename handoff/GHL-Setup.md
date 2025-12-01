# GoHighLevel (GHL) Setup Guide

## Prerequisites
- Active GoHighLevel account
- Admin access to generate API keys
- Access to pipeline and automation settings

## Step 1: Generate API Key

1. Log into your GoHighLevel account
2. Navigate to **Settings** → **API**
3. Click **Create New API Key**
4. Name it: `ShuAI Website Integration`
5. Copy the generated API key (starts with `ghl_`)
6. Save it securely - you'll need it for environment variables

## Step 2: Get Account ID

1. While in Settings, note your **Account ID** (also called Location ID)
2. It's usually displayed in the URL or account settings
3. Format: alphanumeric string (e.g., `abc123def456`)

## Step 3: Create Pipeline

1. Navigate to **Opportunities** → **Pipelines**
2. Create a new pipeline named: **AI Audit Pipeline**
3. Set pipeline ID to: `ai-audit` (or note the auto-generated ID)
4. Add stages:
   - **New Lead** (initial stage)
   - **Booked** (qualified via chat)
   - **Attended** (showed up for audit)
   - **Proposal Sent**
   - **Closed Won**
   - **Closed Lost**

## Step 4: Create Custom Fields

Navigate to **Settings** → **Custom Fields** and create:

| Field Name | Field ID | Type | Required |
|------------|----------|------|----------|
| Company Size | `company_size` | Dropdown | No |
| Primary Goal | `primary_goal` | Dropdown | No |
| Timeline | `timeline` | Dropdown | No |
| UTM Source | `utm_source` | Text | No |
| UTM Medium | `utm_medium` | Text | No |
| UTM Campaign | `utm_campaign` | Text | No |

### Dropdown Options:

**Company Size:**
- 1-10
- 11-50
- 51-200
- 201-500
- 500+

**Primary Goal:**
- Lead Generation
- Sales Automation
- Revenue Growth
- Other

**Timeline:**
- ASAP (within 2 weeks)
- 1 month
- 2-3 months
- Exploring options

## Step 5: Create Email Automation

1. Navigate to **Automation** → **Workflows**
2. Create workflow: **Chat Qualification Confirmation**
3. Trigger: **Contact Tag Added** → `chat-qualified`
4. Actions:
   - Send email: "Your AI Audit is Confirmed"
   - Send SMS: "Hi {firstName}, your spot is reserved..."
   - Add to pipeline: AI Audit → Booked stage

### Email Template (Confirmation):

```
Subject: Your AI Audit is Confirmed - ShuAI

Hi {{contact.first_name}},

Your 15-minute AI Audit is confirmed.

What to expect:
✓ Custom audit of your conversion funnel
✓ One high-impact automation opportunity  
✓ Concrete ROI estimate with timeline
✓ Implementation roadmap

You'll receive your calendar invite within the next 5 minutes.

Questions? Reply to this email or call (XXX) XXX-XXXX.

Best,
ShuAI Team
```

## Step 6: Configure Environment Variables

Add these to your Vercel deployment:

```bash
GHL_API_KEY=ghl_YOUR_ACTUAL_API_KEY_HERE
GHL_ACCOUNT_ID=your_account_id_here
```

## Step 7: Test Integration

Run the test script:

```bash
npm run test:ghl-integration
```

Or manually test with curl:

```bash
curl -X POST http://localhost:3000/api/webhook/ghl/create-lead \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "companySize": "51-200",
    "primaryGoal": "Lead Generation",
    "timeline": "1 month"
  }'
```

Expected response:
```json
{
  "success": true,
  "leadId": "uuid-here",
  "ghlContactId": "ghl-contact-id-here",
  "message": "Your spot is reserved..."
}
```

## Step 8: Verify in GHL

1. Check that contact was created in GHL
2. Verify contact appears in **AI Audit Pipeline** → **Booked** stage
3. Confirm custom fields are populated
4. Verify automation was triggered (email sent)

## Troubleshooting

### Error: "GHL_API_KEY not configured"
- Ensure env variable is set correctly
- API key must start with `ghl_`
- Rebuild/restart app after adding env vars

### Error: "Failed to create GHL contact: 401"
- API key is invalid or expired
- Regenerate key in GHL settings

### Error: "Failed to add contact to pipeline"
- Pipeline ID doesn't match
- Check pipeline name is exactly `ai-audit`
- Or update code with correct pipeline ID

### Contact created but not in pipeline
- Check pipeline permissions
- Verify stage ID is correct
- Ensure automation workflow is active

## Rate Limits

GHL API limits:
- 300 requests per minute per account
- Website handles this automatically with queuing

## Security Notes

- Never commit GHL_API_KEY to git
- Rotate keys every 90 days
- Use separate keys for staging and production
- Monitor API usage in GHL dashboard

## Support

For GHL-specific issues:
- GHL Documentation: https://highlevel.stoplight.io/
- GHL Support: support@gohighlevel.com

For integration issues:
- Check `/api/webhook/ghl/create-lead/route.ts`
- Review server logs: `npm run logs`
- Contact dev team
