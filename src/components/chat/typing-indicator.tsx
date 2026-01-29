'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
        <span className="text-xs">MT</span>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-zinc-800">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
