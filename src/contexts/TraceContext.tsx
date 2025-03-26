'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Trace } from '@/mocks/traces.mock'

interface TraceContextType {
  selectedTraceId: string | null
  setSelectedTraceId: (id: string | null) => void
  selectedTrace: Trace | null
  setSelectedTrace: (trace: Trace | null) => void
}

const TraceContext = createContext<TraceContextType | undefined>(undefined)

export function TraceProvider({ children }: { children: ReactNode }) {
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null)
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null)

  return (
    <TraceContext.Provider value={{
      selectedTraceId,
      setSelectedTraceId,
      selectedTrace,
      setSelectedTrace
    }}>
      {children}
    </TraceContext.Provider>
  )
}

export function useTrace() {
  const context = useContext(TraceContext)
  if (context === undefined) {
    throw new Error('useTrace must be used within a TraceProvider')
  }
  return context
} 