import { describe, it, expect } from 'vitest';
import { SYSTEM_PROMPT } from '../../server/chat-agent';

describe('Chat Agent System Prompt', () => {
  it('should contain booking logic', () => {
    expect(SYSTEM_PROMPT).toContain('book');
    expect(SYSTEM_PROMPT).toContain('Quick Audit');
  });
  
  it('should contain qualification requirements', () => {
    expect(SYSTEM_PROMPT).toContain('Qualify in 3 questions maximum');
    expect(SYSTEM_PROMPT).toContain('Company size');
    expect(SYSTEM_PROMPT).toContain('Primary goal');
    expect(SYSTEM_PROMPT).toContain('Timeline');
  });
  
  it('should contain email and phone capture requirement', () => {
    expect(SYSTEM_PROMPT).toContain('capture email and phone');
  });
  
  it('should contain exact pricing phrasing', () => {
    expect(SYSTEM_PROMPT).toContain('Packages start at $5,000/mo');
    expect(SYSTEM_PROMPT).toContain('enterprise quotes start at $25,000');
  });
  
  it('should reference retrieval results usage', () => {
    expect(SYSTEM_PROMPT).toContain('retrieval results');
    expect(SYSTEM_PROMPT).toContain('verbatim');
  });
  
  it('should require voice consent', () => {
    expect(SYSTEM_PROMPT).toContain('voice');
    expect(SYSTEM_PROMPT).toContain('consent');
  });
  
  it('should enforce outcome-focused tone', () => {
    expect(SYSTEM_PROMPT).toContain('outcome-focused');
    expect(SYSTEM_PROMPT).toContain('No generic marketing copy');
  });
  
  it('should mention case study option', () => {
    expect(SYSTEM_PROMPT).toContain('Send Case Study');
  });
});
