import { Trace } from '@/types/telemetry'

// Fixed reference date: March 26, 2025
const REFERENCE_DATE = new Date('2025-03-26T00:00:00Z')

// Static trace IDs that will be referenced in metrics
export const TRACE_IDS = {
  NORMAL: 'trace-a',
  HIGH_LOAD: 'trace-b',
  ERROR_DB: 'trace-c',
  ERROR_API: 'trace-d'
}

// Helper to create timestamp for a specific hour (relative to reference date)
const getHourTimestamp = (hoursAgo: number) => {
  const date = new Date(REFERENCE_DATE)
  date.setHours(date.getHours() - hoursAgo, 0, 0, 0)
  return date.toISOString()
}

// Create metric data points with the same timestamps
const createMetricPoints = (values: number[], traceIds: string[] = []) => [
  { timestamp: getHourTimestamp(18), value: values[0], traceIds: [traceIds[0] || TRACE_IDS.NORMAL] },
  { timestamp: getHourTimestamp(12), value: values[1], traceIds: [traceIds[1] || TRACE_IDS.HIGH_LOAD] },
  { timestamp: getHourTimestamp(6), value: values[2], traceIds: [traceIds[2] || TRACE_IDS.ERROR_DB] },
  { timestamp: getHourTimestamp(0), value: values[3], traceIds: [traceIds[3] || TRACE_IDS.NORMAL] }
]

// ALB Metrics
export const albMetrics = {
  latencyP50: createMetricPoints([20, 35, 25, 22]),
  latencyP95: createMetricPoints([45, 95, 55, 48]),
  latencyP99: createMetricPoints([90, 180, 110, 95]),
  errors4xx: createMetricPoints([0.5, 2.5, 0.8, 0.6]),
  errors5xx: createMetricPoints([0.1, 0.2, 1.5, 0.1]),
  cpu: createMetricPoints([30, 45, 35, 32]),
  memory: createMetricPoints([45, 60, 50, 48]),
  totalRequests: createMetricPoints([1000, 1500, 1200, 1100]),
  sslHandshake: createMetricPoints([10, 15, 12, 11]),
  healthyHosts: createMetricPoints([3, 3, 2, 3]),
  requestsPerSecond: createMetricPoints([100, 150, 120, 110])
}

// Client Metrics
export const clientMetrics = {
  latencyP50: createMetricPoints([100, 150, 120, 110]),
  latencyP95: createMetricPoints([250, 350, 280, 260]),
  latencyP99: createMetricPoints([500, 700, 550, 520]),
  errors4xx: createMetricPoints([1.0, 2.0, 1.5, 1.2]),
  errors5xx: createMetricPoints([0.2, 0.5, 0.3, 0.2]),
  cpu: createMetricPoints([0, 0, 0, 0]),
  memory: createMetricPoints([0, 0, 0, 0]),
  pageLoadTime: createMetricPoints([1200, 1800, 1400, 1300]),
  fcp: createMetricPoints([800, 1200, 900, 850]),
  domInteractive: createMetricPoints([600, 900, 700, 650]),
  jsErrors: createMetricPoints([5, 12, 8, 6])
}

// Kong Metrics
export const kongMetrics = {
  latencyP50: createMetricPoints([40, 250, 45, 42], [
    '',  // Normal point
    TRACE_IDS.ERROR_API, // High latency point with error trace
    '',  // Normal point
    ''   // Normal point
  ]),
  latencyP95: createMetricPoints([120, 500, 140, 130], [
    '',
    TRACE_IDS.ERROR_API,
    '',
    ''
  ]),
  latencyP99: createMetricPoints([250, 800, 280, 260], [
    '',
    TRACE_IDS.ERROR_API,
    '',
    ''
  ]),
  errors4xx: createMetricPoints([2.0, 8.0, 2.5, 2.2], [
    '',
    TRACE_IDS.ERROR_API,
    '',
    ''
  ]),
  errors5xx: createMetricPoints([0.5, 5.0, 0.7, 0.6], [
    '',
    TRACE_IDS.ERROR_API,
    '',
    ''
  ]),
  cpu: createMetricPoints([55, 75, 60, 58]),
  memory: createMetricPoints([70, 85, 75, 72]),
  connections: createMetricPoints([500, 800, 600, 550]),
  rateLimits: createMetricPoints([50, 100, 70, 60])
}

// Heracles Metrics
export const heraclesMetrics = {
  latencyP50: createMetricPoints([70, 100, 80, 75]),
  latencyP95: createMetricPoints([200, 300, 240, 220]),
  latencyP99: createMetricPoints([400, 600, 480, 440]),
  errors4xx: createMetricPoints([3.0, 5.0, 3.5, 3.2]),
  errors5xx: createMetricPoints([1.0, 2.0, 1.5, 1.2]),
  cpu: createMetricPoints([75, 90, 80, 78]),
  memory: createMetricPoints([80, 95, 85, 82]),
  heapUsage: createMetricPoints([70, 85, 75, 72]),
  threads: createMetricPoints([100, 150, 120, 110])
}

// Postgres Metrics
export const postgresMetrics = {
  latencyP50: createMetricPoints([50, 80, 60, 55]),
  latencyP95: createMetricPoints([180, 250, 200, 190]),
  latencyP99: createMetricPoints([350, 500, 400, 380]),
  errors4xx: createMetricPoints([0.1, 0.3, 0.2, 0.15]),
  errors5xx: createMetricPoints([2.0, 3.0, 2.5, 2.2]),
  cpu: createMetricPoints([85, 95, 88, 86]),
  memory: createMetricPoints([90, 98, 93, 91]),
  connections: createMetricPoints([200, 300, 250, 220]),
  deadlocks: createMetricPoints([2, 5, 3, 2])
}

// Redis Metrics
export const redisMetrics = {
  latencyP50: createMetricPoints([5, 8, 6, 5.5]),
  latencyP95: createMetricPoints([20, 30, 25, 22]),
  latencyP99: createMetricPoints([50, 70, 60, 55]),
  errors4xx: createMetricPoints([0.01, 0.03, 0.02, 0.015]),
  errors5xx: createMetricPoints([0.01, 0.02, 0.015, 0.01]),
  cpu: createMetricPoints([40, 60, 45, 42]),
  memory: createMetricPoints([60, 75, 65, 62]),
  hitRatio: createMetricPoints([85, 75, 80, 82]),
  evictions: createMetricPoints([10, 20, 15, 12])
}

// Prometheus Metrics
export const prometheusMetrics = {
  latencyP50: createMetricPoints([30, 45, 35, 32]),
  latencyP95: createMetricPoints([100, 150, 120, 110]),
  latencyP99: createMetricPoints([200, 300, 240, 220]),
  errors4xx: createMetricPoints([0.1, 0.2, 0.15, 0.12]),
  errors5xx: createMetricPoints([0.05, 0.1, 0.07, 0.06]),
  cpu: createMetricPoints([65, 80, 70, 68]),
  memory: createMetricPoints([75, 85, 78, 76]),
  scrapeLatency: createMetricPoints([50, 70, 60, 55]),
  targets: createMetricPoints([100, 100, 98, 100])
}

// Static trace data that corresponds to the metrics
export const staticTraces: Record<string, Trace> = {
  [TRACE_IDS.NORMAL]: {
    id: TRACE_IDS.NORMAL,
    startTime: getHourTimestamp(18),
    endTime: getHourTimestamp(18),
    duration: 150,
    rootService: 'alb',
    status: 'success',
    spans: [
      {
        id: `${TRACE_IDS.NORMAL}-1`,
        name: 'alb.request',
        startTime: getHourTimestamp(18),
        endTime: getHourTimestamp(18),
        duration: 5,
        serviceId: 'alb',
        serviceName: 'Application Load Balancer',
        layer: 'external',
        status: 'success',
        attributes: {
          'http.method': 'GET',
          'http.url': '/api/v1/data',
          'http.status_code': 200,
        },
        events: [
          {
            timestamp: getHourTimestamp(18),
            name: 'RequestReceived',
            attributes: { source_ip: '192.168.1.1' }
          }
        ]
      }
    ]
  },
  [TRACE_IDS.HIGH_LOAD]: {
    id: TRACE_IDS.HIGH_LOAD,
    startTime: getHourTimestamp(12),
    endTime: getHourTimestamp(12),
    duration: 250,
    rootService: 'alb',
    status: 'success',
    spans: [
      // High load spans
    ]
  },
  [TRACE_IDS.ERROR_DB]: {
    id: TRACE_IDS.ERROR_DB,
    startTime: getHourTimestamp(6),
    endTime: getHourTimestamp(6),
    duration: 500,
    rootService: 'alb',
    status: 'error',
    spans: [
      // DB error spans
    ]
  },
  [TRACE_IDS.ERROR_API]: {
    id: TRACE_IDS.ERROR_API,
    startTime: getHourTimestamp(12),
    endTime: getHourTimestamp(12),
    duration: 800, // Long duration indicating problem
    rootService: 'kong',
    status: 'error',
    spans: [
      {
        id: `${TRACE_IDS.ERROR_API}-1`,
        name: 'kong.request',
        startTime: getHourTimestamp(12),
        endTime: getHourTimestamp(12),
        duration: 50,
        serviceId: 'kong',
        serviceName: 'Kong API Gateway',
        layer: 'entry',
        status: 'error',
        attributes: {
          'http.method': 'POST',
          'http.url': '/api/v1/orders/bulk',
          'http.status_code': 503,
          'error.type': 'timeout',
          'error.message': 'Request timed out after 500ms',
          'kong.route': 'orders-api',
          'kong.service': 'orders-service',
          'kong.consumer': 'retail-client',
          'kong.ratelimit': '1000r/m',
          'kong.upstream': 'orders-cluster-1'
        },
        events: [
          {
            timestamp: getHourTimestamp(12),
            name: 'RequestReceived',
            attributes: { 
              source_ip: '192.168.1.100',
              request_id: 'req-123',
              payload_size: '2.5MB'
            }
          },
          {
            timestamp: getHourTimestamp(12),
            name: 'RateLimitChecked',
            attributes: {
              current_rate: '850r/m',
              limit: '1000r/m'
            }
          },
          {
            timestamp: getHourTimestamp(12),
            name: 'UpstreamTimeout',
            attributes: {
              timeout_ms: 500,
              upstream_latency: 503
            }
          }
        ]
      },
      {
        id: `${TRACE_IDS.ERROR_API}-2`,
        name: 'orders.bulk_create',
        startTime: getHourTimestamp(12),
        endTime: getHourTimestamp(12),
        duration: 503,
        serviceId: 'orders',
        serviceName: 'Orders Service',
        layer: 'core',
        status: 'error',
        parentSpanId: `${TRACE_IDS.ERROR_API}-1`,
        attributes: {
          'service.name': 'orders-service',
          'service.method': 'BulkCreateOrders',
          'error.type': 'timeout',
          'error.message': 'Database connection timeout',
          'db.system': 'postgresql',
          'db.statement': 'INSERT INTO orders (batch)',
          'db.connection_pool': 'orders-pool-1'
        },
        events: [
          {
            timestamp: getHourTimestamp(12),
            name: 'BatchValidation',
            attributes: { 
              orders_count: 1000,
              validation_time_ms: 150
            }
          },
          {
            timestamp: getHourTimestamp(12),
            name: 'DatabaseTimeout',
            attributes: {
              pool_size: 20,
              active_connections: 20,
              queue_depth: 5
            }
          }
        ]
      }
    ]
  }
} 