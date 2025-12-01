export const SITE_NAME = 'ShuAI';
export const SITE_TAGLINE = 'We build AI growth engines that close deals — predictably';
export const SITE_DESCRIPTION = 'Strategy • Automation • Voice-enabled Conversion. Book a 15-minute AI Audit.';

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function generateMetadata(config: SEOConfig) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    title: config.title ? `${config.title} | ${SITE_NAME}` : `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: config.description || SITE_DESCRIPTION,
    canonical: config.canonical || siteUrl,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: config.canonical || siteUrl,
      siteName: SITE_NAME,
      title: config.title || SITE_TAGLINE,
      description: config.description || SITE_DESCRIPTION,
      images: [
        {
          url: config.ogImage || `${siteUrl}/_static/og-image.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@shuai',
      creator: '@shuai',
      title: config.title || SITE_TAGLINE,
      description: config.description || SITE_DESCRIPTION,
      images: [config.ogImage || `${siteUrl}/_static/og-image.png`],
    },
    robots: config.noindex ? 'noindex,nofollow' : 'index,follow',
  };
}

export function generateOrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/_static/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      'https://www.linkedin.com/company/shuai',
      'https://twitter.com/shuai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      availableLanguage: ['English'],
    },
  };
}

export const FAQ_ITEMS = [
  {
    question: 'What is the typical timeline for implementing an AI automation?',
    answer: 'Most implementations take 4-8 weeks from audit to full deployment. Quick wins can be delivered in the first 2 weeks.',
  },
  {
    question: 'Do I need technical expertise to work with ShuAI?',
    answer: 'No. We handle all technical implementation, integration, and maintenance. You focus on your business goals.',
  },
  {
    question: 'What is included in the 15-minute AI Audit?',
    answer: 'We analyze your current funnel, identify one high-impact automation opportunity, and provide a concrete ROI estimate with implementation timeline.',
  },
  {
    question: 'How much do your services cost?',
    answer: 'Packages start at $5,000/mo for full-stack execution. Enterprise solutions start at $25,000. Pricing depends on complexity and scale.',
  },
  {
    question: 'What industries do you work with?',
    answer: 'We specialize in B2B SaaS, professional services, and e-commerce companies with revenue between $1M-$50M annually.',
  },
  {
    question: 'How do you measure success?',
    answer: 'We track pipeline generated, conversion rate improvement, sales cycle reduction, and cost per acquisition. Every project has clear KPIs.',
  },
];

export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generateCaseStudySchema(caseStudy: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Case Study: ${caseStudy.client_name}`,
    description: caseStudy.challenge,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/_static/logo.png`,
      },
    },
    datePublished: caseStudy.created_at,
    dateModified: caseStudy.updated_at,
  };
}
