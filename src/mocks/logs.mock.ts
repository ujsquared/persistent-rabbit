export interface LogEntry {
  id: string
  timestamp: string
  component: string
  message: string
  traceId: string
  level: string
  severity: string
}

export const mockLogs = [
  {
    id: 'trace-001',
    timestamp: '2024-03-20T10:00:00Z',
    component: 'ALB',
    message: 'Incoming request received',
    traceId: 'abc',
    level: 'INFO',
    severity: 'info'
  },
  {
    id: 'trace-002',
    timestamp: '2024-03-20T10:00:01Z',
    component: 'Kong',
    message: 'Request authenticated',
    traceId: 'abc',
    level: 'INFO',
    severity: 'info'
  },
  {
    id: 'trace-003',
    timestamp: '2024-03-20T10:00:02Z',
    component: 'Heracles API',
    message: 'Processing user request',
    traceId: 'abc',
    level: 'INFO',
    severity: 'info'
  },
  {
    id: 'trace-004',
    timestamp: '2024-03-20T10:00:03Z',
    component: 'PostgreSQL',
    message: 'Database query executed successfully',
    traceId: 'def',
    level: 'INFO',
    severity: 'info'
  },
  {
    id: 'trace-005',
    timestamp: '2024-03-20T10:00:04Z',
    component: 'Redis',
    message: 'Cache updated',
    traceId: 'def',
    level: 'INFO',
    severity: 'info'
  }
] 