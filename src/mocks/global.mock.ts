import { generatePatternedData } from './metrics.mock'

export interface GlobalMetrics {
  totalRequestsPerMin: number
  globalErrorRate: number
  uptime: number
  sloCompliance: number
  activeTenants: number
  metrics: {
    requestRate: {
      total: MetricDataPoint[]
      successful: MetricDataPoint[]
      failed: MetricDataPoint[]
    }
    errorRate: MetricDataPoint[]
    uptime: MetricDataPoint[]
    sloCompliance: {
      latency: MetricDataPoint[]
      availability: MetricDataPoint[]
    }
    tenants: {
      active: MetricDataPoint[]
      resourceUsage: MetricDataPoint[]
    }
  }
}

export const globalMetrics: GlobalMetrics = {
  totalRequestsPerMin: 5000,
  globalErrorRate: 0.02,
  uptime: 99.95,
  sloCompliance: 99.8,
  activeTenants: 250,
  metrics: {
    requestRate: {
      total: generatePatternedData(24, 5000, 1000),
      successful: generatePatternedData(24, 4900, 950),
      failed: generatePatternedData(24, 100, 50)
    },
    errorRate: generatePatternedData(24, 2, 1),
    uptime: generatePatternedData(24, 99.95, 0.1),
    sloCompliance: {
      latency: generatePatternedData(24, 99.8, 0.5),
      availability: generatePatternedData(24, 99.9, 0.2)
    },
    tenants: {
      active: generatePatternedData(24, 250, 30),
      resourceUsage: generatePatternedData(24, 75, 15)
    }
  }
}; 