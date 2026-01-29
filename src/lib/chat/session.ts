// Generate a unique session ID for guests
export function generateGuestSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get or create guest session ID from localStorage
export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('chat_guest_session')
  if (!sessionId) {
    sessionId = generateGuestSessionId()
    localStorage.setItem('chat_guest_session', sessionId)
  }
  return sessionId
}

// Clear guest session
export function clearGuestSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('chat_guest_session')
}
