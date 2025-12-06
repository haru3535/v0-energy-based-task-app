"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, X, ChevronDown, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"
import { estimateTask } from "@/app/actions/ai-actions"

interface AddTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: Omit<Task, "id" | "completed" | "isIgnitionTask">) => void
}

export function AddTaskSheet({ open, onOpenChange, onAddTask }: AddTaskSheetProps) {
  const [title, setTitle] = useState("")
  const [energyLoad, setEnergyLoad] = useState<1 | 2 | 3 | 4>(2)
  const [estimatedMinutes, setEstimatedMinutes] = useState(15)
  const [steps, setSteps] = useState<string[]>([])
  const [newStep, setNewStep] = useState("")
  const [isPending, startTransition] = useTransition()
  const [aiReasoning, setAiReasoning] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      energyLoad,
      estimatedMinutes,
      steps: steps.map((s, i) => ({ id: `step-${i}`, title: s, completed: false })),
    })

    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setEnergyLoad(2)
    setEstimatedMinutes(15)
    setSteps([])
    setNewStep("")
    setAiReasoning(null)
  }

  const handleEstimate = () => {
    if (!title.trim()) return

    startTransition(async () => {
      const result = await estimateTask(title)
      setEstimatedMinutes(result.estimatedMinutes)
      setEnergyLoad(result.energyLoad as 1 | 2 | 3 | 4)
      setAiReasoning(result.reasoning)
    })
  }

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep.trim()])
      setNewStep("")
    }
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

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
              キャンセル
            </button>
            <SheetTitle className="text-[17px] font-semibold">新規タスク</SheetTitle>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className={cn("text-[17px] font-semibold", title.trim() ? "text-pastel-pink" : "text-muted-foreground")}
            >
              追加
            </button>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="overflow-y-auto h-full px-5 py-5 space-y-6">
          {/* Task Name - iOS style grouped list */}
          <div className="ios-card rounded-xl overflow-hidden bg-card">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスク名"
              className="border-0 bg-transparent h-12 text-[17px] px-4 focus-visible:ring-0"
            />
          </div>

          <button
            type="button"
            onClick={handleEstimate}
            disabled={isPending || !title.trim()}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-all haptic-tap",
              "bg-gradient-to-r from-pastel-mint to-pastel-lavender text-foreground",
              "flex items-center justify-center gap-2",
              (isPending || !title.trim()) && "opacity-60",
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                推定中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Estimator - AIで自動推定
              </>
            )}
          </button>

          {/* AI Reasoning Display */}
          {aiReasoning && (
            <div className="ios-card rounded-xl p-3 bg-pastel-lavender/10 border border-pastel-lavender/30">
              <p className="text-[13px] text-muted-foreground">{aiReasoning}</p>
            </div>
          )}

          {/* Energy Load */}
          <div className="space-y-2">
            <Label className="text-[13px] text-muted-foreground uppercase tracking-wide px-4">タスクの重さ</Label>
            <div className="ios-card rounded-xl p-3 bg-card">
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((load) => (
                  <button
                    key={load}
                    type="button"
                    onClick={() => setEnergyLoad(load)}
                    className={cn(
                      "py-3 px-2 rounded-xl transition-all haptic-tap",
                      "flex flex-col items-center gap-1.5",
                      energyLoad === load ? "bg-pastel-coral/20 ring-2 ring-pastel-coral" : "bg-secondary",
                    )}
                  >
                    <div className="flex">
                      {Array(load)
                        .fill(0)
                        .map((_, i) => (
                          <Heart key={i} className="w-4 h-4 text-pastel-coral fill-pastel-coral" />
                        ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {load === 1 && "軽い"}
                      {load === 2 && "普通"}
                      {load === 3 && "重め"}
                      {load === 4 && "大変"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="space-y-2">
            <Label className="text-[13px] text-muted-foreground uppercase tracking-wide px-4">所要時間</Label>
            <div className="ios-card rounded-xl bg-card overflow-hidden">
              <div className="flex items-center justify-between h-12 px-4">
                <span className="text-[17px]">時間（分）</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    min={1}
                    max={480}
                    className="border-0 bg-transparent h-8 w-16 text-right text-[17px] text-pastel-pink focus-visible:ring-0"
                  />
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <Label className="text-[13px] text-muted-foreground uppercase tracking-wide px-4">小さなステップ</Label>
            <p className="text-[13px] text-muted-foreground px-4">10分以内で終わる小さなステップに分けましょう</p>
            <div className="ios-card rounded-xl bg-card overflow-hidden divide-y divide-border">
              <div className="flex items-center gap-2 px-4 h-12">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="ステップを追加..."
                  className="border-0 bg-transparent h-full text-[17px] px-0 focus-visible:ring-0"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStep())}
                />
                <button type="button" onClick={addStep} className="text-pastel-pink text-[17px] font-medium shrink-0">
                  追加
                </button>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between px-4 h-12">
                  <span className="text-[17px]">{step}</span>
                  <button type="button" onClick={() => removeStep(index)} className="text-destructive p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Extra padding for scroll */}
          <div className="h-20" />
        </form>
      </SheetContent>
    </Sheet>
  )
}
