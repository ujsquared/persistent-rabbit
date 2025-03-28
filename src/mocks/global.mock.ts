import { generatePatternedData } from './metrics.mock'
import { MetricWithTrace } from '@/types/telemetry'

interface GlobalMetrics {
  requests: {
    total: MetricWithTrace[]
    successful: MetricWithTrace[]
    failed: MetricWithTrace[]
  }
  errorRate: MetricWithTrace[]
  uptime: MetricWithTrace[]
  performance: {
    latency: MetricWithTrace[]
    availability: MetricWithTrace[]
  }
  resources: {
    active: MetricWithTrace[]
    resourceUsage: MetricWithTrace[]
  }
}

export const globalMetrics: GlobalMetrics = {
  requests: {
    total: generatePatternedData(24, 5000, 1000, 'global'),
    successful: generatePatternedData(24, 4900, 950, 'global'),
    failed: generatePatternedData(24, 100, 50, 'global')
  },
  errorRate: generatePatternedData(24, 2, 1, 'global'),
  uptime: generatePatternedData(24, 99.95, 0.1, 'global'),
  performance: {
    latency: generatePatternedData(24, 99.8, 0.5, 'global'),
    availability: generatePatternedData(24, 99.9, 0.2, 'global')
  },
  resources: {
    active: generatePatternedData(24, 250, 30, 'global'),
    resourceUsage: generatePatternedData(24, 75, 15, 'global')
  }
} 