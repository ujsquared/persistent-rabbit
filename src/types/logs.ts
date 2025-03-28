export interface LogEntry {
  id: string
  timestamp: string
  component: string
  message: string
  traceId: string
  level: string
  severity: string
}
