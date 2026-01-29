import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { guestSessionId, guestName, guestEmail } = body

    if (!guestSessionId) {
      return NextResponse.json({ error: 'Guest session ID required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check if conversation already exists for this guest
    const { data: existing } = await adminClient
      .from('conversations')
      .select('*')
      .eq('guest_session_id', guestSessionId)
      .eq('status', 'open')
      .single()

    if (existing) {
      // Fetch messages for existing conversation
      const { data: messages } = await adminClient
        .from('messages')
        .select('*')
        .eq('conversation_id', existing.id)
        .order('created_at', { ascending: true })

      return NextResponse.json({
        conversation: existing,
        messages: messages || []
      })
    }

    // Create new conversation
    const { data: newConversation, error } = await adminClient
      .from('conversations')
      .insert({
        guest_session_id: guestSessionId,
        guest_name: guestName || null,
        guest_email: guestEmail || null,
        status: 'open'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }

    // Add system welcome message
    await adminClient.from('messages').insert({
      conversation_id: newConversation.id,
      sender_type: 'system',
      content: 'Welcome to MetaTrade Support! How can we help you today?',
      message_type: 'system'
    })

    // Fetch messages (including the welcome message)
    const { data: messages } = await adminClient
      .from('messages')
      .select('*')
      .eq('conversation_id', newConversation.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      conversation: newConversation,
      messages: messages || []
    })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Guest chat error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
