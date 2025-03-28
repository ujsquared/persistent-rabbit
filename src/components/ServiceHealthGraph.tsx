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
import type { ChartData, ChartOptions } from 'chart.js'

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

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          color: '#64748b'
        }
      },
      x: {
        type: 'time' as const,
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
          color: '#64748b'
        }
      }
    }
  }

  const chartData: ChartData<'line'> = {
    datasets: data.map((point) => ({
      label: title,
      data: [{
        x: new Date(point.timestamp).getTime(), // Convert to timestamp number
        y: point.value
      }],
      borderColor: color,
      backgroundColor: color,
      pointRadius: 0,
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }))
  }

  return (
    <div className="h-32">
      <Line options={options} data={chartData} />
    </div>
  )
} 