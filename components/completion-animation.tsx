"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Check } from "lucide-react"

interface CompletionAnimationProps {
  show: boolean
  onComplete: () => void
}

export function CompletionAnimation({ show, onComplete }: CompletionAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 600)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-20 h-20 rounded-full bg-pastel-pink flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 20 }}
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
