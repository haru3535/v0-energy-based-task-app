"use client"

import { useState, useTransition } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Heart, Clock, Sparkles, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, TaskStep } from "@/lib/types"
import { breakdownTask } from "@/app/actions/ai-actions"

interface TaskDetailSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (taskId: string) => void
  onUpdateSteps: (taskId: string, steps: TaskStep[]) => void
  onToggleStep: (taskId: string, stepId: string) => void
}

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  onComplete,
  onUpdateSteps,
  onToggleStep,
}: TaskDetailSheetProps) {
  const [spicyLevel, setSpicyLevel] = useState(3)
  const [isPending, startTransition] = useTransition()

  if (!task) return null

  const handleBreakdown = () => {
    startTransition(async () => {
      const steps = await breakdownTask(task.title, spicyLevel)
      const newSteps: TaskStep[] = steps.map((s, i) => ({
        id: `ai-step-${Date.now()}-${i}`,
        title: s.title,
        completed: false,
      }))
      onUpdateSteps(task.id, newSteps)
    })
  }

  const completedSteps = task.steps.filter((s) => s.completed).length
  const totalSteps = task.steps.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[85dvh] px-0 pb-safe">
        {/* iOS-style drag handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <button onClick={() => onOpenChange(false)} className="text-pastel-pink text-[17px] font-normal">
              閉じる
            </button>
            <SheetTitle className="text-[17px] font-semibold">タスク詳細</SheetTitle>
            <button onClick={() => onComplete(task.id)} className="text-pastel-pink text-[17px] font-semibold">
              完了
            </button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-full px-5 py-5 space-y-6">
          {/* Task Info */}
          <div className="ios-card rounded-xl p-4 bg-card space-y-3">
            <h3 className="text-xl font-bold">{task.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array(task.energyLoad)
                  .fill(0)
                  .map((_, i) => (
                    <Heart key={i} className="w-4 h-4 text-pastel-coral fill-pastel-coral" />
                  ))}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{task.estimatedMinutes}分</span>
              </div>
              {totalSteps > 0 && (
                <span>
                  {completedSteps}/{totalSteps} ステップ完了
                </span>
              )}
            </div>
          </div>

          {/* Magic ToDo - Breakdown Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[15px] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pastel-lavender" />
                Magic ToDo
              </h4>
            </div>

            {/* Spicy Level Selector */}
            <div className="ios-card rounded-xl p-4 bg-card space-y-3">
              <p className="text-[13px] text-muted-foreground">分解の細かさを選んでください</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSpicyLevel(level)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all haptic-tap",
                      spicyLevel === level
                        ? "bg-pastel-coral/20 text-pastel-coral ring-2 ring-pastel-coral"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {"🌶️".repeat(level)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleBreakdown}
                disabled={isPending}
                className={cn(
                  "w-full py-3 rounded-xl font-semibold text-white transition-all haptic-tap",
                  "bg-gradient-to-r from-pastel-pink to-pastel-lavender",
                  isPending && "opacity-70",
                )}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    分解中...
                  </span>
                ) : (
                  "タスクを分解する"
                )}
              </button>
            </div>
          </div>

          {/* Steps List */}
          {task.steps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[13px] text-muted-foreground uppercase tracking-wide px-1">ステップ</h4>
              <div className="ios-card rounded-xl bg-card overflow-hidden divide-y divide-border">
                {task.steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => onToggleStep(task.id, step.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 haptic-tap active:bg-secondary/50"
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        step.completed ? "bg-pastel-mint border-pastel-mint" : "border-muted-foreground/30",
                      )}
                    >
                      {step.completed && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span
                      className={cn("text-[17px] text-left", step.completed && "line-through text-muted-foreground")}
                    >
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-20" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
