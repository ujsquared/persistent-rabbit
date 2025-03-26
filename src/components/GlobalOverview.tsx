'use client'

import { ServiceMetrics } from '@/mocks/metrics.mock'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Line } from 'react-chartjs-2'
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

// Fixed reference date: March 26, 2025
const REFERENCE_DATE = new Date('2025-03-26T00:00:00Z')

// Create static data points for overview graphs
const createOverviewData = (values: number[]) => {
  const getHourTimestamp = (hoursAgo: number) => {
    const date = new Date(REFERENCE_DATE)
    date.setHours(date.getHours() - hoursAgo, 0, 0, 0)
    return date.toISOString()
  }

  return [
    { timestamp: getHourTimestamp(18), value: values[0] },
    { timestamp: getHourTimestamp(12), value: values[1] },
    { timestamp: getHourTimestamp(6), value: values[2] },
    { timestamp: getHourTimestamp(0), value: values[3] }
  ]
}

// Static overview data
const overviewData = {
  systemHealth: createOverviewData([98, 92, 95, 97]),
  errorRate: createOverviewData([0.5, 2.5, 1.2, 0.8]),
  latency: createOverviewData([120, 180, 150, 130]),
  throughput: createOverviewData([1000, 1500, 1200, 1100])
}

interface OverviewCardProps {
  title: string
  value: string
  data: Array<{ timestamp: string; value: number }>
  color: string
  valueSuffix?: string
}

function OverviewCard({ title, value, data = [], color, valueSuffix = '' }: OverviewCardProps) {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">No data</div>
        </CardContent>
      </Card>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        display: false,
        beginAtZero: true
      },
      x: {
        display: false,
        type: 'time' as const,
        time: {
          unit: 'hour' as const
        }
      }
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0.4
      }
    }
  }

  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        data: data.map(d => ({ x: new Date(d.timestamp), y: d.value })),
        borderColor: color,
        backgroundColor: color,
        fill: true,
        borderWidth: 2
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {valueSuffix}
        </div>
        <div className="h-16">
          <Line options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function GlobalOverview({ services = [] }: { services?: ServiceMetrics[] }) {
  // Calculate current values from services data
  const systemHealth = services.length > 0 
    ? Math.round(services.filter(s => s.status === 'healthy').length / services.length * 100)
    : 97 // Default value

  const avgErrorRate = services.length > 0
    ? (services.reduce((acc, s) => acc + s.errorRate, 0) / services.length).toFixed(2)
    : '0.8' // Default value

  const avgLatency = services.length > 0
    ? Math.round(services.reduce((acc, s) => acc + s.latencyP95, 0) / services.length)
    : 130 // Default value

  const totalRequests = '1.2k' // Static value for now

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="System Health"
        value={systemHealth.toString()}
        valueSuffix="%"
        data={overviewData.systemHealth}
        color="#22c55e"
      />
      <OverviewCard
        title="Error Rate"
        value={avgErrorRate}
        valueSuffix="%"
        data={overviewData.errorRate}
        color="#ef4444"
      />
      <OverviewCard
        title="Avg. Latency"
        value={avgLatency.toString()}
        valueSuffix="ms"
        data={overviewData.latency}
        color="#3b82f6"
      />
      <OverviewCard
        title="Throughput"
        value={totalRequests}
        valueSuffix="/s"
        data={overviewData.throughput}
        color="#a855f7"
      />
    </div>
  )
} 