"use client"

import { useState, useEffect } from "react"
import type { WeatherData } from "@/lib/types"
import {
  fetchOsakaWeather,
  getWeatherDescription,
  getWeatherEmoji,
  analyzePressureImpact,
  getPressureColor,
  getPressureBgColor,
} from "@/lib/weather-utils"
import { Gauge, RefreshCw, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeatherDisplayProps {
  onPressureChange?: (pressure: number) => void
}

export function WeatherDisplay({ onPressureChange }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOsakaWeather()
      setWeather(data)
      onPressureChange?.(data.pressure)
    } catch (e) {
      setError("天気データを取得できませんでした")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !weather) {
    return (
      <div className="ios-card bg-card p-4 rounded-2xl">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-[13px]">天気情報を取得中...</span>
        </div>
      </div>
    )
  }

  if (error && !weather) {
    return (
      <button
        onClick={fetchWeather}
        className="ios-card bg-card p-4 rounded-2xl w-full text-center haptic-tap active:scale-[0.98]"
      >
        <p className="text-[13px] text-muted-foreground">{error}</p>
        <p className="text-[11px] text-pastel-coral mt-1">タップして再試行</p>
      </button>
    )
  }

  if (!weather) return null

  const pressureInfo = analyzePressureImpact(weather.pressure)

  return (
    <div className="ios-card bg-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-pastel-coral" />
          <span className="text-[13px] font-medium">大阪市</span>
        </div>
        <button onClick={fetchWeather} disabled={loading} className="p-1.5 rounded-full hover:bg-muted/50 haptic-tap">
          <RefreshCw className={cn("w-4 h-4 text-muted-foreground", loading && "animate-spin")} />
        </button>
      </div>

      {/* Weather Content */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Temperature & Weather */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[32px]">{getWeatherEmoji(weather.weatherCode)}</span>
              <div>
                <p className="text-[24px] font-bold">{weather.temperature.toFixed(1)}°</p>
                <p className="text-[13px] text-muted-foreground">{getWeatherDescription(weather.weatherCode)}</p>
              </div>
            </div>
          </div>

          {/* Pressure Card */}
          <div className={cn("px-3 py-2 rounded-xl", getPressureBgColor(pressureInfo.impact))}>
            <div className="flex items-center gap-1.5">
              <Gauge className={cn("w-4 h-4", getPressureColor(pressureInfo.impact))} />
              <span className={cn("text-[15px] font-semibold", getPressureColor(pressureInfo.impact))}>
                {weather.pressure.toFixed(0)}
              </span>
              <span className="text-[11px] text-muted-foreground">hPa</span>
            </div>
          </div>
        </div>

        {/* Pressure Impact Message */}
        <div className={cn("mt-3 px-3 py-2 rounded-xl", getPressureBgColor(pressureInfo.impact))}>
          <p className={cn("text-[12px] font-medium", getPressureColor(pressureInfo.impact))}>
            {pressureInfo.impact === "warning" && "⚠️ "}
            {pressureInfo.impact === "caution" && "💡 "}
            {pressureInfo.impact === "good" && "✨ "}
            {pressureInfo.message}
          </p>
        </div>

        {/* Last Updated */}
        <p className="text-[10px] text-muted-foreground text-right mt-2">
          更新: {weather.lastUpdated.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
