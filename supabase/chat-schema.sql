-- ============================================
-- CHAT SYSTEM DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Conversations table - groups messages by user or guest session
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- For authenticated users, this links to their profile
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    -- For guest users, we store a session identifier
    guest_session_id TEXT,
    -- Status of the conversation
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
    -- Admin who is assigned to this conversation (optional)
    assigned_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Last message timestamp for sorting
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    -- Guest metadata (name, email if provided)
    guest_name TEXT,
    guest_email TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table - individual chat messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    -- Sender identification
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'guest', 'admin', 'system')),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Message content
    content TEXT NOT NULL,
    -- Message type for potential future expansion
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    -- Read status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_guest_session_id ON public.conversations(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read) WHERE is_read = false;

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Conversations: Users can view their own conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
FOR SELECT USING (auth.uid() = user_id);

-- Conversations: Admins can view all conversations
CREATE POLICY "Admins can view all conversations" ON public.conversations
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

-- Conversations: Allow insert for authenticated users
CREATE POLICY "Users can create conversations" ON public.conversations
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Conversations: Admins can update conversations (close, assign, etc.)
CREATE POLICY "Admins can update conversations" ON public.conversations
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view messages in own conversations" ON public.messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE conversations.id = messages.conversation_id
        AND conversations.user_id = auth.uid()
    )
);

-- Messages: Admins can view all messages
CREATE POLICY "Admins can view all messages" ON public.messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

-- Messages: Users can insert messages in their conversations
CREATE POLICY "Users can send messages" ON public.messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE conversations.id = messages.conversation_id
        AND conversations.user_id = auth.uid()
    )
);

-- Messages: Admins can insert messages in any conversation
CREATE POLICY "Admins can send messages" ON public.messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

-- Messages: Admins can update messages (for read receipts)
CREATE POLICY "Admins can update messages" ON public.messages
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

-- ============================================
-- FUNCTION & TRIGGER: Update last_message_at
-- ============================================

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_at = NEW.created_at, updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON public.messages;
CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- ENABLE REALTIME
-- ============================================
-- Note: Run these commands or enable via Supabase Dashboard
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
