import { mockMetrics, layers } from '@/mocks/metrics.mock'
import { globalMetrics } from '@/mocks/global.mock'
import LayerSection from '@/components/LayerSection'
import GlobalOverview from '@/components/GlobalOverview'

// Fixed reference date: March 26, 2025
const REFERENCE_DATE = new Date('2025-03-26T00:00:00Z')

export default function MonitorPage() {
  const servicesByLayer = mockMetrics.reduce((acc, service) => {
    if (!acc[service.layer]) {
      acc[service.layer] = [];
    }
    acc[service.layer].push(service);
    return acc;
  }, {} as Record<string, typeof mockMetrics>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">System Health Overview</h1>
        <div className="text-sm text-gray-400">
          Last updated: {REFERENCE_DATE.toLocaleString()}
        </div>
      </div>

      <GlobalOverview services={mockMetrics} />

      <div className="space-y-4">
        {Object.entries(layers).map(([layer, title]) => (
          servicesByLayer[layer] && (
            <LayerSection
              key={layer}
              title={title}
              services={servicesByLayer[layer]}
            />
          )
        ))}
      </div>
    </div>
  )
}
