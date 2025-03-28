'use client'

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  ConnectionMode,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface Log {
  id: string
  timestamp: string
  component: string
  message: string
  traceId: string
  level: string
}

interface TraceGraphProps {
  logs: Log[]
}

export default function TraceGraph({ logs }: TraceGraphProps) {
  // Create nodes from the components in the trace
  const nodes: Node[] = logs.map((log, index) => ({
    id: log.component,
    position: { x: 200 * index, y: 200 },
    data: { 
      label: log.component,
      status: log.level,
    },
    style: {
      background: log.level === 'ERROR' ? '#fee2e2' : '#f0fdf4',
      border: '1px solid',
      borderColor: log.level === 'ERROR' ? '#dc2626' : '#22c55e',
      borderRadius: '8px',
      padding: '10px',
      width: 150,
    },
  }))

  // Create edges between nodes
  const edges: Edge[] = logs.slice(1).map((log, index) => ({
    id: `edge-${index}`,
    source: logs[index].component,
    target: log.component,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#94a3b8' },
  }))

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      connectionMode={ConnectionMode.Loose}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
} 