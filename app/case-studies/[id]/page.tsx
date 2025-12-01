import { getCaseStudy, getAllCaseStudies } from '@/server/db';
import { generateCaseStudySchema, generateBreadcrumbSchema } from '@/server/seo';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies();
  return caseStudies.map((cs) => ({
    id: cs.id,
  }));
}

export default async function CaseStudyPage({ params }: { params: { id: string } }) {
  const caseStudy = await getCaseStudy(params.id);
  
  if (!caseStudy) {
    notFound();
  }
  
  const caseStudySchema = generateCaseStudySchema(caseStudy);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: caseStudy.client_name, url: `/case-studies/${caseStudy.id}` },
  ]);
  
  return (
    <>
      <Script
        id="case-study-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
            
            <div className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">
              {caseStudy.industry}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {caseStudy.client_name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Timeline: {caseStudy.timeline}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Challenge */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{caseStudy.challenge}</p>
          </section>
          
          {/* Solution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{caseStudy.solution}</p>
          </section>
          
          {/* Results */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {Object.entries(caseStudy.results).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {value as string}
                  </div>
                  <div className="text-sm text-gray-700 capitalize font-medium">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Metrics Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(caseStudy.metrics).map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* CTA */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready for similar results?
            </h2>
            <p className="text-lg mb-6 text-primary-50">
              Book a free 15-minute AI audit and get your custom roadmap
            </p>
            <Link
              href="/#audit"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Your Free Audit
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
