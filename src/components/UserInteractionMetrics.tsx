'use client'

import { ServiceMetrics } from '@/mocks/metrics.mock'
import MetricsGraph from './MetricsGraph'

interface UserInteractionMetricsProps {
  alb: ServiceMetrics
  client: ServiceMetrics
}

export default function UserInteractionMetrics({ alb, client }: UserInteractionMetricsProps) {
  // Validate required custom metrics exist
  if (!alb.metrics.custom || !client.metrics.custom) {
    return (
      <div className="text-gray-400 text-center py-4">
        Missing required metrics data
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ALB Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">Load Balancer Metrics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsGraph
            data={alb.metrics.latency.p95}
            title="ALB Latency (p95)"
            yAxisLabel="ms"
            color="#60a5fa"
          />
          <MetricsGraph
            data={alb.metrics.custom.requestsPerSecond}
            title="Requests per Second"
            yAxisLabel="requests"
            color="#10b981"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsGraph
            data={alb.metrics.custom.healthyHosts}
            title="Healthy Target Hosts"
            yAxisLabel="count"
            color="#8b5cf6"
          />
          <MetricsGraph
            data={alb.metrics.custom.sslHandshakeTime}
            title="SSL Handshake Time"
            yAxisLabel="ms"
            color="#f59e0b"
          />
        </div>
      </div>

      {/* Client Metrics Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200">Client-Side Metrics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsGraph
            data={client.metrics.custom.pageLoadTime}
            title="Page Load Time"
            yAxisLabel="ms"
            color="#60a5fa"
          />
          <MetricsGraph
            data={client.metrics.custom.firstContentfulPaint}
            title="First Contentful Paint"
            yAxisLabel="ms"
            color="#10b981"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricsGraph
            data={client.metrics.custom.activeUsers}
            title="Active Users"
            yAxisLabel="count"
            color="#8b5cf6"
          />
          <MetricsGraph
            data={client.metrics.custom.jsErrors}
            title="JavaScript Errors"
            yAxisLabel="count"
            color="#ef4444"
          />
        </div>
      </div>
    </div>
  )
} 