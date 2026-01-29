'use client'

import { X, Minus } from 'lucide-react'

interface ChatHeaderProps {
  onClose: () => void
  onMinimize?: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
          <span className="text-black font-bold">M</span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">MetaTrade Support</h3>
          <p className="text-green-500 text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Online
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onClose}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Minus className="w-4 h-4 text-zinc-400" />
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    </div>
  )
}
