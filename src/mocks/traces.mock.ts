import type { MetricDataPoint } from '@/types/telemetry'
import type { MetricWithTrace } from '@/types/telemetry'

export interface SpanEvent {
  timestamp: string;
  name: string;
  attributes: Record<string, string | number | boolean>;
}

interface TraceBase {
  id: string;
  parentId?: string;
  name: string;
  startTime: string;
  endTime: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'error';
  service: string;
  serviceId: string;
  type: string;
  spans: SpanData[];
  rootService: string;
}

interface SpanData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceId: string;
  serviceName: string;
  layer: string;
  status: 'success' | 'error';
  attributes: Record<string, string | number | boolean>;
  events: SpanEvent[];
  parentSpanId?: string;
  tags: Record<string, string>;
  metrics?: {
    [key: string]: MetricWithTrace[];
  };
}

export type Trace = TraceBase;
export type Span = SpanData;

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
      'http.url': '/api/data',
      'http.status_code': 200
    },
    events: [{
      timestamp: startTime.toISOString(),
      name: 'RequestReceived',
      attributes: {
        source_ip: '192.168.1.1'
      }
    }],
    tags: {
      environment: 'production',
      region: 'us-west-2'
    }
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
    parentSpanId: albSpan.id,
    attributes: {
      'http.method': 'GET',
      'http.url': '/api/data',
      'http.status_code': 200,
      'auth.tenant': 'tenant-123'
    },
    events: [{
      timestamp: new Date(startTime.getTime() + 6).toISOString(),
      name: 'AuthenticationSuccess',
      attributes: {
        tenant_id: 'tenant-123'
      }
    }],
    tags: {
      environment: 'production',
      gateway: 'kong'
    }
  };
  spans.push(kongSpan);

  // Heracles API Span
  const heraclesSpan: Span = {
    id: `${traceId}-3`,
    name: 'heracles.getData',
    startTime: new Date(startTime.getTime() + 15).toISOString(),
    endTime: new Date(startTime.getTime() + 25).toISOString(),
    duration: 10,
    serviceId: 'heracles',
    serviceName: 'Heracles API',
    layer: 'core',
    status: 'success',
    attributes: {
      'http.method': 'GET',
      'http.path': '/api/data',
      'http.status_code': 200
    },
    events: [],
    parentSpanId: kongSpan.id,
    tags: {
      environment: 'production',
      service: 'heracles'
    }
  };
  spans.push(heraclesSpan);

  // PostgreSQL Span
  const postgresSpan: Span = {
    id: `${traceId}-4`,
    name: 'postgres.query',
    startTime: new Date(startTime.getTime() + 25).toISOString(),
    endTime: new Date(startTime.getTime() + 35).toISOString(),
    duration: 10,
    serviceId: 'postgres',
    serviceName: 'PostgreSQL',
    layer: 'data',
    status: 'success',
    attributes: {
      'db.system': 'postgresql',
      'db.statement': 'SELECT * FROM data WHERE tenant_id = $1',
      'db.rows_affected': 10
    },
    events: [],
    parentSpanId: heraclesSpan.id,
    tags: {
      environment: 'production',
      database: 'postgres'
    }
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
    parentSpanId: heraclesSpan.id,
    tags: {
      environment: 'production',
      cache: 'redis'
    }
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
    name: 'api.request',
    startTime: startTime.toISOString(),
    endTime: new Date(Math.max(...spans.map(s => new Date(s.endTime).getTime()))).toISOString(),
    timestamp: startTime.toISOString(),
    duration: baseLatency,
    service: 'alb',
    serviceId: 'alb',
    type: 'request',
    status: 'success',
    rootService: 'alb',
    spans
  };
};

// Generate traces that match our metrics data points
export const generateTraces = (metricsDataPoints: MetricDataPoint[]): Trace[] => {
  return metricsDataPoints.map(point => generateTrace(point.timestamp, point.value));
};

// Generate a set of mock traces for the traces page
export const mockTraces: Trace[] = [
  {
    id: 'abc',
    name: 'api.request',
    startTime: new Date('2024-03-20T10:00:00Z').toISOString(),
    endTime: new Date('2024-03-20T10:00:03Z').toISOString(),
    timestamp: new Date('2024-03-20T10:00:00Z').toISOString(),
    duration: 3000,
    service: 'alb',
    serviceId: 'alb',
    type: 'request',
    status: 'success',
    rootService: 'alb',
    spans: [
      {
        id: 'span-1',
        name: 'alb.request',
        startTime: new Date('2024-03-20T10:00:00Z').toISOString(),
        endTime: new Date('2024-03-20T10:00:01Z').toISOString(),
        duration: 1000,
        serviceId: 'alb',
        serviceName: 'Application Load Balancer',
        layer: 'external',
        status: 'success',
        attributes: {
          'http.method': 'GET',
          'http.url': '/api/data',
          'http.status_code': 200
        },
        events: [],
        tags: {
          environment: 'production'
        }
      },
      {
        id: 'span-2',
        name: 'kong.proxy',
        startTime: new Date('2024-03-20T10:00:01Z').toISOString(),
        endTime: new Date('2024-03-20T10:00:02Z').toISOString(),
        duration: 1000,
        serviceId: 'kong',
        serviceName: 'Kong API Gateway',
        layer: 'entry',
        status: 'success',
        parentSpanId: 'span-1',
        attributes: {
          'http.method': 'GET',
          'http.url': '/api/data',
          'http.status_code': 200
        },
        events: [],
        tags: {
          environment: 'production'
        }
      },
      {
        id: 'span-3',
        name: 'heracles.getData',
        startTime: new Date('2024-03-20T10:00:02Z').toISOString(),
        endTime: new Date('2024-03-20T10:00:03Z').toISOString(),
        duration: 1000,
        serviceId: 'heracles',
        serviceName: 'Heracles API',
        layer: 'core',
        status: 'success',
        parentSpanId: 'span-2',
        attributes: {
          'http.method': 'GET',
          'http.path': '/api/data',
          'http.status_code': 200
        },
        events: [],
        tags: {
          environment: 'production'
        }
      }
    ]
  },
];

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