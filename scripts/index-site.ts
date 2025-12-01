import { insertDocument, getAllCaseStudies } from '../server/db';
import { generateEmbedding } from '../server/chat-agent';

interface ContentToIndex {
  title: string;
  body: string;
  url: string;
  metadata?: any;
}

const STATIC_CONTENT: ContentToIndex[] = [
  {
    title: 'ShuAI - AI Growth Engines',
    body: `ShuAI builds AI growth engines that close deals predictably. We specialize in strategy, automation, and voice-enabled conversion for B2B SaaS and professional services companies. Our approach combines AI chat qualification, real-time lead enrichment, and automated nurture sequences to increase pipeline and reduce customer acquisition costs.`,
    url: '/',
    metadata: { type: 'homepage' },
  },
  {
    title: 'How We Work - 3 Step Process',
    body: `Step 1: Audit - We analyze your current funnel and identify high-impact automation opportunities with concrete ROI estimates. Step 2: Build & Integrate - We implement AI systems that integrate seamlessly with your existing tools (CRM, marketing automation, calendaring). Step 3: Automate & Scale - We deploy, monitor, and continuously optimize your AI growth engine to maximize results.`,
    url: '/#how-we-work',
    metadata: { type: 'process' },
  },
  {
    title: 'AI Audit - Free 15-Minute Assessment',
    body: `Our free 15-minute AI Audit includes: analysis of your current conversion funnel, identification of one high-impact automation opportunity, concrete ROI estimate, and implementation timeline. No technical expertise required - we handle all implementation, integration, and maintenance. Typical projects deliver results in 4-8 weeks with quick wins in the first 2 weeks.`,
    url: '/#audit',
    metadata: { type: 'service' },
  },
  {
    title: 'Pricing and Packages',
    body: `ShuAI packages start at $5,000/mo for full-stack execution including AI chat, lead enrichment, and CRM integration. Enterprise solutions start at $25,000 for complex multi-channel implementations. Pricing depends on complexity, scale, and number of integrations. All packages include ongoing optimization and support.`,
    url: '/#pricing',
    metadata: { type: 'pricing' },
  },
  {
    title: 'Industries We Serve',
    body: `We specialize in B2B SaaS companies ($1M-$50M revenue), professional services firms, and e-commerce/B2B marketplaces. Our solutions work best for businesses with complex sales cycles, high-value transactions, and established inbound traffic that needs better conversion.`,
    url: '/#industries',
    metadata: { type: 'industries' },
  },
  {
    title: 'Technology Stack and Integrations',
    body: `ShuAI integrates with GoHighLevel (GHL) for CRM and automation, n8n for workflow orchestration and lead enrichment, OpenAI for chat and voice AI, and all major calendar, email, and marketing platforms. We support custom integrations and can work with your existing tech stack.`,
    url: '/#integrations',
    metadata: { type: 'technical' },
  },
];

async function indexStaticContent() {
  console.log('📄 Indexing static content...');
  
  for (const content of STATIC_CONTENT) {
    try {
      const embedding = await generateEmbedding(content.body);
      await insertDocument(
        content.title,
        content.body,
        content.url,
        embedding,
        content.metadata
      );
      console.log(`✅ Indexed: ${content.title}`);
    } catch (error) {
      console.error(`❌ Failed to index ${content.title}:`, error);
    }
  }
}

async function indexCaseStudies() {
  console.log('\n📊 Indexing case studies...');
  
  try {
    const caseStudies = await getAllCaseStudies();
    
    for (const cs of caseStudies) {
      const body = `
        Case Study: ${cs.client_name} (${cs.industry})
        
        Challenge: ${cs.challenge}
        
        Solution: ${cs.solution}
        
        Results: ${JSON.stringify(cs.results, null, 2)}
        
        Timeline: ${cs.timeline}
        
        Key Metrics: ${JSON.stringify(cs.metrics, null, 2)}
      `;
      
      const embedding = await generateEmbedding(body);
      await insertDocument(
        `Case Study: ${cs.client_name}`,
        body,
        `/case-studies/${cs.id}`,
        embedding,
        { type: 'case-study', id: cs.id }
      );
      
      console.log(`✅ Indexed case study: ${cs.id} - ${cs.client_name}`);
    }
  } catch (error) {
    console.error('❌ Failed to index case studies:', error);
  }
}

async function indexFAQs() {
  console.log('\n❓ Indexing FAQs...');
  
  const { FAQ_ITEMS } = await import('../server/seo');
  
  for (const faq of FAQ_ITEMS) {
    try {
      const body = `Q: ${faq.question}\nA: ${faq.answer}`;
      const embedding = await generateEmbedding(body);
      await insertDocument(
        `FAQ: ${faq.question}`,
        body,
        '/#faq',
        embedding,
        { type: 'faq' }
      );
      console.log(`✅ Indexed FAQ: ${faq.question.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Failed to index FAQ:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting embeddings indexing...\n');
    
    await indexStaticContent();
    await indexCaseStudies();
    await indexFAQs();
    
    console.log('\n✨ Embeddings indexing completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error during indexing:', error);
    process.exit(1);
  }
}

main();
