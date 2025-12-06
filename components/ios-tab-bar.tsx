"use client"

import { Home, BarChart3, Settings, Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "home" | "stats" | "settings"

interface IOSTabBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onAddTask: () => void
  onOpenCompiler: () => void
  showAddButton: boolean
}

export function IOSTabBar({ activeTab, onTabChange, onAddTask, onOpenCompiler, showAddButton }: IOSTabBarProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "ホーム" },
    { id: "stats" as const, icon: BarChart3, label: "データ" },
    { id: "settings" as const, icon: Settings, label: "設定" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-tab-bar border-t border-border/50 pb-safe z-50">
      <div className="relative flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1 px-6 transition-all haptic-tap",
              activeTab === tab.id ? "text-pastel-pink" : "text-muted-foreground",
            )}
          >
            <tab.icon
              className={cn("w-6 h-6 transition-transform", activeTab === tab.id && "scale-105")}
              strokeWidth={activeTab === tab.id ? 2.5 : 1.5}
            />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}

        {showAddButton && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={onOpenCompiler}
              className="w-12 h-12 rounded-full bg-pastel-lavender flex items-center justify-center glow-lavender haptic-tap transition-transform active:scale-95"
              title="Compiler"
            >
              <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
            <button
              onClick={onAddTask}
              className="w-14 h-14 rounded-full bg-pastel-pink flex items-center justify-center glow-pink haptic-tap transition-transform active:scale-95"
            >
              <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
