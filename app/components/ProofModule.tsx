interface Metric {
  value: string;
  label: string;
  detail: string;
}

interface ProofModuleProps {
  metrics: {
    metric1: Metric;
    metric2: Metric;
    metric3: Metric;
  };
}

export default function ProofModule({ metrics }: ProofModuleProps) {
  const metricsArray = [metrics.metric1, metrics.metric2, metrics.metric3];
  
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            10-second proof
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real results from real clients
          </p>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {metricsArray.map((metric, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {metric.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {metric.label}
              </div>
              <div className="text-sm text-gray-600">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
