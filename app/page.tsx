import { getAdminContent, getCaseStudy } from '@/server/db';
import Hero from './components/Hero';
import ProofModule from './components/ProofModule';
import HowWeWork from './components/HowWeWork';
import CaseStudyFeatured from './components/CaseStudyFeatured';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import { generateFAQSchema } from '@/server/seo';
import Script from 'next/script';

export const revalidate = 60; // ISR - revalidate every 60 seconds

async function getPageContent() {
  try {
    const [heroData, metricsData, chatConfigData, featuredCase] = await Promise.all([
      getAdminContent('hero'),
      getAdminContent('metrics'),
      getAdminContent('chat-config'),
      getCaseStudy('cs-001'),
    ]);
    
    return {
      hero: heroData?.value || {
        h1: 'We build AI growth engines that close deals — predictably.',
        h2: 'Strategy • Automation • Voice-enabled Conversion. Book a 15-minute AI Audit.',
        ctaPrimary: 'Book 15-min Audit',
        ctaSecondary: 'See Case Study — $1.2M pipeline in 90 days',
      },
      metrics: metricsData?.value || {
        metric1: {
          value: '3×',
          label: 'Faster Sales Cycle',
          detail: 'Based on cs-001 metric (90 days)',
        },
        metric2: {
          value: '$1.2M',
          label: 'Pipeline Generated',
          detail: 'From cs-001',
        },
        metric3: {
          value: '+42%',
          label: 'Avg Client LTV',
          detail: 'From cs-003 (6 months)',
        },
      },
      chatConfig: chatConfigData?.value || {
        proactiveEnabled: true,
        proactiveDelay: 6,
        proactiveScrollThreshold: 40,
        greeting: 'Hi — I\'m Shu, your AI growth engineer. Quick question: are you trying to (A) get more qualified leads, (B) automate sales follow-up, or (C) increase close rate?',
      },
      featuredCase,
    };
  } catch (error) {
    console.error('Error fetching page content:', error);
    // Return defaults
    return {
      hero: {
        h1: 'We build AI growth engines that close deals — predictably.',
        h2: 'Strategy • Automation • Voice-enabled Conversion. Book a 15-minute AI Audit.',
        ctaPrimary: 'Book 15-min Audit',
        ctaSecondary: 'See Case Study — $1.2M pipeline in 90 days',
      },
      metrics: {
        metric1: { value: '3×', label: 'Faster Sales Cycle', detail: 'Based on cs-001 metric (90 days)' },
        metric2: { value: '$1.2M', label: 'Pipeline Generated', detail: 'From cs-001' },
        metric3: { value: '+42%', label: 'Avg Client LTV', detail: 'From cs-003 (6 months)' },
      },
      chatConfig: {
        proactiveEnabled: true,
        proactiveDelay: 6,
        proactiveScrollThreshold: 40,
        greeting: 'Hi — I\'m Shu, your AI growth engineer. Quick question: are you trying to (A) get more qualified leads, (B) automate sales follow-up, or (C) increase close rate?',
      },
      featuredCase: null,
    };
  }
}

export default async function Home() {
  const { hero, metrics, chatConfig, featuredCase } = await getPageContent();
  const faqSchema = generateFAQSchema();
  
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="min-h-screen">
        <Hero content={hero} onBookAudit={() => {}} />
        <ProofModule metrics={metrics} />
        <HowWeWork />
        {featuredCase && <CaseStudyFeatured caseStudy={featuredCase} />}
        <Footer />
      </main>
      
      <ChatWidget config={chatConfig} />
    </>
  );
}
