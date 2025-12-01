import axios from 'axios';

const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';

export interface GHLContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags?: string[];
  customFields?: Record<string, any>;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

export interface GHLContactResponse {
  id: string;
  contactId: string;
  email: string;
  phone: string;
}

class GHLAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GHLAPIError';
  }
}

function getGHLHeaders() {
  const apiKey = process.env.GHL_API_KEY;
  
  if (!apiKey || apiKey === 'ghl_api_key_placeholder') {
    throw new GHLAPIError('GHL_API_KEY not configured. Please set in environment variables.');
  }
  
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

export async function createGHLContact(contact: GHLContact): Promise<GHLContactResponse> {
  try {
    const accountId = process.env.GHL_ACCOUNT_ID;
    
    if (!accountId || accountId === 'ghl_account_id_placeholder') {
      throw new GHLAPIError('GHL_ACCOUNT_ID not configured. Please set in environment variables.');
    }
    
    const payload = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      tags: contact.tags || ['chat-qualified', 'source:web'],
      customField: {
        company_size: contact.customFields?.company_size || '',
        primary_goal: contact.customFields?.primary_goal || '',
        timeline: contact.customFields?.timeline || '',
        utm_source: contact.utm?.utm_source || '',
        utm_medium: contact.utm?.utm_medium || '',
        utm_campaign: contact.utm?.utm_campaign || '',
      },
    };
    
    const response = await axios.post(
      `${GHL_API_BASE}/contacts/`,
      payload,
      { headers: getGHLHeaders() }
    );
    
    return {
      id: response.data.contact.id,
      contactId: response.data.contact.id,
      email: response.data.contact.email,
      phone: response.data.contact.phone,
    };
  } catch (error: any) {
    if (error instanceof GHLAPIError) {
      throw error;
    }
    
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    throw new GHLAPIError(
      `Failed to create GHL contact: ${message}`,
      statusCode
    );
  }
}

export async function addContactToPipeline(
  contactId: string,
  pipelineId: string = 'ai-audit',
  stageId: string = 'booked'
): Promise<void> {
  try {
    await axios.post(
      `${GHL_API_BASE}/pipelines/${pipelineId}/opportunities/`,
      {
        contactId,
        stageId,
        status: 'open',
        name: 'AI Audit - Website Chat',
      },
      { headers: getGHLHeaders() }
    );
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    throw new GHLAPIError(`Failed to add contact to pipeline: ${message}`);
  }
}

export async function triggerGHLAutomation(
  contactId: string,
  automationId: string
): Promise<void> {
  try {
    await axios.post(
      `${GHL_API_BASE}/contacts/${contactId}/workflow/${automationId}`,
      {},
      { headers: getGHLHeaders() }
    );
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    throw new GHLAPIError(`Failed to trigger automation: ${message}`);
  }
}

export async function updateGHLContactTags(
  contactId: string,
  tags: string[]
): Promise<void> {
  try {
    await axios.put(
      `${GHL_API_BASE}/contacts/${contactId}`,
      { tags },
      { headers: getGHLHeaders() }
    );
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    throw new GHLAPIError(`Failed to update contact tags: ${message}`);
  }
}

// Mock mode for testing without real GHL account
export async function mockCreateGHLContact(contact: GHLContact): Promise<GHLContactResponse> {
  console.log('[MOCK GHL] Creating contact:', contact);
  
  return {
    id: `mock-${Date.now()}`,
    contactId: `mock-${Date.now()}`,
    email: contact.email,
    phone: contact.phone,
  };
}

// Utility to check if GHL is properly configured
export function isGHLConfigured(): boolean {
  const apiKey = process.env.GHL_API_KEY;
  const accountId = process.env.GHL_ACCOUNT_ID;
  
  return !!(
    apiKey &&
    apiKey !== 'ghl_api_key_placeholder' &&
    accountId &&
    accountId !== 'ghl_account_id_placeholder'
  );
}
