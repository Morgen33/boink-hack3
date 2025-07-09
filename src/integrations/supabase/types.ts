export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_compatibility_scores: {
        Row: {
          communication_compatibility: number | null
          compatibility_score: number
          created_at: string
          crypto_alignment: number | null
          id: string
          personality_match: number | null
          shared_values_score: number | null
          target_user_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_compatibility?: number | null
          compatibility_score: number
          created_at?: string
          crypto_alignment?: number | null
          id?: string
          personality_match?: number | null
          shared_values_score?: number | null
          target_user_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_compatibility?: number | null
          compatibility_score?: number
          created_at?: string
          crypto_alignment?: number | null
          id?: string
          personality_match?: number | null
          shared_values_score?: number | null
          target_user_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_compatibility_scores_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_compatibility_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          updated_at: string
          user1_id: string
          user1_unread_count: number | null
          user2_id: string
          user2_unread_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          updated_at?: string
          user1_id: string
          user1_unread_count?: number | null
          user2_id: string
          user2_unread_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          updated_at?: string
          user1_id?: string
          user1_unread_count?: number | null
          user2_id?: string
          user2_unread_count?: number | null
        }
        Relationships: []
      }
      daily_matches: {
        Row: {
          compatibility_score: number
          created_at: string
          expires_at: string
          generated_at: string
          id: string
          liked: boolean | null
          match_breakdown: Json | null
          matched_profile_id: string
          user_id: string
          viewed: boolean
        }
        Insert: {
          compatibility_score: number
          created_at?: string
          expires_at?: string
          generated_at?: string
          id?: string
          liked?: boolean | null
          match_breakdown?: Json | null
          matched_profile_id: string
          user_id: string
          viewed?: boolean
        }
        Update: {
          compatibility_score?: number
          created_at?: string
          expires_at?: string
          generated_at?: string
          id?: string
          liked?: boolean | null
          match_breakdown?: Json | null
          matched_profile_id?: string
          user_id?: string
          viewed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "daily_matches_matched_profile_id_fkey"
            columns: ["matched_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_history: {
        Row: {
          id: string
          shown_at: string
          shown_profile_id: string
          user_id: string
        }
        Insert: {
          id?: string
          shown_at?: string
          shown_profile_id: string
          user_id: string
        }
        Update: {
          id?: string
          shown_at?: string
          shown_profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_history_shown_profile_id_fkey"
            columns: ["shown_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_insights: {
        Row: {
          ai_confidence: number | null
          compatibility_explanation: string
          conversation_starters: string[] | null
          created_at: string
          crypto_common_ground: string | null
          id: string
          personality_highlights: string | null
          shared_interests: string[] | null
          target_user_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          compatibility_explanation: string
          conversation_starters?: string[] | null
          created_at?: string
          crypto_common_ground?: string | null
          id?: string
          personality_highlights?: string | null
          shared_interests?: string[] | null
          target_user_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          compatibility_explanation?: string
          conversation_starters?: string[] | null
          created_at?: string
          crypto_common_ground?: string | null
          id?: string
          personality_highlights?: string | null
          shared_interests?: string[] | null
          target_user_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_insights_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_embeddings: {
        Row: {
          communication_style: string | null
          created_at: string
          crypto_philosophy: string | null
          id: string
          personality_traits: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          created_at?: string
          crypto_philosophy?: string | null
          id?: string
          personality_traits?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          created_at?: string
          crypto_philosophy?: string | null
          id?: string
          personality_traits?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_embeddings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_embeddings_backup: {
        Row: {
          communication_style: string | null
          created_at: string | null
          crypto_philosophy: string | null
          id: string | null
          personality_traits: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          communication_style?: string | null
          created_at?: string | null
          crypto_philosophy?: string | null
          id?: string | null
          personality_traits?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          communication_style?: string | null
          created_at?: string | null
          crypto_philosophy?: string | null
          id?: string | null
          personality_traits?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          biggest_crypto_loss: string | null
          biggest_crypto_win: string | null
          bio: string | null
          company_name: string | null
          created_at: string
          crypto_experience: string | null
          crypto_motto: string | null
          date_of_birth: string | null
          dating_profile_completed: boolean | null
          defi_protocols: string[] | null
          degen_score: number | null
          email: string | null
          expertise_areas: string[] | null
          favorite_crypto: string | null
          full_name: string | null
          gender_identity: string | null
          id: string
          industry: string | null
          interests: string[] | null
          job_title: string | null
          linkedin_url: string | null
          location: string | null
          looking_for: string | null
          looking_for_gender: string[] | null
          looking_for_networking: string[] | null
          main_photo_index: number | null
          meme_coin_holdings: string[] | null
          networking_completed: boolean | null
          networking_goals: string[] | null
          networking_profile_completed: boolean | null
          nft_collections: string[] | null
          photo_urls: string[] | null
          platform_intent:
            | Database["public"]["Enums"]["platform_intent_type"]
            | null
          portfolio_size: string | null
          professional_bio: string | null
          profile_completed: boolean | null
          relationship_type: string | null
          sexual_orientation: string | null
          trading_style: string | null
          updated_at: string
          username: string | null
          wallet_address: string | null
          website_url: string | null
          years_in_crypto: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          biggest_crypto_loss?: string | null
          biggest_crypto_win?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          crypto_experience?: string | null
          crypto_motto?: string | null
          date_of_birth?: string | null
          dating_profile_completed?: boolean | null
          defi_protocols?: string[] | null
          degen_score?: number | null
          email?: string | null
          expertise_areas?: string[] | null
          favorite_crypto?: string | null
          full_name?: string | null
          gender_identity?: string | null
          id: string
          industry?: string | null
          interests?: string[] | null
          job_title?: string | null
          linkedin_url?: string | null
          location?: string | null
          looking_for?: string | null
          looking_for_gender?: string[] | null
          looking_for_networking?: string[] | null
          main_photo_index?: number | null
          meme_coin_holdings?: string[] | null
          networking_completed?: boolean | null
          networking_goals?: string[] | null
          networking_profile_completed?: boolean | null
          nft_collections?: string[] | null
          photo_urls?: string[] | null
          platform_intent?:
            | Database["public"]["Enums"]["platform_intent_type"]
            | null
          portfolio_size?: string | null
          professional_bio?: string | null
          profile_completed?: boolean | null
          relationship_type?: string | null
          sexual_orientation?: string | null
          trading_style?: string | null
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
          website_url?: string | null
          years_in_crypto?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          biggest_crypto_loss?: string | null
          biggest_crypto_win?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string
          crypto_experience?: string | null
          crypto_motto?: string | null
          date_of_birth?: string | null
          dating_profile_completed?: boolean | null
          defi_protocols?: string[] | null
          degen_score?: number | null
          email?: string | null
          expertise_areas?: string[] | null
          favorite_crypto?: string | null
          full_name?: string | null
          gender_identity?: string | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          job_title?: string | null
          linkedin_url?: string | null
          location?: string | null
          looking_for?: string | null
          looking_for_gender?: string[] | null
          looking_for_networking?: string[] | null
          main_photo_index?: number | null
          meme_coin_holdings?: string[] | null
          networking_completed?: boolean | null
          networking_goals?: string[] | null
          networking_profile_completed?: boolean | null
          nft_collections?: string[] | null
          photo_urls?: string[] | null
          platform_intent?:
            | Database["public"]["Enums"]["platform_intent_type"]
            | null
          portfolio_size?: string | null
          professional_bio?: string | null
          profile_completed?: boolean | null
          relationship_type?: string | null
          sexual_orientation?: string | null
          trading_style?: string | null
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
          website_url?: string | null
          years_in_crypto?: number | null
        }
        Relationships: []
      }
      social_media_connections: {
        Row: {
          access_token: string | null
          connected_at: string
          id: string
          oauth_provider: string | null
          oauth_provider_id: string | null
          platform: string
          profile_url: string | null
          refresh_token: string | null
          updated_at: string
          user_id: string
          username: string
          verified: boolean | null
        }
        Insert: {
          access_token?: string | null
          connected_at?: string
          id?: string
          oauth_provider?: string | null
          oauth_provider_id?: string | null
          platform: string
          profile_url?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id: string
          username: string
          verified?: boolean | null
        }
        Update: {
          access_token?: string | null
          connected_at?: string
          id?: string
          oauth_provider?: string | null
          oauth_provider_id?: string | null
          platform?: string
          profile_url?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
          updated_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
          updated_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_likes: {
        Row: {
          created_at: string
          id: string
          is_mutual_match: boolean
          liked_profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_mutual_match?: boolean
          liked_profile_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_mutual_match?: boolean
          liked_profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_likes_liked_profile_id_fkey"
            columns: ["liked_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_age_from_birthdate: {
        Args: { birth_date: string }
        Returns: number
      }
      cleanup_expired_matches: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_or_create_conversation: {
        Args: { user1: string; user2: string }
        Returns: string
      }
      mark_messages_as_read: {
        Args: { conversation_uuid: string; reader_id: string }
        Returns: number
      }
    }
    Enums: {
      platform_intent_type: "dating" | "networking" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      platform_intent_type: ["dating", "networking", "both"],
    },
  },
} as const
