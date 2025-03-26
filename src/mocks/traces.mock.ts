import { Trace, Span, MetricDataPoint } from '@/types/telemetry'
import { staticTraces } from '@/data/static-telemetry'

export interface SpanEvent {
  timestamp: string;
  name: string;
  attributes: Record<string, any>;
}

export interface Span {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number; // in milliseconds
  serviceId: string;
  serviceName: string;
  layer: string;
  status: 'success' | 'error';
  attributes: {
    'http.method'?: string;
    'http.url'?: string;
    'http.status_code'?: number;
    'db.system'?: string;
    'db.statement'?: string;
    'error.message'?: string;
    [key: string]: any;
  };
  events: SpanEvent[];
  parentSpanId?: string;
}

export interface Trace {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  rootService: string;
  status: 'success' | 'error';
  spans: Span[];
}

// Helper function to generate a trace that matches our metrics data
export const generateTrace = (
  timestamp: string, 
  baseLatency: number = 100,
  targetServiceId?: string
): Trace => {
  const startTime = new Date(timestamp);
  const traceId = Math.random().toString(36).substring(2, 15);
  
  // Generate spans that match our service architecture
  const spans: Span[] = [];
  
  // ALB Span
  const albSpan: Span = {
    id: `${traceId}-1`,
    name: 'alb.request',
    startTime: startTime.toISOString(),
    endTime: new Date(startTime.getTime() + 5).toISOString(),
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
        timestamp: startTime.toISOString(),
        name: 'RequestReceived',
        attributes: { source_ip: '192.168.1.1' }
      }
    ]
  };
  spans.push(albSpan);

  // Kong Span
  const kongSpan: Span = {
    id: `${traceId}-2`,
    name: 'kong.proxy',
    startTime: new Date(startTime.getTime() + 5).toISOString(),
    endTime: new Date(startTime.getTime() + 15).toISOString(),
    duration: 10,
    serviceId: 'kong',
    serviceName: 'Kong API Gateway',
    layer: 'entry',
    status: 'success',
    attributes: {
      'http.method': 'GET',
      'http.url': '/api/v1/data',
      'http.status_code': 200,
      'auth.tenant': 'tenant-123'
    },
    events: [
      {
        timestamp: new Date(startTime.getTime() + 6).toISOString(),
        name: 'AuthenticationSuccess',
        attributes: { tenant_id: 'tenant-123' }
      }
    ],
    parentSpanId: albSpan.id
  };
  spans.push(kongSpan);

  // Heracles API Span
  const heraclesSpan: Span = {
    id: `${traceId}-3`,
    name: 'heracles.getData',
    startTime: new Date(startTime.getTime() + 15).toISOString(),
    endTime: new Date(startTime.getTime() + 85).toISOString(),
    duration: 70,
    serviceId: 'heracles',
    serviceName: 'Heracles API',
    layer: 'core',
    status: 'success',
    attributes: {
      'http.method': 'GET',
      'http.path': '/api/v1/data',
      'http.status_code': 200,
    },
    events: [],
    parentSpanId: kongSpan.id
  };
  spans.push(heraclesSpan);

  // PostgreSQL Span
  const postgresSpan: Span = {
    id: `${traceId}-4`,
    name: 'postgres.query',
    startTime: new Date(startTime.getTime() + 25).toISOString(),
    endTime: new Date(startTime.getTime() + 65).toISOString(),
    duration: 40,
    serviceId: 'postgres',
    serviceName: 'PostgreSQL',
    layer: 'data',
    status: 'success',
    attributes: {
      'db.system': 'postgresql',
      'db.statement': 'SELECT * FROM data WHERE tenant_id = $1',
      'db.rows_affected': 100
    },
    events: [],
    parentSpanId: heraclesSpan.id
  };
  spans.push(postgresSpan);

  // Redis Cache Check Span
  const redisSpan: Span = {
    id: `${traceId}-5`,
    name: 'redis.get',
    startTime: new Date(startTime.getTime() + 20).toISOString(),
    endTime: new Date(startTime.getTime() + 22).toISOString(),
    duration: 2,
    serviceId: 'redis',
    serviceName: 'Redis Cache',
    layer: 'data',
    status: 'success',
    attributes: {
      'db.system': 'redis',
      'cache.operation': 'GET',
      'cache.key': 'data:tenant-123'
    },
    events: [
      {
        timestamp: new Date(startTime.getTime() + 21).toISOString(),
        name: 'CacheMiss',
        attributes: {}
      }
    ],
    parentSpanId: heraclesSpan.id
  };
  spans.push(redisSpan);

  // If targetServiceId is provided, adjust the relevant span's latency
  if (targetServiceId) {
    const targetSpan = spans.find(s => s.serviceId === targetServiceId);
    if (targetSpan) {
      const oldDuration = targetSpan.duration;
      targetSpan.duration = baseLatency;
      targetSpan.endTime = new Date(
        new Date(targetSpan.startTime).getTime() + baseLatency
      ).toISOString();

      // Adjust subsequent spans
      spans.forEach(span => {
        if (new Date(span.startTime) > new Date(targetSpan.startTime)) {
          span.startTime = new Date(
            new Date(span.startTime).getTime() + (baseLatency - oldDuration)
          ).toISOString();
          span.endTime = new Date(
            new Date(span.endTime).getTime() + (baseLatency - oldDuration)
          ).toISOString();
        }
      });
    }
  }

  return {
    id: traceId,
    startTime: startTime.toISOString(),
    endTime: new Date(
      Math.max(...spans.map(s => new Date(s.endTime).getTime()))
    ).toISOString(),
    duration: baseLatency,
    rootService: 'alb',
    status: 'success',
    spans
  };
};

// Generate traces that match our metrics data points
export const generateTraces = (metricsDataPoints: MetricDataPoint[]): Trace[] => {
  return metricsDataPoints.map(point => generateTrace(point.timestamp, point.value));
};

// Generate a set of mock traces for the traces page
export const mockTraces = Object.values(staticTraces)

// Add some error traces with specific patterns
const errorScenarios = [
  {
    name: 'Database Deadlock',
    service: 'postgres',
    error: {
      type: 'deadlock',
      message: 'Deadlock detected while trying to acquire lock'
    }
  },
  {
    name: 'API Rate Limit',
    service: 'kong',
    error: {
      type: 'rate_limit_exceeded',
      message: 'API rate limit exceeded for tenant'
    }
  },
  {
    name: 'Memory Overflow',
    service: 'heracles',
    error: {
      type: 'out_of_memory',
      message: 'Java heap space error'
    }
  }
];

errorScenarios.forEach((scenario, i) => {
  const now = new Date();
  const trace = generateTrace(now.toISOString(), 300);
  const errorSpan = trace.spans.find(s => s.serviceId === scenario.service)!;
  
  errorSpan.status = 'error';
  errorSpan.attributes['error.type'] = scenario.error.type;
  errorSpan.attributes['error.message'] = scenario.error.message;
  
  errorSpan.events.push({
    timestamp: new Date(now.getTime() + errorSpan.duration - 1).toISOString(),
    name: 'error',
    attributes: {
      'error.type': scenario.error.type,
      'error.message': scenario.error.message
    }
  });

  trace.status = 'error';
  trace.id = `error-${i + 1}`;
  
  mockTraces.push(trace);
});

// Sort traces by start time, most recent first
mockTraces.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()); 