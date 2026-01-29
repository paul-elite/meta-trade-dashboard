import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Fetch conversations (admin sees all, user sees their own)
export async function GET() {
  try {
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
      // Admin - fetch all conversations with last message
      const { data: conversations, error } = await adminClient
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })

      if (error) throw error

      // Fetch user profiles for conversations with user_id
      const userIds = conversations?.filter(c => c.user_id).map(c => c.user_id as string) || []
      const { data: profiles } = userIds.length > 0
        ? await adminClient
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds)
        : { data: [] }

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

      // Add profile info and fetch last message for each conversation
      const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv) => {
          const { data: lastMessage } = await adminClient
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          const { count: unreadCount } = await adminClient
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_type', 'admin')

          return {
            ...conv,
            profile: conv.user_id ? profileMap.get(conv.user_id) : null,
            lastMessage: lastMessage || null,
            unreadCount: unreadCount || 0
          }
        })
      )

      return NextResponse.json({ conversations: conversationsWithDetails })
    } else {
      // Regular user - fetch their own conversation
      const { data: conversation } = await adminClient
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .single()

      if (conversation) {
        const { data: messages } = await adminClient
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })

        return NextResponse.json({
          conversation,
          messages: messages || []
        })
      }

      return NextResponse.json({ conversation: null, messages: [] })
    }
  } catch (err: unknown) {
    const error = err as Error
    console.error('Get conversations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new conversation for authenticated user
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    // Check if user already has an open conversation
    const { data: existing } = await adminClient
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .single()

    if (existing) {
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
      .insert({ user_id: user.id, status: 'open' })
      .select()
      .single()

    if (error) throw error

    // Add welcome message
    await adminClient.from('messages').insert({
      conversation_id: newConversation.id,
      sender_type: 'system',
      content: 'Welcome to MetaTrade Support! How can we help you today?',
      message_type: 'system'
    })

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
    console.error('Create conversation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
