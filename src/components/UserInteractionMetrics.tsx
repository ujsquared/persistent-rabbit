'use client'

import { ServiceMetrics } from '@/mocks/metrics.mock'
import MetricsGraph from './MetricsGraph'

interface UserInteractionMetricsProps {
  alb: ServiceMetrics;
  client: ServiceMetrics;
}

export default function UserInteractionMetrics({ alb, client }: UserInteractionMetricsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">ALB Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsGraph
            data={alb.metrics.latency.p95 || []}
            title="ALB Latency (p95)"
            yAxisLabel="ms"
            color="#60a5fa"
          />
          
          <MetricsGraph
            data={alb.metrics.custom?.requestsPerSecond || []}
            title="Requests per Second"
            yAxisLabel="requests"
            color="#34d399"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MetricsGraph
            data={alb.metrics.custom?.healthyHosts || []}
            title="Healthy Hosts"
            yAxisLabel="hosts"
            color="#a78bfa"
          />

          <MetricsGraph
            data={alb.metrics.custom?.sslHandshakeTime || []}
            title="SSL Handshake Time"
            yAxisLabel="ms"
            color="#f472b6"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Client Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsGraph
            data={client.metrics.custom?.pageLoadTime || []}
            title="Page Load Time"
            yAxisLabel="ms"
            color="#60a5fa"
          />

          <MetricsGraph
            data={client.metrics.custom?.firstContentfulPaint || []}
            title="First Contentful Paint"
            yAxisLabel="ms"
            color="#34d399"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MetricsGraph
            data={client.metrics.custom?.activeUsers || []}
            title="Active Users"
            yAxisLabel="users"
            color="#a78bfa"
          />

          <MetricsGraph
            data={client.metrics.custom?.jsErrors || []}
            title="JavaScript Errors"
            yAxisLabel="errors"
            color="#f472b6"
          />
        </div>
      </div>
    </div>
  )
} 