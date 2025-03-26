'use client'

import { useTrace } from '@/contexts/TraceContext'
import { MetricWithTrace } from '@/types/telemetry'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns' // For time scale
import { Line } from 'react-chartjs-2'
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface MetricsGraphProps {
  data: MetricWithTrace[]
  title: string
  yAxisLabel: string
  color: string
}

export default function MetricsGraph({ 
  data = [], // Provide default empty array
  title, 
  yAxisLabel, 
  color 
}: MetricsGraphProps) {
  const { setSelectedTraceId } = useTrace()

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-64 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9ca3af'
        }
      },
      tooltip: {
        callbacks: {
          afterBody: (context: any) => {
            const dataPoint = data[context[0].dataIndex]
            if (dataPoint.traceIds.length > 0) {
              return [
                'Click to view trace details',
                '───────────────',
                `Trace ID: ${dataPoint.traceIds[0]}`,
                `Value: ${dataPoint.value}${yAxisLabel}`
              ].join('\n')
            }
            return `Value: ${dataPoint.value}${yAxisLabel}`
          },
          label: (context: any) => {
            const dataPoint = data[context.dataIndex]
            return dataPoint.traceIds.length > 0 
              ? `${title} (Traceable)` 
              : title
          }
        },
        backgroundColor: '#1f2937', // gray-800
        titleColor: '#f3f4f6', // gray-100
        bodyColor: '#d1d5db', // gray-300
        borderColor: '#374151', // gray-700
        borderWidth: 1,
        padding: 12,
        boxPadding: 4
      }
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index
        const dataPoint = data[dataIndex]
        if (dataPoint.traceIds.length > 0) {
          setSelectedTraceId(dataPoint.traceIds[0])
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          color: '#9ca3af' // text-gray-400
        },
        grid: {
          color: '#374151' // gray-700
        },
        ticks: {
          color: '#9ca3af' // text-gray-400
        }
      },
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          }
        },
        grid: {
          color: '#374151' // gray-700
        },
        ticks: {
          color: '#9ca3af' // text-gray-400
        }
      }
    }
  }

  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: title,
        data: data.map(d => ({ x: new Date(d.timestamp), y: d.value })),
        borderColor: color,
        backgroundColor: color,
        pointHoverRadius: 8,
        pointRadius: (context: any) => {
          const dataPoint = data[context.dataIndex]
          return dataPoint.traceIds.length > 0 ? 5 : 3
        },
        tension: 0.4,
        pointStyle: (context: any) => {
          const dataPoint = data[context.dataIndex]
          return dataPoint.traceIds.length > 0 ? 'rectRot' : 'circle'
        },
        pointHoverBackgroundColor: (context: any) => {
          const dataPoint = data[context.dataIndex]
          return dataPoint.traceIds.length > 0 ? '#f3f4f6' : color
        },
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 2
      }
    ]
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-400">{title}</div>
        {data.some(d => d.traceIds.length > 0) && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <CursorArrowRaysIcon className="h-4 w-4" />
            <span>Click points for trace details</span>
          </div>
        )}
      </div>
      <Line options={options} data={chartData} />
    </div>
  )
} 