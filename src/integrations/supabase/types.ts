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
      suppliers: {
        Row: {
          address: string | null
          business_stability_longevity: number | null
          certifications: string[] | null
          communication_effectiveness: number | null
          contact_person: string
          contract_compliance_history: number | null
          created_at: string | null
          defect_rate_quality_control: number | null
          description: string | null
          email: string
          emergency_response_capability: number | null
          environmental_certifications: number | null
          established_year: number | null
          industry: string
          lead_time_competitiveness: number | null
          name: string
          ontime_delivery_performance: number | null
          overall_score: number | null
          payment_terms_flexibility: number | null
          phone: string
          product_specifications_adherence: number | null
          quality_certification_score: number | null
          social_responsibility_programs: number | null
          status: string
          sustainable_sourcing_practices: number | null
          total_cost_ownership: number | null
          unit_pricing_competitiveness: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_stability_longevity?: number | null
          certifications?: string[] | null
          communication_effectiveness?: number | null
          contact_person: string
          contract_compliance_history?: number | null
          created_at?: string | null
          defect_rate_quality_control?: number | null
          description?: string | null
          email: string
          emergency_response_capability?: number | null
          environmental_certifications?: number | null
          established_year?: number | null
          industry: string
          lead_time_competitiveness?: number | null
          name: string
          ontime_delivery_performance?: number | null
          overall_score?: number | null
          payment_terms_flexibility?: number | null
          phone: string
          product_specifications_adherence?: number | null
          quality_certification_score?: number | null
          social_responsibility_programs?: number | null
          status?: string
          sustainable_sourcing_practices?: number | null
          total_cost_ownership?: number | null
          unit_pricing_competitiveness?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_stability_longevity?: number | null
          certifications?: string[] | null
          communication_effectiveness?: number | null
          contact_person?: string
          contract_compliance_history?: number | null
          created_at?: string | null
          defect_rate_quality_control?: number | null
          description?: string | null
          email?: string
          emergency_response_capability?: number | null
          environmental_certifications?: number | null
          established_year?: number | null
          industry?: string
          lead_time_competitiveness?: number | null
          name?: string
          ontime_delivery_performance?: number | null
          overall_score?: number | null
          payment_terms_flexibility?: number | null
          phone?: string
          product_specifications_adherence?: number | null
          quality_certification_score?: number | null
          social_responsibility_programs?: number | null
          status?: string
          sustainable_sourcing_practices?: number | null
          total_cost_ownership?: number | null
          unit_pricing_competitiveness?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_overall_score: {
        Args: { supplier_row: Database["public"]["Tables"]["suppliers"]["Row"] }
        Returns: number
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
