'use client'

import { useEffect, useState, useRef } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Message, Conversation, Profile } from '@/types/database'
import {
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCheck,
  Circle
} from 'lucide-react'

interface ConversationWithDetails extends Conversation {
  profile?: Profile | null
  lastMessage?: Message | null
  unreadCount: number
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch conversations
  useEffect(() => {
    fetchConversations()
  }, [])

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message
          // Update messages if viewing this conversation
          if (newMsg.conversation_id === selectedConversation) {
            setMessages((prev) => {
              if (prev.some(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
          // Refresh conversations list
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchConversations() {
    try {
      const response = await fetch('/api/chat/conversations')
      const data = await response.json()
      if (data.conversations) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function selectConversation(conversationId: string) {
    setSelectedConversation(conversationId)
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`)
      const data = await response.json()
      setMessages(data.messages || [])

      // Mark messages as read
      await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'PATCH'
      })
      fetchConversations()
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/chat/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() })
      })

      if (response.ok) {
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'all') return true
    return conv.status === filter
  })

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Support Chat"
        description={`${conversations.length} total conversations`}
      />

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-zinc-800 flex gap-2">
              {(['open', 'closed', 'all'] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? 'primary' : 'ghost'}
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                  <p>No conversations</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={cn(
                      'w-full p-4 text-left border-b border-zinc-800/50 transition-colors',
                      'hover:bg-zinc-800/50',
                      selectedConversation === conv.id && 'bg-zinc-800/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {conv.profile?.full_name ||
                              conv.profile?.email ||
                              conv.guest_name ||
                              `Guest ${conv.guest_session_id?.slice(-6) || ''}`}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="danger" className="shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-1">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                          <Clock className="w-3 h-3" />
                          {new Date(conv.last_message_at).toLocaleDateString()}
                          <Circle
                            className={cn(
                              'w-2 h-2 ml-auto',
                              conv.status === 'open' ? 'fill-green-500 text-green-500' : 'fill-zinc-500 text-zinc-500'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {selectedConv?.profile?.full_name ||
                          selectedConv?.profile?.email ||
                          selectedConv?.guest_name ||
                          `Guest ${selectedConv?.guest_session_id?.slice(-6) || ''}`}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {selectedConv?.profile?.email || selectedConv?.guest_email || 'Guest User'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={selectedConv?.status === 'open' ? 'success' : 'default'}>
                    {selectedConv?.status}
                  </Badge>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messages.map((message) => {
                    const isAdmin = message.sender_type === 'admin'
                    const isSystem = message.sender_type === 'system'

                    if (isSystem) {
                      return (
                        <div key={message.id} className="flex justify-center my-4">
                          <span className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                            {message.content}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={message.id}
                        className={cn('flex mb-4', isAdmin ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] px-4 py-2 rounded-2xl text-sm',
                            isAdmin
                              ? 'bg-yellow-500 text-black rounded-br-md'
                              : 'bg-zinc-800 text-white rounded-bl-md'
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <div className={cn('flex items-center gap-1 mt-1 text-[10px]', isAdmin ? 'text-black/60' : 'text-zinc-500')}>
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {isAdmin && message.is_read && (
                              <CheckCheck className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t border-zinc-800 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <Button
                    variant="primary"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="px-4"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm">Choose from the list to start responding</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
