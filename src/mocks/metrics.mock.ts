import { MetricDataPoint, MetricWithTrace } from '@/types/telemetry'
import { generateTrace } from './traces.mock'
import { 
  albMetrics, 
  kongMetrics, 
  heraclesMetrics, 
  postgresMetrics, 
  redisMetrics, 
  prometheusMetrics,
  clientMetrics 
} from '@/data/static-telemetry'

export interface ServiceMetrics {
  id: string;
  name: string;
  layer: 'external' | 'entry' | 'core' | 'data' | 'control';
  status: 'healthy' | 'unhealthy';
  uptime: number;
  latencyP95: number;
  errorRate: number;
  cpu: number;
  memory: number;
  metrics: {
    latency: {
      p50: MetricWithTrace[];
      p95: MetricWithTrace[];
      p99: MetricWithTrace[];
    };
    errors: {
      '4xx': MetricWithTrace[];
      '5xx': MetricWithTrace[];
    };
    resources: {
      cpu: MetricWithTrace[];
      memory: MetricWithTrace[];
    };
    custom?: {
      [key: string]: MetricWithTrace[];
    };
  };
}

// Export the helper functions
export const generateTimeSeriesData = (length: number, baseValue: number, variance: number) => {
  const now = new Date()
  now.setMinutes(0, 0, 0) // Reset to the start of the current hour
  
  return Array.from({ length }, (_, i) => ({
    // Start 24 hours ago and move forward
    timestamp: new Date(now.getTime() - (24 - i) * 3600000).toISOString(),
    value: baseValue + Math.random() * variance
  })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const generatePatternedData = (
  length: number, 
  baseValue: number, 
  variance: number,
  serviceId: string
): MetricWithTrace[] => {
  const dataPoints = Array.from({ length }, (_, i) => {
    const now = new Date()
    now.setMinutes(0, 0, 0)
    const hour = i % 24
    let multiplier = 1

    if (hour >= 9 && hour <= 17) {
      multiplier = 2
    } else if (hour >= 1 && hour <= 5) {
      multiplier = 0.5
    }

    const value = (baseValue + Math.random() * variance) * multiplier
    const timestamp = new Date(now.getTime() - (24 - i) * 3600000).toISOString()
    
    // Generate 1-3 traces for this data point
    const numTraces = Math.floor(Math.random() * 3) + 1
    const traces = Array.from({ length: numTraces }, () => 
      generateTrace(timestamp, value, serviceId)
    )
    
    return {
      timestamp,
      value,
      traceIds: traces.map(t => t.id)
    }
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return dataPoints
}

export const mockMetrics: ServiceMetrics[] = [
  // External Layer (Layer 1: User Interaction)
  {
    id: 'alb',
    name: 'Application Load Balancer',
    layer: 'external',
    status: 'healthy',
    uptime: 99.99,
    latencyP95: 50,
    errorRate: 0.01,
    cpu: 30,
    memory: 45,
    metrics: {
      latency: {
        p50: albMetrics.latencyP50,
        p95: albMetrics.latencyP95,
        p99: albMetrics.latencyP99
      },
      errors: {
        '4xx': albMetrics.errors4xx,
        '5xx': albMetrics.errors5xx
      },
      resources: {
        cpu: albMetrics.cpu,
        memory: albMetrics.memory
      },
      custom: {
        totalRequests: albMetrics.totalRequests,
        sslHandshakeTime: albMetrics.sslHandshake,
        healthyHosts: albMetrics.healthyHosts,
        requestsPerSecond: albMetrics.requestsPerSecond
      }
    }
  },
  {
    id: 'client',
    name: 'Client-Side Metrics',
    layer: 'external',
    status: 'healthy',
    uptime: 99.95,
    latencyP95: 250,
    errorRate: 0.02,
    cpu: 0,
    memory: 0,
    metrics: {
      latency: {
        p50: clientMetrics.latencyP50,
        p95: clientMetrics.latencyP95,
        p99: clientMetrics.latencyP99
      },
      errors: {
        '4xx': clientMetrics.errors4xx,
        '5xx': clientMetrics.errors5xx
      },
      resources: {
        cpu: clientMetrics.cpu,
        memory: clientMetrics.memory
      },
      custom: {
        pageLoadTime: clientMetrics.pageLoadTime,
        firstContentfulPaint: clientMetrics.fcp,
        domInteractive: clientMetrics.domInteractive,
        jsErrors: clientMetrics.jsErrors
      }
    }
  },

  // Entry Layer
  {
    id: 'kong',
    name: 'Kong API Gateway',
    layer: 'entry',
    status: 'unhealthy',
    uptime: 99.95,
    latencyP95: 500,
    errorRate: 0.08,
    cpu: 55,
    memory: 70,
    metrics: {
      latency: {
        p50: kongMetrics.latencyP50,
        p95: kongMetrics.latencyP95,
        p99: kongMetrics.latencyP99
      },
      errors: {
        '4xx': kongMetrics.errors4xx,
        '5xx': kongMetrics.errors5xx
      },
      resources: {
        cpu: kongMetrics.cpu,
        memory: kongMetrics.memory
      },
      custom: {
        connections: kongMetrics.connections,
        rateLimits: kongMetrics.rateLimits
      }
    }
  },

  // Core Layer
  {
    id: 'heracles',
    name: 'Heracles API',
    layer: 'core',
    status: 'healthy',
    uptime: 99.9,
    latencyP95: 200,
    errorRate: 0.15,
    cpu: 75,
    memory: 80,
    metrics: {
      latency: {
        p50: heraclesMetrics.latencyP50,
        p95: heraclesMetrics.latencyP95,
        p99: heraclesMetrics.latencyP99
      },
      errors: {
        '4xx': heraclesMetrics.errors4xx,
        '5xx': heraclesMetrics.errors5xx
      },
      resources: {
        cpu: heraclesMetrics.cpu,
        memory: heraclesMetrics.memory
      },
      custom: {
        jvmHeapUsage: heraclesMetrics.heapUsage,
        threadCount: heraclesMetrics.threads
      }
    }
  },

  // Data Layer
  {
    id: 'postgres',
    name: 'PostgreSQL',
    layer: 'data',
    status: 'healthy',
    uptime: 99.5,
    latencyP95: 180,
    errorRate: 0.2,
    cpu: 85,
    memory: 90,
    metrics: {
      latency: {
        p50: postgresMetrics.latencyP50,
        p95: postgresMetrics.latencyP95,
        p99: postgresMetrics.latencyP99
      },
      errors: {
        '4xx': postgresMetrics.errors4xx,
        '5xx': postgresMetrics.errors5xx
      },
      resources: {
        cpu: postgresMetrics.cpu,
        memory: postgresMetrics.memory
      },
      custom: {
        activeConnections: postgresMetrics.connections,
        deadlocks: postgresMetrics.deadlocks
      }
    }
  },
  {
    id: 'redis',
    name: 'Redis Cache',
    layer: 'data',
    status: 'healthy',
    uptime: 99.99,
    latencyP95: 20,
    errorRate: 0.01,
    cpu: 40,
    memory: 60,
    metrics: {
      latency: {
        p50: redisMetrics.latencyP50,
        p95: redisMetrics.latencyP95,
        p99: redisMetrics.latencyP99
      },
      errors: {
        '4xx': redisMetrics.errors4xx,
        '5xx': redisMetrics.errors5xx
      },
      resources: {
        cpu: redisMetrics.cpu,
        memory: redisMetrics.memory
      },
      custom: {
        hitRatio: redisMetrics.hitRatio,
        evictionRate: redisMetrics.evictions
      }
    }
  },

  // Control Layer
  {
    id: 'prometheus',
    name: 'Prometheus',
    layer: 'control',
    status: 'healthy',
    uptime: 99.95,
    latencyP95: 100,
    errorRate: 0.05,
    cpu: 65,
    memory: 75,
    metrics: {
      latency: {
        p50: prometheusMetrics.latencyP50,
        p95: prometheusMetrics.latencyP95,
        p99: prometheusMetrics.latencyP99
      },
      errors: {
        '4xx': prometheusMetrics.errors4xx,
        '5xx': prometheusMetrics.errors5xx
      },
      resources: {
        cpu: prometheusMetrics.cpu,
        memory: prometheusMetrics.memory
      },
      custom: {
        scrapeLatency: prometheusMetrics.scrapeLatency,
        targetCount: prometheusMetrics.targets
      }
    }
  }
];

export const layers = {
  external: 'Layer 1: User Interaction',
  entry: 'Layer 2: API Gateway',
  core: 'Layer 3: Application Services',
  data: 'Layer 4: Data Layer',
  control: 'Layer 5: Control Plane'
}; 