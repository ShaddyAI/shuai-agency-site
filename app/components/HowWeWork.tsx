'use client';

import { useState } from 'react';

const STEPS = [
  {
    number: '1',
    title: 'Audit',
    description: 'We analyze your current funnel and identify high-impact automation opportunities. Get a concrete ROI estimate and implementation timeline in 15 minutes.',
    details: [
      'Conversion funnel analysis',
      'Bottleneck identification',
      'ROI projection with timelines',
      'Technical feasibility assessment',
    ],
  },
  {
    number: '2',
    title: 'Build & Integrate',
    description: 'We implement AI systems that integrate seamlessly with your existing tools. No disruption to your current workflow.',
    details: [
      'Custom AI chat + voice agents',
      'CRM integration (GHL, Salesforce, HubSpot)',
      'Lead enrichment pipelines',
      'Calendar and email automation',
    ],
  },
  {
    number: '3',
    title: 'Automate & Scale',
    description: 'We deploy, monitor, and continuously optimize your AI growth engine. You get ongoing improvements without lifting a finger.',
    details: [
      'Real-time performance monitoring',
      'A/B testing and optimization',
      'Weekly performance reports',
      'Continuous prompt refinement',
    ],
  },
];

export default function HowWeWork() {
  const [openStep, setOpenStep] = useState<number | null>(0);
  
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How we work
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From audit to scale in three clear steps
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl space-y-4">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenStep(openStep === idx ? null : idx)}
                className="w-full px-6 py-6 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    openStep === idx ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openStep === idx && (
                <div className="px-6 pb-6 pl-20">
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIdx) => (
                      <li key={detailIdx} className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
