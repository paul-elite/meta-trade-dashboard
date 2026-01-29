'use client'

import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = 'Type a message...' }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 p-4 border-t border-zinc-800">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-xl px-4 py-3 text-sm',
          'bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500',
          'focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'max-h-32'
        )}
        style={{ minHeight: '44px' }}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
          message.trim() && !disabled
            ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )
}
