export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export interface MetricWithTrace {
  timestamp: string;
  value: number;
  traceId?: string;
}

export interface SpanEvent {
  timestamp: string;
  name: string;
  attributes: Record<string, string | number | boolean>;
}

export interface Span {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
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
    [key: string]: string | number | boolean | undefined;
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

export interface Service {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'unhealthy';
  layer: string;
  metrics: {
    latency: {
      p50: MetricWithTrace[];
      p95: MetricWithTrace[];
      p99: MetricWithTrace[];
    }
    errors: {
      '4xx': MetricWithTrace[];
      '5xx': MetricWithTrace[];
    }
    resources: {
      cpu: MetricWithTrace[];
      memory: MetricWithTrace[];
    }
    custom: {
      [key: string]: MetricWithTrace[];
    }
  }
} 