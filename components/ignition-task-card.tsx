"use client"

import type { Task } from "@/lib/types"
import { Flame, Clock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface IgnitionTaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
}

export function IgnitionTaskCard({ task, onComplete }: IgnitionTaskCardProps) {
  const completedSteps = task.steps.filter((s) => s.completed).length
  const totalSteps = task.steps.length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "relative overflow-hidden p-5 rounded-2xl",
        "bg-gradient-to-br from-pastel-peach/50 to-pastel-coral/30",
        "ios-card-elevated",
      )}
    >
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 text-pastel-coral text-[13px] font-semibold">
          <Flame className="w-4 h-4" />
          点火タスク
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-[20px] font-bold text-foreground mb-3">{task.title}</h3>

        <div className="flex items-center gap-4 text-[13px] text-muted-foreground mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedMinutes}分</span>
          </div>
          {totalSteps > 0 && (
            <span>
              {completedSteps}/{totalSteps} ステップ
            </span>
          )}
        </div>

        <p className="text-[15px] text-muted-foreground mb-5">まずはこれだけやってみよう</p>

        <button
          onClick={() => onComplete(task.id)}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 haptic-tap",
            "bg-pastel-coral text-white text-[17px]",
            "active:scale-[0.98]",
            "flex items-center justify-center gap-2",
          )}
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          完了する
        </button>
      </div>
    </motion.div>
  )
}
