-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Documents table for embeddings
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  url text,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Case studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id text PRIMARY KEY,
  client_name text NOT NULL,
  industry text NOT NULL,
  challenge text NOT NULL,
  solution text NOT NULL,
  results jsonb NOT NULL,
  timeline text NOT NULL,
  metrics jsonb NOT NULL,
  screenshots text[],
  dataset_csv text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table for tracking
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  first_name text,
  last_name text,
  email text,
  phone text,
  company_size text,
  primary_goal text,
  timeline text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  page_url text,
  fingerprint text,
  ghl_contact_id text,
  enrichment_data jsonb,
  chat_history jsonb DEFAULT '[]',
  voice_consent boolean DEFAULT false,
  cookie_consent jsonb,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_session_idx ON leads(session_id);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at DESC);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id text PRIMARY KEY,
  lead_id uuid REFERENCES leads(id),
  messages jsonb DEFAULT '[]',
  proactive boolean DEFAULT false,
  page text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin content table (for editable copy)
CREATE TABLE IF NOT EXISTS admin_content (
  id text PRIMARY KEY,
  content_type text NOT NULL,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat prompts (versioned)
CREATE TABLE IF NOT EXISTS chat_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_type text NOT NULL,
  prompt_text text NOT NULL,
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb,
  page text,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_session_idx ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS analytics_timestamp_idx ON analytics_events(timestamp DESC);
