export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          biggest_crypto_loss: string | null
          biggest_crypto_win: string | null
          bio: string | null
          created_at: string
          crypto_experience: string | null
          crypto_motto: string | null
          date_of_birth: string | null
          defi_protocols: string[] | null
          degen_score: number | null
          email: string | null
          favorite_crypto: string | null
          full_name: string | null
          gender_identity: string | null
          id: string
          interests: string[] | null
          location: string | null
          looking_for: string | null
          looking_for_gender: string[] | null
          meme_coin_holdings: string[] | null
          nft_collections: string[] | null
          portfolio_size: string | null
          profile_completed: boolean | null
          relationship_type: string | null
          sexual_orientation: string | null
          trading_style: string | null
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          biggest_crypto_loss?: string | null
          biggest_crypto_win?: string | null
          bio?: string | null
          created_at?: string
          crypto_experience?: string | null
          crypto_motto?: string | null
          date_of_birth?: string | null
          defi_protocols?: string[] | null
          degen_score?: number | null
          email?: string | null
          favorite_crypto?: string | null
          full_name?: string | null
          gender_identity?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          looking_for?: string | null
          looking_for_gender?: string[] | null
          meme_coin_holdings?: string[] | null
          nft_collections?: string[] | null
          portfolio_size?: string | null
          profile_completed?: boolean | null
          relationship_type?: string | null
          sexual_orientation?: string | null
          trading_style?: string | null
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          biggest_crypto_loss?: string | null
          biggest_crypto_win?: string | null
          bio?: string | null
          created_at?: string
          crypto_experience?: string | null
          crypto_motto?: string | null
          date_of_birth?: string | null
          defi_protocols?: string[] | null
          degen_score?: number | null
          email?: string | null
          favorite_crypto?: string | null
          full_name?: string | null
          gender_identity?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          looking_for?: string | null
          looking_for_gender?: string[] | null
          meme_coin_holdings?: string[] | null
          nft_collections?: string[] | null
          portfolio_size?: string | null
          profile_completed?: boolean | null
          relationship_type?: string | null
          sexual_orientation?: string | null
          trading_style?: string | null
          updated_at?: string
          wallet_address?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
