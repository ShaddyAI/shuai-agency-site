import Link from 'next/link';

interface CaseStudy {
  id: string;
  client_name: string;
  industry: string;
  challenge: string;
  solution: string;
  results: any;
  timeline: string;
  metrics: any;
}

interface CaseStudyFeaturedProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyFeatured({ caseStudy }: CaseStudyFeaturedProps) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Case Study
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real results, real clients, real numbers
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
            <div className="p-8 sm:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
                  {caseStudy.industry}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {caseStudy.client_name}
                </h3>
                <div className="text-sm text-gray-500">
                  Timeline: {caseStudy.timeline}
                </div>
              </div>
              
              {/* Challenge */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Challenge</h4>
                <p className="text-gray-700">{caseStudy.challenge}</p>
              </div>
              
              {/* Solution */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Approach</h4>
                <p className="text-gray-700">{caseStudy.solution}</p>
              </div>
              
              {/* Results */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Results</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(caseStudy.results).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        {value as string}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="text-center">
                <Link
                  href={`/case-studies/${caseStudy.id}`}
                  className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
                >
                  Read Full Case Study
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
