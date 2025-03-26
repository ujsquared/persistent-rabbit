'use client'

import ReactFlow, { 
  Node, 
  Edge,
  Background,
  Controls,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'

const nodes: Node[] = [
  {
    id: 'alb',
    type: 'default',
    data: { label: 'ALB' },
    position: { x: 0, y: 100 },
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #374151',
      width: 150,
    }
  },
  {
    id: 'kong',
    type: 'default',
    data: { label: 'Kong' },
    position: { x: 200, y: 100 },
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #374151',
      width: 150,
    }
  },
  {
    id: 'heracles',
    type: 'default',
    data: { label: 'Heracles API' },
    position: { x: 400, y: 100 },
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #374151',
      width: 150,
    }
  },
  {
    id: 'postgres',
    type: 'default',
    data: { label: 'PostgreSQL' },
    position: { x: 600, y: 50 },
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #374151',
      width: 150,
    }
  },
  {
    id: 'redis',
    type: 'default',
    data: { label: 'Redis' },
    position: { x: 600, y: 150 },
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #374151',
      width: 150,
    }
  }
]

const edges: Edge[] = [
  {
    id: 'alb-kong',
    source: 'alb',
    target: 'kong',
    label: '45ms',
    labelStyle: { fill: '#9ca3af' },
    style: { stroke: '#4b5563' },
    markerEnd: { type: MarkerType.Arrow, color: '#4b5563' }
  },
  {
    id: 'kong-heracles',
    source: 'kong',
    target: 'heracles',
    label: '95ms',
    labelStyle: { fill: '#9ca3af' },
    style: { stroke: '#4b5563' },
    markerEnd: { type: MarkerType.Arrow, color: '#4b5563' }
  },
  {
    id: 'heracles-postgres',
    source: 'heracles',
    target: 'postgres',
    label: '65ms',
    labelStyle: { fill: '#9ca3af' },
    style: { stroke: '#4b5563' },
    markerEnd: { type: MarkerType.Arrow, color: '#4b5563' }
  },
  {
    id: 'heracles-redis',
    source: 'heracles',
    target: 'redis',
    label: '15ms',
    labelStyle: { fill: '#9ca3af' },
    style: { stroke: '#4b5563' },
    markerEnd: { type: MarkerType.Arrow, color: '#4b5563' }
  }
]

export default function ServiceMap() {
  return (
    <div className="h-[400px] bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        defaultEdgeOptions={{
          style: { stroke: '#4b5563' },
          labelStyle: { fill: '#9ca3af' }
        }}
      >
        <Background color="#4b5563" gap={16} />
        <Controls className="bg-gray-800 border-gray-700 text-gray-400" />
      </ReactFlow>
    </div>
  )
} 