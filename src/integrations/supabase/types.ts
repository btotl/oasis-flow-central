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
      app_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          related_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date: string
          event_time?: string | null
          event_type?: string
          id?: string
          related_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          related_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      consignment_items: {
        Row: {
          consignor_id: string | null
          cost_per_item: number
          created_at: string | null
          id: string
          item_name: string
          profit_per_item: number
          quantity: number
          quantity_sold: number
          updated_at: string | null
        }
        Insert: {
          consignor_id?: string | null
          cost_per_item?: number
          created_at?: string | null
          id?: string
          item_name: string
          profit_per_item?: number
          quantity?: number
          quantity_sold?: number
          updated_at?: string | null
        }
        Update: {
          consignor_id?: string | null
          cost_per_item?: number
          created_at?: string | null
          id?: string
          item_name?: string
          profit_per_item?: number
          quantity?: number
          quantity_sold?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consignment_items_consignor_id_fkey"
            columns: ["consignor_id"]
            isOneToOne: false
            referencedRelation: "consignors"
            referencedColumns: ["id"]
          },
        ]
      }
      consignors: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_credit: {
        Row: {
          created_at: string | null
          created_by_name: string | null
          credit_amount: number
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          updated_at: string | null
          updated_by_name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_name?: string | null
          credit_amount?: number
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          updated_by_name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_name?: string | null
          credit_amount?: number
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          updated_by_name?: string | null
        }
        Relationships: []
      }
      customer_loyalty: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          points_balance: number
          total_points_earned: number
          total_points_redeemed: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          points_balance?: number
          total_points_earned?: number
          total_points_redeemed?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          points_balance?: number
          total_points_earned?: number
          total_points_redeemed?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_requests: {
        Row: {
          assigned_to: string | null
          assigned_to_name: string | null
          botanical_name: string | null
          category: string | null
          common_name: string
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          requested_by_name: string | null
          size_specs: string | null
          status: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          assigned_to?: string | null
          assigned_to_name?: string | null
          botanical_name?: string | null
          category?: string | null
          common_name: string
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          requested_by_name?: string | null
          size_specs?: string | null
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          assigned_to?: string | null
          assigned_to_name?: string | null
          botanical_name?: string | null
          category?: string | null
          common_name?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          requested_by_name?: string | null
          size_specs?: string | null
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_notes: {
        Row: {
          archived: boolean | null
          author_id: string
          author_name: string | null
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          author_id: string
          author_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          author_id?: string
          author_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_cards: {
        Row: {
          amount: number
          balance: number
          card_number: string
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          balance: number
          card_number: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          balance?: number
          card_number?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      important_messages: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "important_messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      laybys: {
        Row: {
          created_at: string | null
          created_by_name: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          items: string
          layby_number: string
          paid_amount: number | null
          remaining_amount: number
          status: string | null
          total_amount: number
          updated_at: string | null
          updated_by_name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_name?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          items: string
          layby_number: string
          paid_amount?: number | null
          remaining_amount: number
          status?: string | null
          total_amount: number
          updated_at?: string | null
          updated_by_name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_name?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          items?: string
          layby_number?: string
          paid_amount?: number | null
          remaining_amount?: number
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          updated_by_name?: string | null
        }
        Relationships: []
      }
      layout_configurations: {
        Row: {
          created_at: string | null
          dashboard_type: string
          id: string
          layout_config: Json
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dashboard_type?: string
          id?: string
          layout_config?: Json
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dashboard_type?: string
          id?: string
          layout_config?: Json
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          description: string | null
          id: string
          points_change: number
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          points_change: number
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          points_change?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_loyalty"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          created_by_name: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          created_by_name: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          created_by_name?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      message_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          employee_id: string | null
          id: string
          message_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          employee_id?: string | null
          id?: string
          message_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          employee_id?: string | null
          id?: string
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_acknowledgments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_acknowledgments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "important_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          after_image_url: string | null
          assigned_to: string | null
          before_image_url: string | null
          completed: boolean | null
          completed_by_name: string | null
          created_at: string | null
          created_by_name: string | null
          description: string | null
          due_date: string | null
          hidden_until: string | null
          id: string
          image_url: string | null
          priority: string | null
          title: string
          updated_at: string | null
          urgent: boolean | null
        }
        Insert: {
          after_image_url?: string | null
          assigned_to?: string | null
          before_image_url?: string | null
          completed?: boolean | null
          completed_by_name?: string | null
          created_at?: string | null
          created_by_name?: string | null
          description?: string | null
          due_date?: string | null
          hidden_until?: string | null
          id?: string
          image_url?: string | null
          priority?: string | null
          title: string
          updated_at?: string | null
          urgent?: boolean | null
        }
        Update: {
          after_image_url?: string | null
          assigned_to?: string | null
          before_image_url?: string | null
          completed?: boolean | null
          completed_by_name?: string | null
          created_at?: string | null
          created_by_name?: string | null
          description?: string | null
          due_date?: string | null
          hidden_until?: string | null
          id?: string
          image_url?: string | null
          priority?: string | null
          title?: string
          updated_at?: string | null
          urgent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string | null
          date: string
          employee_id: string
          employee_name: string | null
          id: string
          total_hours: number | null
          updated_at: string | null
        }
        Insert: {
          clock_in: string
          clock_out?: string | null
          created_at?: string | null
          date: string
          employee_id: string
          employee_name?: string | null
          id?: string
          total_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string
          employee_name?: string | null
          id?: string
          total_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          amount: number
          code: string
          created_at: string | null
          created_by_name: string | null
          customer_email: string | null
          customer_name: string
          expiry_date: string | null
          from_name: string | null
          id: string
          status: string | null
          updated_at: string | null
          updated_by_name: string | null
          used_amount: number | null
        }
        Insert: {
          amount: number
          code: string
          created_at?: string | null
          created_by_name?: string | null
          customer_email?: string | null
          customer_name: string
          expiry_date?: string | null
          from_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          updated_by_name?: string | null
          used_amount?: number | null
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string | null
          created_by_name?: string | null
          customer_email?: string | null
          customer_name?: string
          expiry_date?: string | null
          from_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          updated_by_name?: string | null
          used_amount?: number | null
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
