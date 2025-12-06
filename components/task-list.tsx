"use client"

import type { Task, EnergyLevel } from "@/lib/types"
import { TaskCard } from "./task-card"
import { filterTasksByEnergy } from "@/lib/energy-utils"
import { ListTodo } from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface TaskListProps {
  tasks: Task[]
  energyLevel: EnergyLevel
  onCompleteTask: (taskId: string) => void
  onSelectTask: (task: Task) => void
}

export function TaskList({ tasks, energyLevel, onCompleteTask, onSelectTask }: TaskListProps) {
  const filteredTasks = filterTasksByEnergy(tasks, energyLevel)
  const hiddenCount = tasks.filter((t) => !t.completed).length - filteredTasks.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          今できるタスク
        </h2>
        {hiddenCount > 0 && (
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {hiddenCount}件は今は非表示
          </span>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">🌟</p>
          <p>今日のタスクは全部完了！</p>
          <p className="text-sm">よく頑張りました</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={onCompleteTask} onSelect={onSelectTask} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
