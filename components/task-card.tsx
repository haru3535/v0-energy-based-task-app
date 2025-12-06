"use client"

import type { Task } from "@/lib/types"
import { Heart, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
  onSelect: (task: Task) => void
}

function EnergyLoadIndicator({ load }: { load: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <Heart
          key={i}
          className={cn("w-3 h-3", i <= load ? "text-pastel-coral fill-pastel-coral" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  )
}

export function TaskCard({ task, onComplete, onSelect }: TaskCardProps) {
  const completedSteps = task.steps.filter((s) => s.completed).length
  const totalSteps = task.steps.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("bg-card ios-card rounded-xl overflow-hidden", task.completed && "opacity-50")}
    >
      <button
        onClick={() => onSelect(task)}
        className="w-full p-4 flex items-center gap-3 haptic-tap active:bg-secondary/50 transition-colors"
      >
        {/* iOS-style checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onComplete(task.id)
          }}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
            task.completed
              ? "bg-pastel-pink border-pastel-pink"
              : "border-muted-foreground/30 hover:border-pastel-pink",
          )}
        >
          {task.completed && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 text-left min-w-0">
          <h4 className={cn("font-medium text-[17px] text-foreground truncate", task.completed && "line-through")}>
            {task.title}
          </h4>

          <div className="flex items-center gap-3 mt-1.5 text-[13px] text-muted-foreground">
            <EnergyLoadIndicator load={task.energyLoad} />
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedMinutes}分</span>
            </div>
            {totalSteps > 0 && (
              <span>
                {completedSteps}/{totalSteps}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0" />
      </button>
    </motion.div>
  )
}
