import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Fetch messages for a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const adminClient = createAdminClient()

    const { data: messages, error } = await adminClient
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ messages: messages || [] })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Get messages error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Send a message
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const body = await request.json()
    const { content, senderType, guestSessionId } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Verify conversation exists
    const { data: conversation } = await adminClient
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Determine sender info
    let senderId: string | null = null
    let finalSenderType = senderType || 'guest'

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check if admin
      const { data: profile } = await adminClient
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (profile?.is_admin) {
        finalSenderType = 'admin'
        senderId = user.id
      } else if (conversation.user_id === user.id) {
        finalSenderType = 'user'
        senderId = user.id
      }
    } else if (guestSessionId && conversation.guest_session_id === guestSessionId) {
      finalSenderType = 'guest'
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert message
    const { data: message, error } = await adminClient
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: finalSenderType,
        sender_id: senderId,
        content: content.trim(),
        message_type: 'text'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Send message error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - Mark messages as read
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    // Check if admin
    const { data: profile } = await adminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profile?.is_admin) {
      // Admin marking user/guest messages as read
      await adminClient
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .in('sender_type', ['user', 'guest'])
        .eq('is_read', false)
    } else {
      // User marking admin messages as read
      await adminClient
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'admin')
        .eq('is_read', false)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Mark read error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
