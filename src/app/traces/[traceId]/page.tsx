'use client'

import { useParams } from 'next/navigation'
import { useLogsStore } from '@/stores/logsStore'
import TraceGraph from '@/components/TraceGraph' // We'll create this next

export default function TracePage() {
  const { traceId } = useParams()
  const logs = useLogsStore((state) => state.logs)
  
  // Filter logs for this trace
  const traceLogs = logs.filter(log => log.traceId === traceId)
  
  // Sort by timestamp to get the sequence
  const sortedLogs = [...traceLogs].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trace: {traceId}</h1>
      <div className="h-[600px] border rounded-lg">
        <TraceGraph logs={sortedLogs} />
      </div>
    </div>
  )
} 