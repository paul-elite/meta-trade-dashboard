'use client'

import { Message } from '@/types/database'
import { cn } from '@/lib/utils'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender_type === 'user' || message.sender_type === 'guest'
  const isSystem = message.sender_type === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 rounded-full bg-zinc-800/50 text-zinc-400 text-xs">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-2 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-yellow-500' : 'bg-zinc-700'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-black" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[75%] px-4 py-2 rounded-2xl text-sm',
          isUser
            ? 'bg-yellow-500 text-black rounded-br-md'
            : 'bg-zinc-800 text-white rounded-bl-md'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={cn(
            'text-[10px] mt-1',
            isUser ? 'text-black/60' : 'text-zinc-500'
          )}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}
