import { Pool } from 'pg';

// Main database pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PGVECTOR_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// pgvector operations
export async function searchDocuments(embedding: number[], limit: number = 5) {
  const query = `
    SELECT id, title, body, url, metadata,
           1 - (embedding <=> $1::vector) AS similarity
    FROM documents
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT $2
  `;
  
  const result = await pool.query(query, [`[${embedding.join(',')}]`, limit]);
  return result.rows;
}

export async function insertDocument(
  title: string,
  body: string,
  url: string | null,
  embedding: number[],
  metadata: any = {}
) {
  const query = `
    INSERT INTO documents (title, body, url, embedding, metadata)
    VALUES ($1, $2, $3, $4::vector, $5)
    RETURNING id
  `;
  
  const result = await pool.query(query, [
    title,
    body,
    url,
    `[${embedding.join(',')}]`,
    JSON.stringify(metadata)
  ]);
  
  return result.rows[0].id;
}

// Case studies operations
export async function getCaseStudy(id: string) {
  const result = await pool.query(
    'SELECT * FROM case_studies WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function getAllCaseStudies() {
  const result = await pool.query(
    'SELECT * FROM case_studies ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function insertCaseStudy(caseStudy: any) {
  const query = `
    INSERT INTO case_studies (
      id, client_name, industry, challenge, solution, results,
      timeline, metrics, screenshots, dataset_csv
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (id) DO UPDATE SET
      client_name = EXCLUDED.client_name,
      industry = EXCLUDED.industry,
      challenge = EXCLUDED.challenge,
      solution = EXCLUDED.solution,
      results = EXCLUDED.results,
      timeline = EXCLUDED.timeline,
      metrics = EXCLUDED.metrics,
      screenshots = EXCLUDED.screenshots,
      dataset_csv = EXCLUDED.dataset_csv,
      updated_at = now()
    RETURNING id
  `;
  
  const result = await pool.query(query, [
    caseStudy.id,
    caseStudy.client_name,
    caseStudy.industry,
    caseStudy.challenge,
    caseStudy.solution,
    JSON.stringify(caseStudy.results),
    caseStudy.timeline,
    JSON.stringify(caseStudy.metrics),
    caseStudy.screenshots,
    caseStudy.dataset_csv,
  ]);
  
  return result.rows[0].id;
}

// Leads operations
export async function createLead(lead: any) {
  const query = `
    INSERT INTO leads (
      session_id, first_name, last_name, email, phone,
      company_size, primary_goal, timeline,
      utm_source, utm_medium, utm_campaign,
      page_url, fingerprint, cookie_consent
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id
  `;
  
  const result = await pool.query(query, [
    lead.sessionId,
    lead.firstName,
    lead.lastName,
    lead.email,
    lead.phone,
    lead.companySize,
    lead.primaryGoal,
    lead.timeline,
    lead.utm?.utm_source,
    lead.utm?.utm_medium,
    lead.utm?.utm_campaign,
    lead.pageUrl,
    lead.fingerprint,
    JSON.stringify(lead.cookieConsent),
  ]);
  
  return result.rows[0].id;
}

export async function updateLead(id: string, updates: any) {
  const fields = Object.keys(updates)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(', ');
  
  const query = `
    UPDATE leads
    SET ${fields}, updated_at = now()
    WHERE id = $1
    RETURNING *
  `;
  
  const values = [id, ...Object.values(updates)];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getLeadByEmail(email: string) {
  const result = await pool.query(
    'SELECT * FROM leads WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
    [email]
  );
  return result.rows[0];
}

// Chat sessions
export async function getChatSession(sessionId: string) {
  const result = await pool.query(
    'SELECT * FROM chat_sessions WHERE id = $1',
    [sessionId]
  );
  return result.rows[0];
}

export async function saveChatMessage(sessionId: string, message: any) {
  const query = `
    INSERT INTO chat_sessions (id, messages, page)
    VALUES ($1, $2::jsonb, $3)
    ON CONFLICT (id) DO UPDATE SET
      messages = chat_sessions.messages || $2::jsonb,
      updated_at = now()
  `;
  
  await pool.query(query, [sessionId, JSON.stringify([message]), message.page]);
}

// Admin content
export async function getAdminContent(key: string) {
  const result = await pool.query(
    'SELECT * FROM admin_content WHERE key = $1',
    [key]
  );
  return result.rows[0];
}

export async function updateAdminContent(key: string, value: any, contentType: string) {
  const query = `
    INSERT INTO admin_content (id, content_type, key, value)
    VALUES (gen_random_uuid()::text, $1, $2, $3)
    ON CONFLICT (key) DO UPDATE SET
      value = $3,
      version = admin_content.version + 1,
      updated_at = now()
    RETURNING *
  `;
  
  const result = await pool.query(query, [contentType, key, JSON.stringify(value)]);
  return result.rows[0];
}

// Chat prompts
export async function getActivePrompt(promptType: string) {
  const result = await pool.query(
    'SELECT * FROM chat_prompts WHERE prompt_type = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1',
    [promptType]
  );
  return result.rows[0];
}

export async function createChatPrompt(promptType: string, promptText: string) {
  const query = `
    INSERT INTO chat_prompts (prompt_type, prompt_text, version, is_active)
    VALUES ($1, $2, (
      SELECT COALESCE(MAX(version), 0) + 1 
      FROM chat_prompts 
      WHERE prompt_type = $1
    ), true)
    RETURNING *
  `;
  
  const result = await pool.query(query, [promptType, promptText]);
  return result.rows[0];
}

// Analytics
export async function logEvent(sessionId: string, eventType: string, eventData: any, page: string) {
  const query = `
    INSERT INTO analytics_events (session_id, event_type, event_data, page)
    VALUES ($1, $2, $3, $4)
  `;
  
  await pool.query(query, [sessionId, eventType, JSON.stringify(eventData), page]);
}

export default pool;
