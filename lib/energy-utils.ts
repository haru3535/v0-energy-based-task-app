import type { EnergyLevel, Task, HealthData } from "./types"

export function getEnergyLabel(level: EnergyLevel): string {
  switch (level) {
    case "high":
      return "絶好調"
    case "medium":
      return "そこそこ"
    case "low":
      return "ちょっと疲れ気味"
    case "very-low":
      return "今日はゆっくり"
  }
}

export function getEnergyEmoji(level: EnergyLevel): string {
  switch (level) {
    case "high":
      return "✨"
    case "medium":
      return "🌸"
    case "low":
      return "🌙"
    case "very-low":
      return "💤"
  }
}

export function getEnergyColor(level: EnergyLevel): string {
  switch (level) {
    case "high":
      return "text-pastel-mint"
    case "medium":
      return "text-pastel-lavender"
    case "low":
      return "text-pastel-coral"
    case "very-low":
      return "text-pastel-pink"
  }
}

export function getEnergyBgColor(level: EnergyLevel): string {
  switch (level) {
    case "high":
      return "bg-pastel-mint/30"
    case "medium":
      return "bg-pastel-lavender/30"
    case "low":
      return "bg-pastel-coral/30"
    case "very-low":
      return "bg-pastel-pink/30"
  }
}

export function getMaxEnergyLoad(level: EnergyLevel): number {
  switch (level) {
    case "high":
      return 4
    case "medium":
      return 3
    case "low":
      return 2
    case "very-low":
      return 1
  }
}

export function filterTasksByEnergy(tasks: Task[], energyLevel: EnergyLevel): Task[] {
  const maxLoad = getMaxEnergyLoad(energyLevel)
  return tasks.filter((task) => task.energyLoad <= maxLoad && !task.completed)
}

export function findIgnitionTask(tasks: Task[]): Task | undefined {
  const incompleteTasks = tasks.filter((t) => !t.completed)
  if (incompleteTasks.length === 0) return undefined

  return incompleteTasks.reduce((best, task) => {
    if (task.energyLoad < best.energyLoad) return task
    if (task.energyLoad === best.energyLoad && task.estimatedMinutes < best.estimatedMinutes) return task
    return best
  }, incompleteTasks[0])
}

export function calculateEnergyFromHealth(sleepHours: number, stressLevel: number): EnergyLevel {
  const sleepScore = Math.min(sleepHours / 8, 1) * 50
  const stressScore = (100 - stressLevel) * 0.5
  const totalScore = sleepScore + stressScore

  if (totalScore >= 80) return "high"
  if (totalScore >= 60) return "medium"
  if (totalScore >= 40) return "low"
  return "very-low"
}

// HRV (Heart Rate Variability) is measured in milliseconds (SDNN)
// Higher HRV = more relaxed, Lower HRV = more stressed
// Typical adult range: 20-200ms, average around 50-100ms
export function estimateStressFromHRV(hrvMs: number, age = 30): number {
  // Age-adjusted baseline HRV (decreases with age)
  const baselineHRV = 100 - (age - 20) * 0.5

  // Calculate stress level (0-100)
  // HRV below baseline = stressed, above = relaxed
  const ratio = hrvMs / baselineHRV

  if (ratio >= 1.5) return 10 // Very relaxed
  if (ratio >= 1.2) return 25 // Relaxed
  if (ratio >= 1.0) return 40 // Normal
  if (ratio >= 0.8) return 55 // Mild stress
  if (ratio >= 0.6) return 70 // Moderate stress
  if (ratio >= 0.4) return 85 // High stress
  return 95 // Very high stress
}

export function calculateEnergyFromHealthData(healthData: HealthData): {
  energyLevel: EnergyLevel
  stressLevel: number
  sleepQuality: "good" | "fair" | "poor"
} {
  const stressLevel = estimateStressFromHRV(healthData.hrvMs)
  const energyLevel = calculateEnergyFromHealth(healthData.sleepHours, stressLevel)

  // Determine sleep quality
  let sleepQuality: "good" | "fair" | "poor"
  if (healthData.sleepHours >= 7) {
    sleepQuality = "good"
  } else if (healthData.sleepHours >= 5.5) {
    sleepQuality = "fair"
  } else {
    sleepQuality = "poor"
  }

  return { energyLevel, stressLevel, sleepQuality }
}

export function generateSimulatedHealthData(): HealthData {
  // Simulate realistic values
  const sleepHours = 5 + Math.random() * 4 // 5-9 hours
  const hrvMs = 40 + Math.random() * 60 // 40-100ms
  const restingHeartRate = 55 + Math.random() * 20 // 55-75 bpm

  return {
    sleepHours: Math.round(sleepHours * 10) / 10,
    hrvMs: Math.round(hrvMs),
    restingHeartRate: Math.round(restingHeartRate),
    lastSyncedAt: new Date(),
  }
}
