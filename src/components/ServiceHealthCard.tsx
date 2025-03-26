'use client'

import { ServiceMetrics } from '@/mocks/metrics.mock'

export default function ServiceHealthCard({ service }: { service: ServiceMetrics }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">{service.name}</h3>
        <div className={`h-3 w-3 rounded-full ${
          service.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
        }`} />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Uptime</span>
          <span className="text-gray-100 font-medium">{service.uptime}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Latency (p95)</span>
          <span className="text-gray-100 font-medium">{service.latencyP95}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Error Rate</span>
          <span className="text-gray-100 font-medium">{(service.errorRate * 100).toFixed(2)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">CPU</span>
          <span className="text-gray-100 font-medium">{service.cpu}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Memory</span>
          <span className="text-gray-100 font-medium">{service.memory}%</span>
        </div>
        {service.metrics.custom && (
          <div className="pt-2 border-t border-gray-700">
            {Object.entries(service.metrics.custom).map(([key, data]) => (
              <div key={key} className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </span>
                <span className="text-gray-100 font-medium">
                  {data[data.length - 1].value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 