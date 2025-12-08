import type { WeatherData, PressureImpact } from "./types"

// Osaka coordinates
const OSAKA_LAT = 34.6937
const OSAKA_LON = 135.5023

export async function fetchOsakaWeather(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${OSAKA_LAT}&longitude=${OSAKA_LON}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure&timezone=Asia%2FTokyo`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data = await res.json()

  return {
    temperature: data.current.temperature_2m,
    pressure: data.current.surface_pressure,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    lastUpdated: new Date(),
  }
}

// Get weather description from WMO code
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "快晴",
    1: "晴れ",
    2: "一部曇り",
    3: "曇り",
    45: "霧",
    48: "霧氷",
    51: "小雨",
    53: "雨",
    55: "強い雨",
    61: "小雨",
    63: "雨",
    65: "大雨",
    71: "小雪",
    73: "雪",
    75: "大雪",
    80: "にわか雨",
    81: "にわか雨",
    82: "激しいにわか雨",
    95: "雷雨",
    96: "雹を伴う雷雨",
    99: "激しい雷雨",
  }
  return descriptions[code] || "不明"
}

// Get weather emoji from WMO code
export function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️"
  if (code <= 2) return "🌤️"
  if (code === 3) return "☁️"
  if (code <= 48) return "🌫️"
  if (code <= 55) return "🌧️"
  if (code <= 65) return "🌧️"
  if (code <= 75) return "🌨️"
  if (code <= 82) return "🌦️"
  if (code >= 95) return "⛈️"
  return "🌡️"
}

// Analyze pressure impact on body/energy
export function analyzePressureImpact(pressure: number): {
  impact: PressureImpact
  message: string
  energyModifier: number // -1 to +1
} {
  // Standard atmospheric pressure is ~1013 hPa
  // Low pressure (<1000) often causes fatigue, headaches
  // High pressure (>1020) generally feels good

  if (pressure >= 1020) {
    return {
      impact: "good",
      message: "高気圧で体調良好",
      energyModifier: 0.1,
    }
  } else if (pressure >= 1010) {
    return {
      impact: "neutral",
      message: "気圧は安定",
      energyModifier: 0,
    }
  } else if (pressure >= 1000) {
    return {
      impact: "caution",
      message: "やや低気圧、疲れやすいかも",
      energyModifier: -0.1,
    }
  } else {
    return {
      impact: "warning",
      message: "低気圧注意、無理は禁物",
      energyModifier: -0.2,
    }
  }
}

// Get pressure impact color
export function getPressureColor(impact: PressureImpact): string {
  switch (impact) {
    case "good":
      return "text-pastel-mint"
    case "neutral":
      return "text-pastel-lavender"
    case "caution":
      return "text-pastel-peach"
    case "warning":
      return "text-pastel-coral"
  }
}

export function getPressureBgColor(impact: PressureImpact): string {
  switch (impact) {
    case "good":
      return "bg-pastel-mint/20"
    case "neutral":
      return "bg-pastel-lavender/20"
    case "caution":
      return "bg-pastel-peach/20"
    case "warning":
      return "bg-pastel-coral/20"
  }
}
