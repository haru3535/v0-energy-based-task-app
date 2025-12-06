"use server"

import { generateObject } from "ai"
import { z } from "zod"

export async function estimateTask(taskTitle: string) {
  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: z.object({
      estimatedMinutes: z.number().min(1).max(480),
      energyLoad: z.number().min(1).max(4),
      reasoning: z.string(),
    }),
    prompt: `タスク「${taskTitle}」の所要時間と精神的・身体的な負荷を推定してください。
    
- estimatedMinutes: 推定所要時間（分）
- energyLoad: エネルギー負荷 (1=軽い, 2=普通, 3=重め, 4=大変)
- reasoning: 推定の理由（日本語で簡潔に）

現実的な推定をしてください。`,
  })

  return object
}

export async function compileTextToTasks(text: string) {
  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: z.object({
      tasks: z.array(
        z.object({
          title: z.string(),
          estimatedMinutes: z.number().min(1).max(480),
          energyLoad: z.number().min(1).max(4),
        }),
      ),
    }),
    prompt: `以下のテキストから実行可能なタスクを抽出してください。

テキスト:
${text}

各タスクについて:
- title: タスク名（簡潔に）
- estimatedMinutes: 推定所要時間（分）
- energyLoad: エネルギー負荷 (1=軽い, 2=普通, 3=重め, 4=大変)

重複を避け、具体的なアクションとして抽出してください。`,
  })

  return object.tasks
}

export async function breakdownTask(taskTitle: string, spicyLevel = 3) {
  const detailLevel =
    spicyLevel === 1
      ? "大まかに3-4ステップ"
      : spicyLevel === 2
        ? "適度に4-6ステップ"
        : spicyLevel === 3
          ? "詳細に5-8ステップ"
          : spicyLevel === 4
            ? "とても詳細に7-10ステップ"
            : "極めて詳細に10-15ステップ"

  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: z.object({
      steps: z.array(
        z.object({
          title: z.string(),
          estimatedMinutes: z.number().min(1).max(30),
        }),
      ),
    }),
    prompt: `タスク「${taskTitle}」を小さなステップに分解してください。

分解レベル: ${detailLevel}

各ステップは10分以内で完了できる具体的なアクションにしてください。
ADHDや実行機能障害のある人でも取り組みやすいよう、最初のステップは特に簡単にしてください。`,
  })

  return object.steps
}
