'use client'

import { Service } from '@/types/telemetry'
import MetricsGraph from './MetricsGraph'

interface ALBMetricsProps {
  service: Service
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
          color="#34d399"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsGraph
          data={service.metrics.custom!.healthyHosts}
          title="Healthy Hosts"
          yAxisLabel="hosts"
          color="#a78bfa"
        />

        <MetricsGraph
          data={service.metrics.custom!.sslHandshakeTime}
          title="SSL Handshake Time"
          yAxisLabel="ms"
          color="#f472b6"
        />
      </div>
    </div>
  )
} 