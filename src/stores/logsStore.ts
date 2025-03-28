import { create } from 'zustand'
import { mockLogs } from '@/mocks/logs.mock' // We'll use the existing mock data

interface LogsStore {
  logs: typeof mockLogs
}

export const useLogsStore = create<LogsStore>(() => ({
  logs: mockLogs,
})) 