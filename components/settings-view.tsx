"use client"

import type { AppSettings, HealthData } from "@/lib/types"
import { Switch } from "@/components/ui/switch"
import { Sparkles, Watch, Moon, Heart, ChevronRight } from "lucide-react"

interface SettingsViewProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  lastHealthSync: HealthData | null
  onHealthSyncTap: () => void
}

export function SettingsView({ settings, onSettingsChange, lastHealthSync, onHealthSyncTap }: SettingsViewProps) {
  const formatSyncTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "たった今"
    if (minutes < 60) return `${minutes}分前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}時間前`
    return `${Math.floor(hours / 24)}日前`
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-4">
          <Watch className="w-4 h-4 text-pastel-coral" />
          <h3 className="text-[13px] text-muted-foreground uppercase tracking-wide">Apple Watch連携</h3>
        </div>

        <div className="ios-card bg-card rounded-2xl overflow-hidden">
          {/* Sync Status Card */}
          <button
            onClick={onHealthSyncTap}
            className="w-full p-4 text-left haptic-tap active:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pastel-coral to-pastel-pink flex items-center justify-center flex-shrink-0">
                <Watch className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-medium text-foreground">ヘルスデータを同期</p>
                {lastHealthSync ? (
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    最終同期: {formatSyncTime(lastHealthSync.lastSyncedAt)}
                  </p>
                ) : (
                  <p className="text-[13px] text-pastel-coral mt-0.5">タップして同期を開始</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </button>

          {/* Last Synced Data Display */}
          {lastHealthSync && (
            <div className="border-t border-border/50 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-pastel-lavender/10">
                  <Moon className="w-5 h-5 text-pastel-lavender" />
                  <div>
                    <p className="text-[13px] text-muted-foreground">睡眠</p>
                    <p className="text-[17px] font-semibold">{lastHealthSync.sleepHours}時間</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-pastel-coral/10">
                  <Heart className="w-5 h-5 text-pastel-coral" />
                  <div>
                    <p className="text-[13px] text-muted-foreground">HRV</p>
                    <p className="text-[17px] font-semibold">{lastHealthSync.hrvMs}ms</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Health Data Explanation */}
        <div className="px-4">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Apple Watchの睡眠分析とHRV（心拍変動）データから、あなたの今のエネルギーレベルを自動で推定します。
          </p>
        </div>
      </div>

      {/* Auto Adjustment Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-4">
          <Sparkles className="w-4 h-4 text-pastel-peach" />
          <h3 className="text-[13px] text-muted-foreground uppercase tracking-wide">自動調整機能</h3>
        </div>
        <div className="ios-card bg-card rounded-2xl overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1 pr-4">
              <p className="text-[17px] text-foreground">タスクの自動粒度調節</p>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                エネルギーが低い時、タスクを自動的に小さなステップで表示
              </p>
            </div>
            <Switch
              checked={settings.autoTaskGranularity}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, autoTaskGranularity: checked })}
              className="data-[state=checked]:bg-pastel-pink"
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex-1 pr-4">
              <p className="text-[17px] text-foreground">優先度の自動調整</p>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                ストレスが高い時、急がないタスクは「後回しOK」に
              </p>
            </div>
            <Switch
              checked={settings.autoPriorityAdjustment}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, autoPriorityAdjustment: checked })}
              className="data-[state=checked]:bg-pastel-pink"
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex-1 pr-4">
              <p className="text-[17px] text-foreground">自動同期</p>
              <p className="text-[13px] text-muted-foreground mt-0.5">アプリ起動時にヘルスデータを自動取得</p>
            </div>
            <Switch
              checked={settings.healthSyncEnabled}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, healthSyncEnabled: checked })}
              className="data-[state=checked]:bg-pastel-pink"
            />
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="space-y-2">
        <h3 className="text-[13px] text-muted-foreground uppercase tracking-wide px-4">アプリ情報</h3>
        <div className="ios-card bg-card rounded-2xl overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <span className="text-[17px] text-foreground">バージョン</span>
            <span className="text-[17px] text-muted-foreground">1.0.0</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-[17px] text-foreground">ビルド</span>
            <span className="text-[17px] text-muted-foreground">2024.12</span>
          </div>
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="ios-card bg-pastel-mint/10 rounded-2xl p-4 mx-0">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-pastel-mint animate-pulse mt-1.5" />
          <div>
            <p className="text-[15px] font-medium text-foreground">デモモードで動作中</p>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
              実際のiOSアプリでは、HealthKitと連携して睡眠データやHRVを自動取得します。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
