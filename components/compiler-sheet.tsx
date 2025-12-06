"use client"

import { useState, useTransition } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { compileTextToTasks } from "@/app/actions/ai-actions"
import type { Task } from "@/lib/types"

interface CompiledTask {
  title: string
  estimatedMinutes: number
  energyLoad: number
  selected: boolean
}

interface CompilerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTasks: (tasks: Omit<Task, "id" | "completed" | "isIgnitionTask">[]) => void
}

export function CompilerSheet({ open, onOpenChange, onAddTasks }: CompilerSheetProps) {
  const [text, setText] = useState("")
  const [compiledTasks, setCompiledTasks] = useState<CompiledTask[]>([])
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<"input" | "review">("input")

  const handleCompile = () => {
    if (!text.trim()) return

    startTransition(async () => {
      const tasks = await compileTextToTasks(text)
      setCompiledTasks(tasks.map((t) => ({ ...t, selected: true })))
      setStep("review")
    })
  }

  const toggleTask = (index: number) => {
    setCompiledTasks((prev) => prev.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t)))
  }

  const handleAddSelected = () => {
    const selectedTasks = compiledTasks
      .filter((t) => t.selected)
      .map((t) => ({
        title: t.title,
        estimatedMinutes: t.estimatedMinutes,
        energyLoad: t.energyLoad as 1 | 2 | 3 | 4,
        steps: [],
      }))

    onAddTasks(selectedTasks)
    resetAndClose()
  }

  const resetAndClose = () => {
    setText("")
    setCompiledTasks([])
    setStep("input")
    onOpenChange(false)
  }

  const selectedCount = compiledTasks.filter((t) => t.selected).length

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? onOpenChange(v) : resetAndClose())}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[85dvh] px-0 pb-safe">
        {/* iOS-style drag handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <button onClick={resetAndClose} className="text-pastel-pink text-[17px] font-normal">
              キャンセル
            </button>
            <SheetTitle className="text-[17px] font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Compiler
            </SheetTitle>
            {step === "review" ? (
              <button
                onClick={handleAddSelected}
                disabled={selectedCount === 0}
                className={cn(
                  "text-[17px] font-semibold",
                  selectedCount > 0 ? "text-pastel-pink" : "text-muted-foreground",
                )}
              >
                追加({selectedCount})
              </button>
            ) : (
              <div className="w-16" />
            )}
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-full px-5 py-5 space-y-5">
          {step === "input" ? (
            <>
              <div className="space-y-2">
                <p className="text-[15px] text-muted-foreground">
                  頭の中にあることを自由に書き出してください。AIがタスクを抽出します。
                </p>
                <div className="ios-card rounded-xl bg-card overflow-hidden">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="今日やることリスト...&#10;&#10;例: 明日のプレゼンの準備しなきゃ。あと銀行に行って振り込み、夕飯の買い物も。メール返信が溜まってる..."
                    className="min-h-[200px] border-0 bg-transparent text-[17px] p-4 focus-visible:ring-0 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCompile}
                disabled={isPending || !text.trim()}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-white transition-all haptic-tap",
                  "bg-gradient-to-r from-pastel-lavender to-pastel-pink",
                  (isPending || !text.trim()) && "opacity-70",
                )}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    抽出中...
                  </span>
                ) : (
                  "タスクを抽出する"
                )}
              </button>
            </>
          ) : (
            <>
              <p className="text-[15px] text-muted-foreground">追加するタスクを選択してください</p>

              <div className="ios-card rounded-xl bg-card overflow-hidden divide-y divide-border">
                {compiledTasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTask(index)}
                    className="w-full flex items-center gap-3 px-4 py-3 haptic-tap active:bg-secondary/50"
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        task.selected ? "bg-pastel-pink border-pastel-pink" : "border-muted-foreground/30",
                      )}
                    >
                      {task.selected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[17px] font-medium">{task.title}</p>
                      <p className="text-[13px] text-muted-foreground">
                        約{task.estimatedMinutes}分 ・ 負荷{task.energyLoad}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep("input")}
                className="w-full py-3 rounded-xl font-medium text-pastel-pink bg-secondary haptic-tap"
              >
                テキストを編集
              </button>
            </>
          )}

          <div className="h-20" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
