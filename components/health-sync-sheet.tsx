"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Watch, Moon, Activity, Heart, RefreshCw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HealthData, EnergyLevel } from "@/lib/types"
import {
  generateSimulatedHealthData,
  calculateEnergyFromHealthData,
  getEnergyLabel,
  getEnergyEmoji,
  getEnergyColor,
} from "@/lib/energy-utils"

interface HealthSyncSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSyncComplete: (healthData: HealthData, energyLevel: EnergyLevel, stressLevel: number) => void
}

export function HealthSyncSheet({ open, onOpenChange, onSyncComplete }: HealthSyncSheetProps) {
  const [mode, setMode] = useState<"auto" | "manual">("auto")
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncedData, setSyncedData] = useState<HealthData | null>(null)
  const [calculatedResult, setCalculatedResult] = useState<{
    energyLevel: EnergyLevel
    stressLevel: number
    sleepQuality: "good" | "fair" | "poor"
  } | null>(null)

  // Manual input state
  const [manualSleep, setManualSleep] = useState(7)
  const [manualHRV, setManualHRV] = useState(60)

  const handleSimulateSync = async () => {
    setIsSyncing(true)

    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const healthData = generateSimulatedHealthData()
    const result = calculateEnergyFromHealthData(healthData)

    setSyncedData(healthData)
    setCalculatedResult(result)
    setIsSyncing(false)
  }

  const handleManualCalculate = () => {
    const healthData: HealthData = {
      sleepHours: manualSleep,
      hrvMs: manualHRV,
      lastSyncedAt: new Date(),
    }

    const result = calculateEnergyFromHealthData(healthData)
    setSyncedData(healthData)
    setCalculatedResult(result)
  }

  const handleApply = () => {
    if (syncedData && calculatedResult) {
      onSyncComplete(syncedData, calculatedResult.energyLevel, calculatedResult.stressLevel)
      onOpenChange(false)
    }
  }

  // Reset state when sheet opens
  useEffect(() => {
    if (open) {
      setSyncedData(null)
      setCalculatedResult(null)
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[20px] h-[85dvh]">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center justify-center gap-2 text-[17px]">
            <Watch className="w-5 h-5 text-pastel-coral" />
            ヘルスデータ同期
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6 overflow-y-auto">
          {/* Mode Selector */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl">
            <button
              onClick={() => setMode("auto")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-[15px] font-medium transition-all",
                mode === "auto" ? "bg-card shadow-sm" : "text-muted-foreground",
              )}
            >
              Apple Watch同期
            </button>
            <button
              onClick={() => setMode("manual")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-[15px] font-medium transition-all",
                mode === "manual" ? "bg-card shadow-sm" : "text-muted-foreground",
              )}
            >
              手動入力
            </button>
          </div>

          {mode === "auto" ? (
            <div className="space-y-6">
              {/* Sync Info */}
              <div className="ios-card bg-pastel-lavender/10 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pastel-lavender/30 flex items-center justify-center flex-shrink-0">
                    <Watch className="w-5 h-5 text-pastel-lavender" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium">Apple Watchから取得</p>
                    <p className="text-[13px] text-muted-foreground mt-1">
                      睡眠時間とHRV（心拍変動）からエネルギーレベルを自動計算します
                    </p>
                  </div>
                </div>
              </div>

              {/* Sync Button */}
              <Button
                onClick={handleSimulateSync}
                disabled={isSyncing}
                className="w-full h-14 rounded-2xl bg-pastel-coral text-white text-[17px] font-semibold"
              >
                {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Watch className="w-5 h-5 mr-2" />}
                {isSyncing ? "同期中..." : "データを同期"}
              </Button>

              <p className="text-[12px] text-muted-foreground text-center">
                ※ デモ用のシミュレーションデータを使用しています
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sleep Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-pastel-lavender" />
                  <span className="text-[15px] font-medium">睡眠時間</span>
                  <span className="ml-auto text-[17px] font-bold text-pastel-lavender">{manualSleep}時間</span>
                </div>
                <Slider
                  value={[manualSleep]}
                  onValueChange={([v]) => setManualSleep(v)}
                  min={3}
                  max={12}
                  step={0.5}
                  className="py-2"
                />
                <div className="flex justify-between text-[12px] text-muted-foreground">
                  <span>3時間</span>
                  <span>12時間</span>
                </div>
              </div>

              {/* HRV Input */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pastel-coral" />
                  <span className="text-[15px] font-medium">HRV（心拍変動）</span>
                  <span className="ml-auto text-[17px] font-bold text-pastel-coral">{manualHRV}ms</span>
                </div>
                <Slider
                  value={[manualHRV]}
                  onValueChange={([v]) => setManualHRV(v)}
                  min={20}
                  max={150}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-[12px] text-muted-foreground">
                  <span>20ms (高ストレス)</span>
                  <span>150ms (リラックス)</span>
                </div>
              </div>

              {/* HRV Explanation */}
              <div className="ios-card bg-secondary/50 rounded-2xl p-4">
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  <strong>HRVとは？</strong>
                  <br />
                  心拍の間隔のばらつきを示す指標です。Apple Watchの「心拍変動」で確認できます。
                  高いほどリラックス状態、低いほどストレス状態を示します。
                </p>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={handleManualCalculate}
                className="w-full h-14 rounded-2xl bg-pastel-coral text-white text-[17px] font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                エネルギーを計算
              </Button>
            </div>
          )}

          {/* Results */}
          {syncedData && calculatedResult && (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="text-[13px] text-muted-foreground uppercase tracking-wide">計算結果</h3>

              {/* Health Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="ios-card bg-card rounded-2xl p-3 text-center">
                  <Moon className="w-5 h-5 text-pastel-lavender mx-auto mb-1" />
                  <p className="text-[20px] font-bold">{syncedData.sleepHours}</p>
                  <p className="text-[11px] text-muted-foreground">睡眠(時間)</p>
                </div>
                <div className="ios-card bg-card rounded-2xl p-3 text-center">
                  <Heart className="w-5 h-5 text-pastel-coral mx-auto mb-1" />
                  <p className="text-[20px] font-bold">{syncedData.hrvMs}</p>
                  <p className="text-[11px] text-muted-foreground">HRV(ms)</p>
                </div>
                <div className="ios-card bg-card rounded-2xl p-3 text-center">
                  <Activity className="w-5 h-5 text-pastel-peach mx-auto mb-1" />
                  <p className="text-[20px] font-bold">{calculatedResult.stressLevel}</p>
                  <p className="text-[11px] text-muted-foreground">ストレス%</p>
                </div>
              </div>

              {/* Energy Level Result */}
              <div
                className={cn(
                  "ios-card rounded-2xl p-5 text-center",
                  calculatedResult.energyLevel === "high" && "bg-pastel-mint/20",
                  calculatedResult.energyLevel === "medium" && "bg-pastel-lavender/20",
                  calculatedResult.energyLevel === "low" && "bg-pastel-coral/20",
                  calculatedResult.energyLevel === "very-low" && "bg-pastel-pink/20",
                )}
              >
                <p className="text-[13px] text-muted-foreground mb-2">推定エネルギーレベル</p>
                <p className={cn("text-[28px] font-bold", getEnergyColor(calculatedResult.energyLevel))}>
                  {getEnergyEmoji(calculatedResult.energyLevel)} {getEnergyLabel(calculatedResult.energyLevel)}
                </p>
                <p className="text-[13px] text-muted-foreground mt-2">
                  睡眠:{" "}
                  {calculatedResult.sleepQuality === "good"
                    ? "十分"
                    : calculatedResult.sleepQuality === "fair"
                      ? "やや不足"
                      : "不足"}
                </p>
              </div>

              {/* Apply Button */}
              <Button
                onClick={handleApply}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-coral text-white text-[17px] font-semibold"
              >
                このレベルを適用する
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
