'use client';

import { useState } from 'react';

interface HeroProps {
  content: {
    h1: string;
    h2: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  onBookAudit: () => void;
}

export default function Hero({ content, onBookAudit }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pt-20 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            {content.h1}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            {content.h2}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={onBookAudit}
              className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
            >
              {content.ctaPrimary}
            </button>
            <a
              href="/case-studies/cs-001"
              className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
            >
              {content.ctaSecondary} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 sm:mt-20">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by leading companies
          </p>
          <div className="flex items-center justify-center gap-x-12 gap-y-8 flex-wrap opacity-60 grayscale">
            <div className="text-2xl font-bold text-gray-400">NexaTech</div>
            <div className="text-2xl font-bold text-gray-400">BrightLeaf</div>
            <div className="text-2xl font-bold text-gray-400">TradeFoundry</div>
          </div>
        </div>
      </div>
    </section>
  );
}
