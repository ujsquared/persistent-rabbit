'use client'

import { ServiceMetrics } from '@/mocks/metrics.mock'
import MetricsGraph from './MetricsGraph'

interface ALBMetricsProps {
  service: ServiceMetrics
}

export default function ALBMetrics({ service }: ALBMetricsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsGraph
          data={service.metrics.latency.p95}
          title="ALB Latency (p95)"
          yAxisLabel="ms"
          color="#60a5fa"
        />
        <MetricsGraph
          data={service.metrics.custom!.requestsPerSecond}
          title="Requests per Second"
          yAxisLabel="requests"
          color="#10b981"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsGraph
          data={service.metrics.custom!.healthyHosts}
          title="Healthy Target Hosts"
          yAxisLabel="count"
          color="#8b5cf6"
        />
        <MetricsGraph
          data={service.metrics.custom!.sslHandshakeTime}
          title="SSL Handshake Time"
          yAxisLabel="ms"
          color="#f59e0b"
        />
      </div>
    </div>
  )
} 