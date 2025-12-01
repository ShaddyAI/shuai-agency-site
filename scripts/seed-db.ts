import { pool, insertCaseStudy, createChatPrompt } from '../server/db';
import { SYSTEM_PROMPT } from '../server/chat-agent';

const CASE_STUDIES = [
  {
    id: 'cs-001',
    client_name: 'NexaTech',
    industry: 'B2B SaaS',
    challenge: 'Low SQLs from inbound traffic. 47% of qualified leads dropped off before sales contact. Average response time of 6 hours killed momentum.',
    solution: 'Implemented AI chat qualification system with real-time lead enrichment via n8n. Voice-enabled follow-up within 60 seconds of form submission. Automated nurture sequences in GoHighLevel triggered by behavior signals.',
    results: {
      pipeline: '$1,200,000 in 90 days',
      conversion: '3× improvement (from 2.1% to 6.4%)',
      cac: '27% reduction',
      responseTime: 'From 6 hours to 60 seconds',
    },
    timeline: '90 days',
    metrics: {
      pipelineGenerated: 1200000,
      conversionBefore: 2.1,
      conversionAfter: 6.4,
      cacReduction: 27,
      responseTimeBefore: 360, // minutes
      responseTimeAfter: 1, // minutes
      sqlsGenerated: 142,
      closedWon: 23,
    },
    screenshots: [
      '/case-studies/nexatech-dashboard.png',
      '/case-studies/nexatech-chat.png',
    ],
    dataset_csv: '/case-studies/nexatech-data.csv',
  },
  {
    id: 'cs-002',
    client_name: 'BrightLeaf',
    industry: 'Professional Services',
    challenge: 'Manual qualification process took 3-4 days per lead. 62% of leads never heard back. Sales team overwhelmed with unqualified inquiries.',
    solution: 'Built AI-powered intake system that qualifies in under 3 minutes. Integrated with existing CRM and calendaring. Automated tier-based routing: hot leads to partners, warm to account execs, cold to nurture.',
    results: {
      pipeline: '$840,000 in 120 days',
      conversion: '2.4× improvement (from 4.2% to 10.1%)',
      timeToFirstCall: '94% reduction (from 78 hours to 4.5 hours)',
      salesEfficiency: 'Team handles 3× volume with same headcount',
    },
    timeline: '120 days',
    metrics: {
      pipelineGenerated: 840000,
      conversionBefore: 4.2,
      conversionAfter: 10.1,
      timeToCallBefore: 78, // hours
      timeToCallAfter: 4.5, // hours
      volumeIncrease: 3,
      sqlsGenerated: 89,
      closedWon: 17,
    },
    screenshots: [
      '/case-studies/brightleaf-workflow.png',
      '/case-studies/brightleaf-metrics.png',
    ],
    dataset_csv: '/case-studies/brightleaf-data.csv',
  },
  {
    id: 'cs-003',
    client_name: 'TradeFoundry',
    industry: 'E-commerce / B2B Marketplace',
    challenge: 'High cart abandonment (73%). Post-purchase support inquiries flooded customer success team. No visibility into customer intent or friction points.',
    solution: 'Deployed proactive AI chat to address objections during checkout. Voice agent for post-purchase support (24/7). Real-time intent tracking fed back to product team for continuous optimization.',
    results: {
      revenue: '+$2.1M ARR increase',
      abandonment: 'Reduced from 73% to 41%',
      supportLoad: '56% reduction in ticket volume',
      ltv: '+42% average LTV increase',
    },
    timeline: '6 months',
    metrics: {
      revenueIncrease: 2100000,
      abandonmentBefore: 73,
      abandonmentAfter: 41,
      ticketReduction: 56,
      ltvIncrease: 42,
      conversionBefore: 1.8,
      conversionAfter: 3.2,
      chatInteractions: 14823,
      voiceInteractions: 3241,
    },
    screenshots: [
      '/case-studies/tradefoundry-cart.png',
      '/case-studies/tradefoundry-voice.png',
    ],
    dataset_csv: '/case-studies/tradefoundry-data.csv',
  },
];

async function seedCaseStudies() {
  console.log('🌱 Seeding case studies...');
  
  for (const caseStudy of CASE_STUDIES) {
    try {
      await insertCaseStudy(caseStudy);
      console.log(`✅ Seeded case study: ${caseStudy.id} - ${caseStudy.client_name}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${caseStudy.id}:`, error);
    }
  }
}

async function seedChatPrompts() {
  console.log('🌱 Seeding chat prompts...');
  
  try {
    await createChatPrompt('system', SYSTEM_PROMPT);
    console.log('✅ Seeded system prompt');
  } catch (error) {
    console.error('❌ Failed to seed chat prompt:', error);
  }
}

async function seedAdminContent() {
  console.log('🌱 Seeding admin content...');
  
  const { updateAdminContent } = await import('../server/db');
  
  const defaultContent = {
    hero: {
      h1: 'We build AI growth engines that close deals — predictably.',
      h2: 'Strategy • Automation • Voice-enabled Conversion. Book a 15-minute AI Audit.',
      ctaPrimary: 'Book 15-min Audit',
      ctaSecondary: 'See Case Study — $1.2M pipeline in 90 days',
    },
    metrics: {
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
    trustBadges: {
      logos: [
        { name: 'NexaTech', url: '/logos/nexatech.png' },
        { name: 'BrightLeaf', url: '/logos/brightleaf.png' },
        { name: 'TradeFoundry', url: '/logos/tradefoundry.png' },
      ],
    },
    chat: {
      proactiveEnabled: true,
      proactiveDelay: 6, // seconds
      proactiveScrollThreshold: 40, // percent
      greeting: 'Hi — I\'m Shu, your AI growth engineer. Quick question: are you trying to (A) get more qualified leads, (B) automate sales follow-up, or (C) increase close rate?',
    },
  };
  
  try {
    await updateAdminContent('hero', defaultContent.hero, 'homepage');
    await updateAdminContent('metrics', defaultContent.metrics, 'homepage');
    await updateAdminContent('trust-badges', defaultContent.trustBadges, 'homepage');
    await updateAdminContent('chat-config', defaultContent.chat, 'chat');
    console.log('✅ Seeded admin content');
  } catch (error) {
    console.error('❌ Failed to seed admin content:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting database seed...\n');
    
    await seedCaseStudies();
    console.log('');
    
    await seedChatPrompts();
    console.log('');
    
    await seedAdminContent();
    console.log('');
    
    console.log('✨ Database seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error during seed:', error);
    process.exit(1);
  }
}

main();
