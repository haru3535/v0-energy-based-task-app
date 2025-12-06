export type EnergyLevel = "high" | "medium" | "low" | "very-low"

export interface Task {
  id: string
  title: string
  deadline?: Date
  energyLoad: 1 | 2 | 3 | 4
  estimatedMinutes: number
  steps: TaskStep[]
  completed: boolean
  isIgnitionTask?: boolean
}

export interface TaskStep {
  id: string
  title: string
  completed: boolean
}

export interface EnergyData {
  date: Date
  sleepHours: number
  stressLevel: number
  energyLevel: EnergyLevel
  hrvMs?: number // Heart Rate Variability in milliseconds
}

export interface HealthData {
  sleepHours: number
  hrvMs: number // HRV in milliseconds (SDNN)
  restingHeartRate?: number
  lastSyncedAt: Date
}

export interface AppSettings {
  autoTaskGranularity: boolean
  autoPriorityAdjustment: boolean
  healthSyncEnabled: boolean
  manualHealthInput: boolean
}
