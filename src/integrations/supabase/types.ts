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
      ai_interactions: {
        Row: {
          complaint_text: string
          created_at: string | null
          gemini_reasoning: string | null
          gemini_response: string | null
          gemma_classifications: Json | null
          gemma_reasoning: string | null
          id: string
          search_results: Json | null
          session_id: string
          user_id: string
        }
        Insert: {
          complaint_text: string
          created_at?: string | null
          gemini_reasoning?: string | null
          gemini_response?: string | null
          gemma_classifications?: Json | null
          gemma_reasoning?: string | null
          id?: string
          search_results?: Json | null
          session_id: string
          user_id: string
        }
        Update: {
          complaint_text?: string
          created_at?: string | null
          gemini_reasoning?: string | null
          gemini_response?: string | null
          gemma_classifications?: Json | null
          gemma_reasoning?: string | null
          id?: string
          search_results?: Json | null
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          classifications: Json | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          sender: string
          session_id: string
        }
        Insert: {
          classifications?: Json | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          sender: string
          session_id: string
        }
        Update: {
          classifications?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          sender?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avg_satisfaction_rating: number | null
          complaint_count: number | null
          created_at: string | null
          email: string | null
          id: string
          is_aggressive_tendency: boolean | null
          is_chronic_complainer: boolean | null
          name: string | null
          total_purchase_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_satisfaction_rating?: number | null
          complaint_count?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_aggressive_tendency?: boolean | null
          is_chronic_complainer?: boolean | null
          name?: string | null
          total_purchase_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_satisfaction_rating?: number | null
          complaint_count?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_aggressive_tendency?: boolean | null
          is_chronic_complainer?: boolean | null
          name?: string | null
          total_purchase_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      simulated_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_history: {
        Row: {
          asin_review: string | null
          author: string | null
          average_rating: number | null
          bought_together: Json | null
          bought_together_str: string | null
          categories: Json | null
          categories_str: string | null
          complaint_body_text: string | null
          complaint_helpful_votes: number | null
          complaint_rating_given: number | null
          complaint_title_text: string | null
          complaint_verified_purchase: boolean | null
          created_at: string | null
          description: string | null
          description_str: string | null
          details: Json | null
          features: Json | null
          features_str: string | null
          helpful_vote_review: number | null
          id: string
          image_urls_str: string | null
          images: Json | null
          images_review: Json | null
          inferred_complaint_driver: string | null
          main_category: string | null
          parent_asin: string | null
          price: number | null
          product_asin_display: string | null
          product_avg_rating: number | null
          product_features: string | null
          product_main_category: string | null
          product_price_display: string | null
          product_price_numeric: number | null
          product_rating_number: number | null
          product_store: string | null
          product_sub_category: string | null
          product_title: string | null
          rating_number: number | null
          rating_review: number | null
          store: string | null
          subtitle: string | null
          text_review: string | null
          text_review_cleaned: string | null
          timestamp_review: number | null
          timestamp_review_dt: string | null
          title: string | null
          title_review: string | null
          title_review_cleaned: string | null
          user_id: string
          verified_purchase_review: boolean | null
          videos: Json | null
        }
        Insert: {
          asin_review?: string | null
          author?: string | null
          average_rating?: number | null
          bought_together?: Json | null
          bought_together_str?: string | null
          categories?: Json | null
          categories_str?: string | null
          complaint_body_text?: string | null
          complaint_helpful_votes?: number | null
          complaint_rating_given?: number | null
          complaint_title_text?: string | null
          complaint_verified_purchase?: boolean | null
          created_at?: string | null
          description?: string | null
          description_str?: string | null
          details?: Json | null
          features?: Json | null
          features_str?: string | null
          helpful_vote_review?: number | null
          id?: string
          image_urls_str?: string | null
          images?: Json | null
          images_review?: Json | null
          inferred_complaint_driver?: string | null
          main_category?: string | null
          parent_asin?: string | null
          price?: number | null
          product_asin_display?: string | null
          product_avg_rating?: number | null
          product_features?: string | null
          product_main_category?: string | null
          product_price_display?: string | null
          product_price_numeric?: number | null
          product_rating_number?: number | null
          product_store?: string | null
          product_sub_category?: string | null
          product_title?: string | null
          rating_number?: number | null
          rating_review?: number | null
          store?: string | null
          subtitle?: string | null
          text_review?: string | null
          text_review_cleaned?: string | null
          timestamp_review?: number | null
          timestamp_review_dt?: string | null
          title?: string | null
          title_review?: string | null
          title_review_cleaned?: string | null
          user_id: string
          verified_purchase_review?: boolean | null
          videos?: Json | null
        }
        Update: {
          asin_review?: string | null
          author?: string | null
          average_rating?: number | null
          bought_together?: Json | null
          bought_together_str?: string | null
          categories?: Json | null
          categories_str?: string | null
          complaint_body_text?: string | null
          complaint_helpful_votes?: number | null
          complaint_rating_given?: number | null
          complaint_title_text?: string | null
          complaint_verified_purchase?: boolean | null
          created_at?: string | null
          description?: string | null
          description_str?: string | null
          details?: Json | null
          features?: Json | null
          features_str?: string | null
          helpful_vote_review?: number | null
          id?: string
          image_urls_str?: string | null
          images?: Json | null
          images_review?: Json | null
          inferred_complaint_driver?: string | null
          main_category?: string | null
          parent_asin?: string | null
          price?: number | null
          product_asin_display?: string | null
          product_avg_rating?: number | null
          product_features?: string | null
          product_main_category?: string | null
          product_price_display?: string | null
          product_price_numeric?: number | null
          product_rating_number?: number | null
          product_store?: string | null
          product_sub_category?: string | null
          product_title?: string | null
          rating_number?: number | null
          rating_review?: number | null
          store?: string | null
          subtitle?: string | null
          text_review?: string | null
          text_review_cleaned?: string | null
          timestamp_review?: number | null
          timestamp_review_dt?: string | null
          title?: string | null
          title_review?: string | null
          title_review_cleaned?: string | null
          user_id?: string
          verified_purchase_review?: boolean | null
          videos?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_transactions_text: {
        Args: {
          search_query: string
          user_filter?: string
          category_filter?: string
          limit_count?: number
        }
        Returns: {
          id: string
          user_id: string
          complaint_body_text: string
          inferred_complaint_driver: string
          rating_review: number
          timestamp_review_dt: string
          product_title: string
        }[]
      }
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
