'use client'

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
import 'chartjs-adapter-date-fns'
import { Line } from 'react-chartjs-2'

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

interface HealthGraphProps {
  data: Array<{
    timestamp: string
    value: number
  }>
  title: string
  color: string
}

export default function ServiceHealthGraph({ 
  data = [], // Provide default empty array
  title, 
  color 
}: HealthGraphProps) {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-32 flex items-center justify-center">
        <p className="text-gray-400">No health data available</p>
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
          display: false
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
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  }

  return (
    <div className="h-32">
      <Line options={options} data={chartData} />
    </div>
  )
} 