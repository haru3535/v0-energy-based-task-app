"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { EnergyLevel } from "@/lib/types"
import { getEnergyLabel, getEnergyEmoji, getEnergyColor } from "@/lib/energy-utils"
import { cn } from "@/lib/utils"

interface EnergySelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentLevel: EnergyLevel
  onSelect: (level: EnergyLevel) => void
}

const levels: EnergyLevel[] = ["high", "medium", "low", "very-low"]

export function EnergySelector({ open, onOpenChange, currentLevel, onSelect }: EnergySelectorProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-0 pb-safe">
        {/* iOS-style drag handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-5 pb-4">
          <SheetTitle className="text-[17px] font-semibold text-center">今のエネルギーは？</SheetTitle>
        </SheetHeader>

        <div className="px-5 pb-8 space-y-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                onSelect(level)
                onOpenChange(false)
              }}
              className={cn(
                "w-full p-4 rounded-xl transition-all text-left haptic-tap",
                "flex items-center gap-4 ios-card",
                currentLevel === level ? "ring-2 ring-pastel-pink bg-pastel-pink/10" : "bg-card hover:bg-secondary",
              )}
            >
              <span className="text-3xl">{getEnergyEmoji(level)}</span>
              <div className="flex-1">
                <p className={cn("font-semibold text-[17px]", getEnergyColor(level))}>{getEnergyLabel(level)}</p>
                <p className="text-[13px] text-muted-foreground">
                  {level === "high" && "どんなタスクでもOK!"}
                  {level === "medium" && "普通のタスクならできそう"}
                  {level === "low" && "軽めのタスクだけにしよう"}
                  {level === "very-low" && "今日は最小限で"}
                </p>
              </div>
              {currentLevel === level && (
                <div className="w-6 h-6 rounded-full bg-pastel-pink flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
