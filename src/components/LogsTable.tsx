'use client'

import { LogEntry } from '@/mocks/logs.mock'

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
      <table className="min-w-full">
        <thead className="bg-gray-900/50">
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
            <tr key={log.id} className="hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                {log.component}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                <a href={`/traces/${log.traceId}`} className="text-blue-400 hover:text-blue-300">
                  {log.traceId}
                </a>
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