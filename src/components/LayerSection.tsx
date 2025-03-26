'use client'

import { ServiceMetrics } from '@/mocks/metrics.mock'
import ServiceHealthCard from './ServiceHealthCard'
import UserInteractionMetrics from './UserInteractionMetrics'
import MetricsGraph from './MetricsGraph'
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface LayerSectionProps {
  title: string
  services: ServiceMetrics[]
}

export default function LayerSection({ title, services }: LayerSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceMetrics>(services[0])
  const [isExpanded, setIsExpanded] = useState(false)
  const isExternalLayer = selectedService.layer === 'external'

  // Find required services for external layer
  const albService = services.find(s => s.id === 'alb')
  const clientService = services.find(s => s.id === 'client')

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-400">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-200">{title}</h2>
            <p className="text-sm text-gray-500">
              {services.map(s => s.name).join(', ')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {services.map(service => (
            <div
              key={service.id}
              className={`h-2 w-2 rounded-full ${
                service.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              title={`${service.name}: ${service.status}`}
            />
          ))}
        </div>
      </button>

      {isExpanded && (
        <div className="pl-12 pr-4 py-4 space-y-6 bg-gray-900/30 rounded-lg border border-gray-800/50 mt-1">
          {isExternalLayer ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                  <ServiceHealthCard key={service.id} service={service} />
                ))}
              </div>
              {albService && clientService ? (
                <UserInteractionMetrics 
                  alb={albService}
                  client={clientService}
                />
              ) : (
                <div className="text-gray-400 text-center py-4">
                  Missing required services for User Interaction metrics
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-6">
                {services.map(service => (
                  <ServiceHealthCard key={service.id} service={service} />
                ))}
              </div>
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-200">Service Details</h3>
                    <select 
                      value={selectedService.id}
                      onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value)!)}
                      className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MetricsGraph
                      data={selectedService.metrics.latency.p95}
                      title="Latency (p95)"
                      yAxisLabel="ms"
                      color="#60a5fa"
                    />
                    <MetricsGraph
                      data={selectedService.metrics.errors['5xx']}
                      title="5xx Errors"
                      yAxisLabel="count"
                      color="#ef4444"
                    />
                  </div>
                  {selectedService.metrics.custom && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(selectedService.metrics.custom).map(([key, data]) => (
                        <MetricsGraph
                          key={key}
                          data={data}
                          title={key.split(/(?=[A-Z])/).join(' ')}
                          yAxisLabel="value"
                          color="#10b981"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 