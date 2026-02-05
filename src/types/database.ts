export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdraw' | 'transfer' | 'admin_credit' | 'admin_debit'
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          description: string | null
          reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdraw' | 'transfer' | 'admin_credit' | 'admin_debit'
          amount: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          description?: string | null
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdraw' | 'transfer' | 'admin_credit' | 'admin_debit'
          amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          description?: string | null
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          id: string
          admin_id: string
          action_type: 'credit' | 'debit' | 'profile_view'
          target_user_id: string | null
          details: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action_type: 'credit' | 'debit' | 'profile_view'
          target_user_id?: string | null
          details?: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action_type?: 'credit' | 'debit' | 'profile_view'
          target_user_id?: string | null
          details?: Record<string, unknown>
          created_at?: string
        }
        Relationships: []
      }
      crypto_options: {
        Row: {
          id: string
          name: string
          symbol: string
          wallet_address: string
          network: string
          icon_url: string | null
          is_enabled: boolean
          min_deposit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          symbol: string
          wallet_address: string
          network: string
          icon_url?: string | null
          is_enabled?: boolean
          min_deposit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          symbol?: string
          wallet_address?: string
          network?: string
          icon_url?: string | null
          is_enabled?: boolean
          min_deposit?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          user_id: string | null
          guest_session_id: string | null
          status: 'open' | 'closed' | 'archived'
          assigned_admin_id: string | null
          last_message_at: string
          guest_name: string | null
          guest_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          status?: 'open' | 'closed' | 'archived'
          assigned_admin_id?: string | null
          last_message_at?: string
          guest_name?: string | null
          guest_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          status?: 'open' | 'closed' | 'archived'
          assigned_admin_id?: string | null
          last_message_at?: string
          guest_name?: string | null
          guest_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'user' | 'guest' | 'admin' | 'system'
          sender_id: string | null
          content: string
          message_type: 'text' | 'image' | 'file' | 'system'
          is_read: boolean
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: 'user' | 'guest' | 'admin' | 'system'
          sender_id?: string | null
          content: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          is_read?: boolean
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: 'user' | 'guest' | 'admin' | 'system'
          sender_id?: string | null
          content?: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          is_read?: boolean
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      promo_banners: {
        Row: {
          id: string
          image_url: string
          storage_path: string
          title: string | null
          link_url: string | null
          display_order: number
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          storage_path: string
          title?: string | null
          link_url?: string | null
          display_order?: number
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          storage_path?: string
          title?: string | null
          link_url?: string | null
          display_order?: number
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Wallet = Database['public']['Tables']['wallets']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type AdminAuditLog = Database['public']['Tables']['admin_audit_logs']['Row']
export type CryptoOption = Database['public']['Tables']['crypto_options']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type PromoBanner = Database['public']['Tables']['promo_banners']['Row']

export interface UserWithWallet extends Profile {
  wallets: Wallet[]
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
  profile?: Profile | null
}
