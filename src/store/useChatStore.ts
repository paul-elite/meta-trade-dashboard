import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message, Conversation } from '@/types/database'

interface ChatState {
  // UI State
  isOpen: boolean
  toggleChat: () => void
  setIsOpen: (open: boolean) => void

  // Guest Session
  guestSessionId: string | null
  setGuestSessionId: (id: string) => void

  // Conversation
  currentConversation: Conversation | null
  setCurrentConversation: (conversation: Conversation | null) => void

  // Messages
  messages: Message[]
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void

  // Loading
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isSending: boolean
  setIsSending: (sending: boolean) => void

  // Typing
  isAdminTyping: boolean
  setIsAdminTyping: (typing: boolean) => void

  // Unread
  unreadCount: number
  setUnreadCount: (count: number) => void
  incrementUnread: () => void
  clearUnread: () => void

  // Reset
  reset: () => void
}

const initialState = {
  isOpen: false,
  guestSessionId: null,
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  isAdminTyping: false,
  unreadCount: 0,
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...initialState,

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsOpen: (open) => set({ isOpen: open }),

      setGuestSessionId: (id) => set({ guestSessionId: id }),

      setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsSending: (sending) => set({ isSending: sending }),

      setIsAdminTyping: (typing) => set({ isAdminTyping: typing }),

      setUnreadCount: (count) => set({ unreadCount: count }),
      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
      clearUnread: () => set({ unreadCount: 0 }),

      reset: () => set(initialState),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        guestSessionId: state.guestSessionId,
      }),
    }
  )
)
