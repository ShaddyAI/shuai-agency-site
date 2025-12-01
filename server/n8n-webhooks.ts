import axios from 'axios';

const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE || 'https://n8n.yourdomain.com/webhook';
const N8N_SECRET = process.env.N8N_WEBHOOK_SECRET;

export interface EnrichmentRequest {
  leadId: string;
  email: string;
  domain: string;
  timestamp: string;
}

export interface EnrichmentResponse {
  leadId: string;
  companyInfo: {
    domain: string;
    name?: string;
    industry?: string;
    size?: string;
    techStack?: string[];
    linkedinUrl?: string;
    description?: string;
  };
  enriched: boolean;
}

class N8NWebhookError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'N8NWebhookError';
  }
}

function getWebhookHeaders() {
  if (!N8N_SECRET || N8N_SECRET === 'webhook_secret') {
    console.warn('N8N_WEBHOOK_SECRET not configured - using default (not secure)');
  }
  
  return {
    'Content-Type': 'application/json',
    'X-N8N-Secret': N8N_SECRET || 'webhook_secret',
  };
}

export async function triggerLeadEnrichment(
  leadId: string,
  email: string,
  domain?: string
): Promise<EnrichmentResponse> {
  try {
    const extractedDomain = domain || email.split('@')[1];
    
    const payload: EnrichmentRequest = {
      leadId,
      email,
      domain: extractedDomain,
      timestamp: new Date().toISOString(),
    };
    
    const response = await axios.post(
      `${N8N_WEBHOOK_BASE}/enrich`,
      payload,
      {
        headers: getWebhookHeaders(),
        timeout: 10000, // 10 second timeout
      }
    );
    
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      // Timeout - continue without enrichment
      console.warn(`[N8N] Enrichment timeout for lead ${leadId}`);
      return {
        leadId,
        companyInfo: { domain: domain || email.split('@')[1] },
        enriched: false,
      };
    }
    
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error(`[N8N] Enrichment failed: ${message}`);
    
    // Return fallback response instead of throwing
    return {
      leadId,
      companyInfo: { domain: domain || email.split('@')[1] },
      enriched: false,
    };
  }
}

export async function backupLeadToSheets(lead: any): Promise<void> {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      leadId: lead.id,
      email: lead.email,
      phone: lead.phone,
      firstName: lead.firstName,
      lastName: lead.lastName,
      companySize: lead.companySize,
      primaryGoal: lead.primaryGoal,
      timeline: lead.timeline,
      utmSource: lead.utm?.utm_source || '',
      utmMedium: lead.utm?.utm_medium || '',
      utmCampaign: lead.utm?.utm_campaign || '',
      fingerprint: lead.fingerprint || '',
      page: lead.pageUrl || '',
    };
    
    await axios.post(
      `${N8N_WEBHOOK_BASE}/backup-sheets`,
      payload,
      {
        headers: getWebhookHeaders(),
        timeout: 5000,
      }
    );
  } catch (error: any) {
    // Non-critical - log but don't fail
    console.error('[N8N] Failed to backup to sheets:', error.message);
  }
}

export async function triggerFollowUpSequence(
  leadId: string,
  email: string,
  firstName: string,
  sequenceType: 'no-booking-48h' | 'no-reply-7d' = 'no-booking-48h'
): Promise<void> {
  try {
    const payload = {
      leadId,
      email,
      firstName,
      sequenceType,
      timestamp: new Date().toISOString(),
    };
    
    await axios.post(
      `${N8N_WEBHOOK_BASE}/follow-up`,
      payload,
      {
        headers: getWebhookHeaders(),
        timeout: 5000,
      }
    );
  } catch (error: any) {
    console.error('[N8N] Failed to trigger follow-up:', error.message);
  }
}

// Mock enrichment for development
export async function mockEnrichment(
  leadId: string,
  email: string,
  domain?: string
): Promise<EnrichmentResponse> {
  console.log('[MOCK N8N] Enriching lead:', leadId);
  
  const extractedDomain = domain || email.split('@')[1];
  
  // Simulate enrichment data
  return {
    leadId,
    companyInfo: {
      domain: extractedDomain,
      name: `${extractedDomain.split('.')[0]} Inc.`,
      industry: 'Technology',
      size: '50-200',
      techStack: ['React', 'Node.js', 'AWS'],
      linkedinUrl: `https://linkedin.com/company/${extractedDomain.split('.')[0]}`,
      description: 'Mock enrichment data for development',
    },
    enriched: true,
  };
}

export function isN8NConfigured(): boolean {
  return !!(
    process.env.N8N_WEBHOOK_BASE &&
    process.env.N8N_WEBHOOK_SECRET &&
    process.env.N8N_WEBHOOK_SECRET !== 'webhook_secret'
  );
}
