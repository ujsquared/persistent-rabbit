'use client'

import { useState } from 'react'
import { useLogsStore } from '@/stores/logsStore'
import LogsTable from '@/components/LogsTable'

const components = ['All', 'ALB', 'Kong', 'Heracles API', 'PostgreSQL', 'Redis']

export default function LogsPage() {
  const [selectedComponent, setSelectedComponent] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const logs = useLogsStore((state) => state.logs)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Logs</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="component" className="block text-sm font-medium text-gray-300 mb-2">
            Component
          </label>
          <select
            id="component"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {components.map((component) => (
              <option key={component} value={component}>
                {component}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
            Search Trace ID or Message
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter trace ID or message..."
            className="w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <LogsTable
        logs={logs}
        selectedComponent={selectedComponent}
        searchQuery={searchQuery}
      />
    </div>
  )
} 