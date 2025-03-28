import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

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
          // Your tooltip logic here
          if(!tooltipItems.length){
            return ''
          }
          return ''
        },
        label: function(context: TooltipItem<'line'>) {
          const label = context.dataset.label || ''
          return `${label}: ${context.formattedValue}`
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
      type: 'time',
      time: {
        unit: 'minute'
      }
    },
    y: {
      beginAtZero: true
    }
  }
}

const chartData: ChartData<'line'> = {
  datasets: [
    {
      label: 'Metrics',
      data: [], // Your data here in format { x: Date, y: number }[]
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
}

export default function MetricsChart() {
  return (
    <div>
      <Line options={options} data={chartData} />
    </div>
  )
} 