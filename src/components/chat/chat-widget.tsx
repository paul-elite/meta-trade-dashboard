'use client'

import { useChatStore } from '@/store/useChatStore'
import { ChatWindow } from './chat-window'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatWidget() {
  const { isOpen, toggleChat, unreadCount } = useChatStore()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'absolute bottom-20 right-0',
            'w-[360px] sm:w-[400px] h-[500px] sm:h-[560px]',
            'rounded-2xl border border-zinc-800/50',
            'bg-zinc-900/95 backdrop-blur-xl',
            'shadow-2xl shadow-black/50',
            'overflow-hidden',
            'animate-in fade-in slide-in-from-bottom-4 duration-200'
          )}
        >
          <ChatWindow />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center',
          'shadow-lg shadow-black/30 transition-all duration-200',
          'hover:scale-105 active:scale-95',
          isOpen
            ? 'bg-zinc-800 hover:bg-zinc-700'
            : 'bg-yellow-500 hover:bg-yellow-400'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  )
}
