import { NextRequest, NextResponse } from 'next/server';
import { createGHLContact, addContactToPipeline, isGHLConfigured, mockCreateGHLContact } from '@/server/gh-api';
import { triggerLeadEnrichment, backupLeadToSheets, isN8NConfigured, mockEnrichment } from '@/server/n8n-webhooks';
import { createLead, updateLead } from '@/server/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      firstName,
      lastName,
      email,
      phone,
      companySize,
      primaryGoal,
      timeline,
      utm,
      pageUrl,
      fingerprint,
      cookieConsent,
    } = body;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Create lead in database
    const leadId = await createLead({
      sessionId,
      firstName,
      lastName,
      email,
      phone,
      companySize,
      primaryGoal,
      timeline,
      utm,
      pageUrl,
      fingerprint,
      cookieConsent,
    });
    
    // Create contact in GHL (or mock if not configured)
    let ghlContactId: string;
    
    if (isGHLConfigured()) {
      try {
        const ghlContact = await createGHLContact({
          firstName,
          lastName,
          email,
          phone,
          tags: ['chat-qualified', 'source:web'],
          customFields: {
            company_size: companySize,
            primary_goal: primaryGoal,
            timeline,
          },
          utm,
        });
        
        ghlContactId = ghlContact.id;
        
        // Add to pipeline
        await addContactToPipeline(ghlContactId, 'ai-audit', 'booked');
        
        console.log(`[GHL] Created contact ${ghlContactId} for ${email}`);
      } catch (error: any) {
        console.error('[GHL] Error creating contact:', error.message);
        ghlContactId = `mock-${leadId}`;
      }
    } else {
      const mockContact = await mockCreateGHLContact({
        firstName,
        lastName,
        email,
        phone,
        tags: ['chat-qualified', 'source:web'],
        customFields: { companySize, primaryGoal, timeline },
        utm,
      });
      ghlContactId = mockContact.id;
    }
    
    // Update lead with GHL contact ID
    await updateLead(leadId, { ghl_contact_id: ghlContactId });
    
    // Trigger n8n enrichment (async, don't wait)
    const enrichmentPromise = isN8NConfigured()
      ? triggerLeadEnrichment(leadId, email)
      : mockEnrichment(leadId, email);
    
    enrichmentPromise.then(async (enrichmentData) => {
      if (enrichmentData.enriched) {
        await updateLead(leadId, {
          enrichment_data: enrichmentData.companyInfo,
        });
        console.log(`[N8N] Enriched lead ${leadId}`);
      }
    }).catch((error) => {
      console.error('[N8N] Enrichment error:', error);
    });
    
    // Backup to Google Sheets (async, don't wait)
    backupLeadToSheets({
      id: leadId,
      email,
      phone,
      firstName,
      lastName,
      companySize,
      primaryGoal,
      timeline,
      utm,
      fingerprint,
      pageUrl,
    }).catch((error) => {
      console.error('[N8N] Backup to sheets error:', error);
    });
    
    return NextResponse.json({
      success: true,
      leadId,
      ghlContactId,
      message: 'Your spot is reserved. You\'ll receive a calendar invite and a one-page audit within 60 minutes.',
    });
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
