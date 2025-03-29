'use client'

import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { useTrace } from '@/contexts/TraceContext'

interface MetricsGraphProps {
  data: Array<{
    timestamp: string;
    value: number;
    traceId?: string;
  }>;
  title: string;
  yAxisLabel: string;
  color: string;
}

// Sample Kong API logs structure
interface KongLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  traceId?: string;
  metadata: {
    service: string;
    latency?: number;
    status?: number;
    method?: string;
    path?: string;
  };
}

// Sample Kong API logs
const kongLogs: KongLog[] = [
  {
    timestamp: new Date(Date.now() - 5000).toISOString(),
    level: 'info',
    message: 'Request processed successfully',
    traceId: 'trace-d',
    metadata: {
      service: 'orders-service',
      latency: 250,
      status: 200,
      method: 'POST',
      path: '/api/v1/orders/bulk'
    }
  },
  {
    timestamp: new Date(Date.now() - 15000).toISOString(),
    level: 'warn',
    message: 'High latency detected',
    traceId: 'trace-d',
    metadata: {
      service: 'orders-service',
      latency: 450,
      status: 200,
      method: 'POST',
      path: '/api/v1/orders/bulk'
    }
  },
  {
    timestamp: new Date(Date.now() - 25000).toISOString(),
    level: 'error',
    message: 'Upstream timeout',
    traceId: 'trace-d',
    metadata: {
      service: 'orders-service',
      latency: 503,
      status: 503,
      method: 'POST',
      path: '/api/v1/orders/bulk'
    }
  }
]

export default function MetricsGraph({ 
  data = [],
  title, 
  yAxisLabel, 
  color 
}: MetricsGraphProps) {
  const { setSelectedTraceId } = useTrace()

  if (!data || data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#666'
        }
      },
      tooltip: {
        callbacks: {
          afterBody: function(tooltipItems: TooltipItem<'line'>[]) {
            if(!tooltipItems.length) return ''
            return ''
          },
          label: function(context: TooltipItem<'line'>) {
            const label = context.dataset.label || ''
            return `${label}: ${context.formattedValue} ${yAxisLabel}`
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'minute'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel
        }
      }
    }
  }

  const chartData: ChartData<'line'> = {
    datasets: [
      {
        label: title,
        data: data.map(point => ({
          x: new Date(point.timestamp).getTime(),
          y: point.value
        })),
        borderColor: color,
        tension: 0.1
      }
    ]
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <Line options={options} data={chartData} />
      
      {/* Kong API Logs Section */}
      <div className="mt-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-3 border-b border-gray-700">
          <h4 className="text-sm font-medium text-gray-300">Kong API Logs</h4>
        </div>
        <div className="divide-y divide-gray-700">
          {kongLogs.map((log, index) => (
            <div 
              key={index}
              className="p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    log.level === 'error' ? 'bg-red-900/50 text-red-200' :
                    log.level === 'warn' ? 'bg-yellow-900/50 text-yellow-200' :
                    'bg-green-900/50 text-green-200'
                  }`}>
                    {log.level}
                  </span>
                </div>
                {log.traceId && (
                  <button
                    onClick={() => setSelectedTraceId(log.traceId || null)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-mono"
                  >
                    {log.traceId}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 mb-1">{log.message}</p>
              <div className="text-xs text-gray-400 font-mono">
                {`${log.metadata.method} ${log.metadata.path} - ${log.metadata.status} - ${log.metadata.latency}ms`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 