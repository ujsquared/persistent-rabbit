'use client'

import { useParams } from 'next/navigation'
import { mockTraces } from '@/mocks/traces.mock'
import Link from 'next/link'

// Sample Kong API logs structure
interface KongLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  traceId: string;
  metadata: {
    service: string;
    latency?: number;
    status?: number;
    method?: string;
    path?: string;
  };
}

// Sample Kong API logs for the trace
const getTraceKongLogs = (traceId: string): KongLog[] => [
  {
    timestamp: new Date(Date.now() - 5000).toISOString(),
    level: 'info',
    message: 'Request received by Kong Gateway',
    traceId,
    metadata: {
      service: 'orders-service',
      latency: 50,
      status: 200,
      method: 'POST',
      path: '/api/v1/orders'
    }
  },
  {
    timestamp: new Date(Date.now() - 4000).toISOString(),
    level: 'info',
    message: 'Authentication successful',
    traceId,
    metadata: {
      service: 'auth-service',
      latency: 100,
      status: 200,
      method: 'POST',
      path: '/api/v1/auth/verify'
    }
  },
  {
    timestamp: new Date(Date.now() - 3000).toISOString(),
    level: 'warn',
    message: 'Rate limit threshold approaching',
    traceId,
    metadata: {
      service: 'rate-limiter',
      latency: 20,
      method: 'GET',
      path: '/internal/rate-limit'
    }
  }
]

export default function TraceDetailPage() {
  const { traceId } = useParams()
  const trace = mockTraces.find(t => t.id === traceId)
  const kongLogs = getTraceKongLogs(traceId as string)

  if (!trace) {
    return <div>Trace not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/traces"
            className="text-sm text-blue-400 hover:text-blue-300 mb-2 inline-block"
          >
            ← Back to Traces
          </Link>
          <h1 className="text-2xl font-bold text-gray-100">
            Trace Details
          </h1>
        </div>
        <div className="text-sm text-gray-400">
          ID: <span className="font-mono">{trace.id}</span>
        </div>
      </div>

      {/* Trace Timeline */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-100">Timeline</h2>
        <div className="space-y-2">
          {trace.spans.map((span) => (
            <div
              key={span.id}
              className="flex items-center gap-4"
              style={{ marginLeft: span.parentSpanId ? '2rem' : 0 }}
            >
              <div className="w-32 text-sm text-gray-400">
                {span.serviceName}
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

      {/* Kong API Logs Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">Kong API Logs</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {kongLogs.map((log, index) => (
            <div 
              key={index}
              className="p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    log.level === 'error' ? 'bg-red-900/50 text-red-200' :
                    log.level === 'warn' ? 'bg-yellow-900/50 text-yellow-200' :
                    'bg-green-900/50 text-green-200'
                  }`}>
                    {log.level}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-2">{log.message}</p>
              <div className="text-xs text-gray-400 font-mono space-x-2">
                <span>{log.metadata.method} {log.metadata.path}</span>
                {log.metadata.status && (
                  <span>Status: {log.metadata.status}</span>
                )}
                {log.metadata.latency && (
                  <span>Latency: {log.metadata.latency}ms</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 