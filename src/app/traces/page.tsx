'use client'

import { mockTraces } from '@/mocks/traces.mock'
import ServiceMap from '@/components/ServiceMap'

export default function TracesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Traces</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <ServiceMap />

      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-100">Recent Traces</h2>
        {mockTraces.map((trace) => (
          <div key={trace.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-200">
                Trace ID: <span className="font-mono">{trace.id}</span>
              </h3>
              <span className="text-sm text-gray-400">
                Duration: {trace.duration.toFixed(2)}ms
              </span>
            </div>
            <div className="space-y-2">
              {trace.spans.map((span) => (
                <div
                  key={span.id}
                  className="flex items-center gap-4"
                  style={{ marginLeft: span.parentId ? '2rem' : 0 }}
                >
                  <div className="w-32 text-sm text-gray-400">
                    {span.component}
                  </div>
                  <div
                    className={`h-2 rounded ${
                      span.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(span.duration / trace.duration) * 100}%` }}
                  />
                  <div className="text-sm text-gray-400">
                    {span.duration.toFixed(2)}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 