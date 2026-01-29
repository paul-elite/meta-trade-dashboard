'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { useStore } from '@/store/useStore'
import { getOrCreateGuestSessionId } from '@/lib/chat/session'
import { ChatHeader } from './chat-header'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { TypingIndicator } from './typing-indicator'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types/database'

export function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useStore()
  const {
    messages,
    setMessages,
    addMessage,
    currentConversation,
    setCurrentConversation,
    guestSessionId,
    setGuestSessionId,
    isLoading,
    setIsLoading,
    isSending,
    setIsSending,
    isAdminTyping,
    setIsOpen,
    clearUnread
  } = useChatStore()

  const supabase = createClient()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Clear unread when window opens
  useEffect(() => {
    clearUnread()
  }, [clearUnread])

  // Initialize chat
  const initializeChat = useCallback(async () => {
    setIsLoading(true)
    try {
      if (user) {
        // Authenticated user
        const response = await fetch('/api/chat/conversations', {
          method: 'POST'
        })
        const data = await response.json()
        if (data.conversation) {
          setCurrentConversation(data.conversation)
          setMessages(data.messages || [])
        }
      } else {
        // Guest user
        let sessionId = guestSessionId
        if (!sessionId) {
          sessionId = getOrCreateGuestSessionId()
          setGuestSessionId(sessionId)
        }

        const response = await fetch('/api/chat/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestSessionId: sessionId })
        })
        const data = await response.json()
        if (data.conversation) {
          setCurrentConversation(data.conversation)
          setMessages(data.messages || [])
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, guestSessionId, setGuestSessionId, setCurrentConversation, setMessages, setIsLoading])

  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  // Subscribe to realtime messages
  useEffect(() => {
    if (!currentConversation?.id) return

    const channel = supabase
      .channel(`messages:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message
          // Only add if not already in messages (avoid duplicates)
          const exists = messages.some(m => m.id === newMessage.id)
          if (!exists) {
            addMessage(newMessage)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentConversation?.id, supabase, addMessage, messages])

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!currentConversation?.id || isSending) return

    setIsSending(true)

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: currentConversation.id,
      sender_type: user ? 'user' : 'guest',
      sender_id: user?.id || null,
      content,
      message_type: 'text',
      is_read: false,
      read_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    addMessage(tempMessage)

    try {
      const response = await fetch(`/api/chat/conversations/${currentConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          senderType: user ? 'user' : 'guest',
          guestSessionId: guestSessionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(messages.filter(m => m.id !== tempMessage.id))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader onClose={() => setIsOpen(false)} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isAdminTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isLoading || isSending} />
    </div>
  )
}
