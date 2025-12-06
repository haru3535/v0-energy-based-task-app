"use client"

import type { EnergyData } from "@/lib/types"
import { Moon, Activity, Heart, TrendingUp, TrendingDown } from "lucide-react"

interface StatsViewProps {
  energyHistory: EnergyData[]
}

export function StatsView({ energyHistory }: StatsViewProps) {
  const avgSleep =
    energyHistory.length > 0
      ? (energyHistory.reduce((sum, d) => sum + d.sleepHours, 0) / energyHistory.length).toFixed(1)
      : "0"

  const avgStress =
    energyHistory.length > 0
      ? Math.round(energyHistory.reduce((sum, d) => sum + d.stressLevel, 0) / energyHistory.length)
      : 0

  const hrvData = energyHistory.filter((d) => d.hrvMs !== undefined)
  const avgHRV =
    hrvData.length > 0 ? Math.round(hrvData.reduce((sum, d) => sum + (d.hrvMs || 0), 0) / hrvData.length) : null

  const recentHRV = hrvData.slice(-3)
  const olderHRV = hrvData.slice(-6, -3)
  const hrvTrend =
    recentHRV.length > 0 && olderHRV.length > 0
      ? recentHRV.reduce((sum, d) => sum + (d.hrvMs || 0), 0) / recentHRV.length -
        olderHRV.reduce((sum, d) => sum + (d.hrvMs || 0), 0) / olderHRV.length
      : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ios-card-elevated bg-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-lavender/30 flex items-center justify-center">
              <Moon className="w-4 h-4 text-pastel-lavender" />
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground">平均睡眠</p>
          <p className="text-[28px] font-bold text-pastel-lavender">
            {avgSleep}
            <span className="text-[17px]">時間</span>
          </p>
        </div>

        <div className="ios-card-elevated bg-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-coral/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-pastel-coral" />
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground">平均ストレス</p>
          <p className="text-[28px] font-bold text-pastel-coral">
            {avgStress}
            <span className="text-[17px]">%</span>
          </p>
        </div>
      </div>

      {avgHRV !== null && (
        <div className="ios-card-elevated bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pastel-mint/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pastel-mint" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">平均HRV</p>
                <p className="text-[24px] font-bold text-pastel-mint">
                  {avgHRV}
                  <span className="text-[15px]">ms</span>
                </p>
              </div>
            </div>
            {hrvTrend !== 0 && (
              <div className={`flex items-center gap-1 ${hrvTrend > 0 ? "text-pastel-mint" : "text-pastel-coral"}`}>
                {hrvTrend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-[13px] font-medium">
                  {hrvTrend > 0 ? "+" : ""}
                  {Math.round(hrvTrend)}ms
                </span>
              </div>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground mt-2">HRVが高いほどリラックス状態です</p>
        </div>
      )}

      {/* Weekly Chart */}
      <div className="space-y-2">
        <h3 className="text-[13px] text-muted-foreground uppercase tracking-wide px-4">過去7日間の睡眠</h3>
        <div className="ios-card bg-card rounded-2xl p-4">
          <div className="space-y-3">
            {energyHistory.slice(-7).map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-[13px] text-muted-foreground w-8">
                  {new Date(data.date).toLocaleDateString("ja-JP", { weekday: "short" })}
                </span>
                <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pastel-lavender to-pastel-pink rounded-full transition-all duration-500"
                    style={{ width: `${(data.sleepHours / 10) * 100}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium text-foreground w-12 text-right">{data.sleepHours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hrvData.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[13px] text-muted-foreground uppercase tracking-wide px-4">HRV推移</h3>
          <div className="ios-card bg-card rounded-2xl p-4">
            <div className="space-y-3">
              {energyHistory.slice(-7).map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[13px] text-muted-foreground w-8">
                    {new Date(data.date).toLocaleDateString("ja-JP", { weekday: "short" })}
                  </span>
                  <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pastel-mint to-pastel-lavender rounded-full transition-all duration-500"
                      style={{ width: `${((data.hrvMs || 50) / 150) * 100}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-foreground w-14 text-right">{data.hrvMs || "-"}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insight */}
      <div className="ios-card bg-pastel-pink/10 rounded-2xl p-4">
        <p className="text-[15px] text-foreground text-center leading-relaxed">
          「今日は寝不足だからエネルギーが低いんだな」と納得できれば、自分を責めなくて済みます
        </p>
      </div>
    </div>
  )
}
