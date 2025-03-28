'use client'

import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

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

export default function MetricsGraph({ 
  data = [],
  title, 
  yAxisLabel, 
  color 
}: MetricsGraphProps) {
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
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <Line options={options} data={chartData} />
    </div>
  )
} 