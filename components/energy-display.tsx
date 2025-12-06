"use client"

import type { EnergyLevel, HealthData } from "@/lib/types"
import { getEnergyLabel, getEnergyEmoji, getEnergyColor } from "@/lib/energy-utils"
import { Battery, BatteryLow, BatteryMedium, BatteryFull, ChevronRight, Watch } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyDisplayProps {
  level: EnergyLevel
  onTap?: () => void
  lastHealthSync?: HealthData | null
  onHealthSyncTap?: () => void
}

function EnergyBatteryIcon({ level }: { level: EnergyLevel }) {
  const iconClass = cn("w-7 h-7", getEnergyColor(level))

  switch (level) {
    case "high":
      return <BatteryFull className={iconClass} />
    case "medium":
      return <BatteryMedium className={iconClass} />
    case "low":
      return <BatteryLow className={iconClass} />
    case "very-low":
      return <Battery className={iconClass} />
  }
}

export function EnergyDisplay({ level, onTap, lastHealthSync, onHealthSyncTap }: EnergyDisplayProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onTap}
        className={cn(
          "w-full p-4 rounded-2xl transition-all duration-200 haptic-tap",
          "ios-card-elevated bg-card",
          "active:scale-[0.98]",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              level === "high" && "bg-pastel-mint/40",
              level === "medium" && "bg-pastel-lavender/40",
              level === "low" && "bg-pastel-coral/40",
              level === "very-low" && "bg-pastel-pink/40",
            )}
          >
            <EnergyBatteryIcon level={level} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] text-muted-foreground">現在のエネルギー</p>
            <p className={cn("text-[20px] font-bold", getEnergyColor(level))}>
              {getEnergyEmoji(level)} {getEnergyLabel(level)}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>

      <button
        onClick={onHealthSyncTap}
        className={cn(
          "w-full p-3 rounded-xl transition-all duration-200 haptic-tap",
          "ios-card bg-card border border-border/50",
          "active:scale-[0.98]",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pastel-coral/20 flex items-center justify-center">
            <Watch className="w-5 h-5 text-pastel-coral" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-medium">Apple Watchから同期</p>
            {lastHealthSync ? (
              <p className="text-[11px] text-muted-foreground">
                最終同期:{" "}
                {lastHealthSync.lastSyncedAt.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} (睡眠{" "}
                {lastHealthSync.sleepHours}h / HRV {lastHealthSync.hrvMs}ms)
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">睡眠とHRVからエネルギーを自動計算</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>
    </div>
  )
}
