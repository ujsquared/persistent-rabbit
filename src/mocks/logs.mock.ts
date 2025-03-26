export interface LogEntry {
  id: string;
  timestamp: string;
  component: string;
  traceId: string;
  severity: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export const mockLogs: LogEntry[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i}`,
  timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  component: ['ALB', 'Kong', 'Heracles API', 'PostgreSQL', 'Redis'][Math.floor(Math.random() * 5)],
  traceId: `trace_${Math.random().toString(36).substr(2, 9)}`,
  severity: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)] as 'INFO' | 'WARN' | 'ERROR',
  message: [
    'Request processed successfully',
    'Connection timeout',
    'Invalid request parameters',
    'Database query failed',
    'Cache miss'
  ][Math.floor(Math.random() * 5)]
})).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); 