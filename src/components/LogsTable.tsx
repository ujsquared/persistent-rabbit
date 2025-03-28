'use client'

import { LogEntry } from '@/mocks/logs.mock'
import Link from 'next/link'

interface LogsTableProps {
  logs: LogEntry[]
  selectedComponent: string
  searchQuery: string
}

export default function LogsTable({ logs, selectedComponent, searchQuery }: LogsTableProps) {
  const filteredLogs = logs.filter(log => {
    const matchesComponent = selectedComponent === 'All' || log.component === selectedComponent
    const matchesSearch = log.traceId.includes(searchQuery) || 
                         log.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesComponent && matchesSearch
  })

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Component
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Trace ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Severity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Message
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {log.timestamp}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {log.component}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link 
                  href={`/traces/${log.traceId}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {log.traceId}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${log.severity === 'ERROR' ? 'bg-red-900/50 text-red-200' : 
                    log.severity === 'WARN' ? 'bg-yellow-900/50 text-yellow-200' : 
                    'bg-green-900/50 text-green-200'}`}>
                  {log.severity}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {log.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 