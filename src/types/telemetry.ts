export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export interface MetricWithTrace extends MetricDataPoint {
  traceIds: string[];
}

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