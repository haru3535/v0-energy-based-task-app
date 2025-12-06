"use client"

import { useState, useCallback } from "react"
import type { EnergyLevel, Task, EnergyData, AppSettings, TaskStep, HealthData } from "@/lib/types"
import { findIgnitionTask, calculateEnergyFromHealth } from "@/lib/energy-utils"
import { EnergyDisplay } from "@/components/energy-display"
import { IgnitionTaskCard } from "@/components/ignition-task-card"
import { TaskList } from "@/components/task-list"
import { AddTaskSheet } from "@/components/add-task-sheet"
import { EnergySelector } from "@/components/energy-selector"
import { CompletionAnimation } from "@/components/completion-animation"
import { IOSTabBar } from "@/components/ios-tab-bar"
import { StatsView } from "@/components/stats-view"
import { SettingsView } from "@/components/settings-view"
import { TaskDetailSheet } from "@/components/task-detail-sheet"
import { CompilerSheet } from "@/components/compiler-sheet"
import { HealthSyncSheet } from "@/components/health-sync-sheet"

// Sample data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "メールの返信",
    energyLoad: 1,
    estimatedMinutes: 5,
    steps: [],
    completed: false,
  },
  {
    id: "2",
    title: "書類の整理",
    energyLoad: 2,
    estimatedMinutes: 20,
    steps: [
      { id: "s1", title: "机の上を片付ける", completed: false },
      { id: "s2", title: "書類を分類する", completed: false },
      { id: "s3", title: "ファイルに綴じる", completed: false },
    ],
    completed: false,
  },
  {
    id: "3",
    title: "プレゼン資料作成",
    energyLoad: 4,
    estimatedMinutes: 120,
    steps: [
      { id: "s1", title: "構成を考える", completed: false },
      { id: "s2", title: "スライド作成", completed: false },
      { id: "s3", title: "見直し", completed: false },
    ],
    completed: false,
  },
  {
    id: "4",
    title: "買い物リスト作成",
    energyLoad: 1,
    estimatedMinutes: 10,
    steps: [],
    completed: false,
  },
  {
    id: "5",
    title: "レポート提出",
    energyLoad: 3,
    estimatedMinutes: 45,
    steps: [
      { id: "s1", title: "下書きを確認", completed: true },
      { id: "s2", title: "修正する", completed: false },
      { id: "s3", title: "提出", completed: false },
    ],
    completed: false,
  },
]

const initialEnergyHistory: EnergyData[] = [
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), sleepHours: 7.5, stressLevel: 40, energyLevel: "high" },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), sleepHours: 6.0, stressLevel: 60, energyLevel: "medium" },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), sleepHours: 5.5, stressLevel: 70, energyLevel: "low" },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), sleepHours: 8.0, stressLevel: 30, energyLevel: "high" },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), sleepHours: 7.0, stressLevel: 50, energyLevel: "medium" },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), sleepHours: 4.5, stressLevel: 80, energyLevel: "very-low" },
  { date: new Date(), sleepHours: 6.5, stressLevel: 55, energyLevel: "medium" },
]

export default function SauciApp() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(() => calculateEnergyFromHealth(6.5, 55))
  const [energyHistory, setEnergyHistory] = useState<EnergyData[]>(initialEnergyHistory)
  const [settings, setSettings] = useState<AppSettings>({
    autoTaskGranularity: true,
    autoPriorityAdjustment: true,
    healthSyncEnabled: true,
    manualHealthInput: false,
  })
  const [activeTab, setActiveTab] = useState<"home" | "stats" | "settings">("home")
  const [showEnergySelector, setShowEnergySelector] = useState(false)
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [showCompiler, setShowCompiler] = useState(false)
  const [showHealthSync, setShowHealthSync] = useState(false)
  const [lastHealthSync, setLastHealthSync] = useState<HealthData | null>(null)

  const ignitionTask = findIgnitionTask(tasks)

  const handleCompleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))
    setShowCompletionAnimation(true)
    setShowTaskDetail(false)
  }, [])

  const handleAddTask = useCallback((newTask: Omit<Task, "id" | "completed" | "isIgnitionTask">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    }
    setTasks((prev) => [...prev, task])
    setShowAddTask(false)
  }, [])

  const handleAddTasks = useCallback((newTasks: Omit<Task, "id" | "completed" | "isIgnitionTask">[]) => {
    const tasksToAdd: Task[] = newTasks.map((t, i) => ({
      ...t,
      id: `${Date.now()}-${i}`,
      completed: false,
    }))
    setTasks((prev) => [...prev, ...tasksToAdd])
    setShowCompiler(false)
  }, [])

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }, [])

  const handleUpdateSteps = useCallback((taskId: string, steps: TaskStep[]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, steps } : task)))
    setSelectedTask((prev) => (prev && prev.id === taskId ? { ...prev, steps } : prev))
  }, [])

  const handleToggleStep = useCallback((taskId: string, stepId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              steps: task.steps.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)),
            }
          : task,
      ),
    )
    setSelectedTask((prev) =>
      prev && prev.id === taskId
        ? {
            ...prev,
            steps: prev.steps.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)),
          }
        : prev,
    )
  }, [])

  const handleHealthSyncComplete = useCallback(
    (healthData: HealthData, newEnergyLevel: EnergyLevel, stressLevel: number) => {
      setLastHealthSync(healthData)
      setEnergyLevel(newEnergyLevel)

      // Add to energy history
      const newEntry: EnergyData = {
        date: new Date(),
        sleepHours: healthData.sleepHours,
        stressLevel: stressLevel,
        energyLevel: newEnergyLevel,
        hrvMs: healthData.hrvMs,
      }
      setEnergyHistory((prev) => [...prev.slice(-6), newEntry])
    },
    [],
  )

  const getTabTitle = () => {
    switch (activeTab) {
      case "home":
        return "ホーム"
      case "stats":
        return "データ"
      case "settings":
        return "設定"
    }
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* iOS Navigation Bar */}
      <header className="ios-nav-bar sticky top-0 z-40 border-b border-border/50 pt-safe">
        <div className="px-4 py-3 flex items-center justify-center">
          <h1 className="text-[17px] font-semibold tracking-tight">{getTabTitle()}</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 py-4 pb-28 space-y-5">
          {activeTab === "home" && (
            <>
              {/* Energy Display */}
              <EnergyDisplay
                level={energyLevel}
                onTap={() => setShowEnergySelector(true)}
                lastHealthSync={lastHealthSync}
                onHealthSyncTap={() => setShowHealthSync(true)}
              />

              {/* Ignition Task */}
              {ignitionTask && <IgnitionTaskCard task={ignitionTask} onComplete={handleCompleteTask} />}

              {/* Task List */}
              <TaskList
                tasks={tasks}
                energyLevel={energyLevel}
                onCompleteTask={handleCompleteTask}
                onSelectTask={handleSelectTask}
              />
            </>
          )}

          {activeTab === "stats" && <StatsView energyHistory={energyHistory} />}

          {activeTab === "settings" && (
            <SettingsView
              settings={settings}
              onSettingsChange={setSettings}
              lastHealthSync={lastHealthSync}
              onHealthSyncTap={() => setShowHealthSync(true)}
            />
          )}
        </div>
      </main>

      {/* iOS Tab Bar */}
      <IOSTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTask={() => setShowAddTask(true)}
        onOpenCompiler={() => setShowCompiler(true)}
        showAddButton={activeTab === "home"}
      />

      {/* Add Task Sheet */}
      <AddTaskSheet open={showAddTask} onOpenChange={setShowAddTask} onAddTask={handleAddTask} />

      <TaskDetailSheet
        task={selectedTask}
        open={showTaskDetail}
        onOpenChange={setShowTaskDetail}
        onComplete={handleCompleteTask}
        onUpdateSteps={handleUpdateSteps}
        onToggleStep={handleToggleStep}
      />

      <CompilerSheet open={showCompiler} onOpenChange={setShowCompiler} onAddTasks={handleAddTasks} />

      {/* Energy Selector Sheet */}
      <EnergySelector
        open={showEnergySelector}
        onOpenChange={setShowEnergySelector}
        currentLevel={energyLevel}
        onSelect={setEnergyLevel}
      />

      <HealthSyncSheet
        open={showHealthSync}
        onOpenChange={setShowHealthSync}
        onSyncComplete={handleHealthSyncComplete}
      />

      {/* Completion Animation */}
      <CompletionAnimation show={showCompletionAnimation} onComplete={() => setShowCompletionAnimation(false)} />
    </div>
  )
}
