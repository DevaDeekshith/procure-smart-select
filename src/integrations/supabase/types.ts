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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      deleted_patients: {
        Row: {
          can_restore: boolean | null
          created_at: string | null
          deleted_by: string | null
          deletion_date: string | null
          deletion_reason: string | null
          id: string
          original_patient_id: string
          patient_data: Json
          restore_deadline: string | null
        }
        Insert: {
          can_restore?: boolean | null
          created_at?: string | null
          deleted_by?: string | null
          deletion_date?: string | null
          deletion_reason?: string | null
          id?: string
          original_patient_id: string
          patient_data: Json
          restore_deadline?: string | null
        }
        Update: {
          can_restore?: boolean | null
          created_at?: string | null
          deleted_by?: string | null
          deletion_date?: string | null
          deletion_reason?: string | null
          id?: string
          original_patient_id?: string
          patient_data?: Json
          restore_deadline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deleted_patients_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      deletion_requests: {
        Row: {
          approval_reason: string | null
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          expires_at: string | null
          id: string
          patient_id: string | null
          priority: string | null
          request_reason: string
          requested_at: string | null
          requested_by: string | null
          status: string | null
        }
        Insert: {
          approval_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          expires_at?: string | null
          id?: string
          patient_id?: string | null
          priority?: string | null
          request_reason: string
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
        }
        Update: {
          approval_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          expires_at?: string | null
          id?: string
          patient_id?: string | null
          priority?: string | null
          request_reason?: string
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deletion_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deletion_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deletion_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_deletion_audit: {
        Row: {
          admin_user_id: string | null
          admin_username: string
          compliance_notes: string | null
          created_at: string | null
          deletion_type: string
          id: string
          ip_address: unknown | null
          patient_id: string
          patient_name: string
          reason: string | null
          user_agent: string | null
        }
        Insert: {
          admin_user_id?: string | null
          admin_username: string
          compliance_notes?: string | null
          created_at?: string | null
          deletion_type: string
          id?: string
          ip_address?: unknown | null
          patient_id: string
          patient_name: string
          reason?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string | null
          admin_username?: string
          compliance_notes?: string | null
          created_at?: string | null
          deletion_type?: string
          id?: string
          ip_address?: unknown | null
          patient_id?: string
          patient_name?: string
          reason?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_deletion_audit_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admission_date: string | null
          age: number
          assigned_bed_id: string | null
          assigned_nurse: string | null
          assigned_room: string | null
          attending_physician: string
          created_at: string | null
          critical_alerts: string[] | null
          current_status: string | null
          deleted_at: string | null
          deleted_by: string | null
          diagnosis: string
          discharge_date: string | null
          expected_stay_days: number | null
          gender: string
          id: string
          is_deleted: boolean | null
          medications: string[] | null
          name: string
          patient_id: string
          special_requirements: string[] | null
          transfer_history: Json | null
          treatment_plan: string | null
          updated_at: string | null
          urgency_level: string
        }
        Insert: {
          admission_date?: string | null
          age: number
          assigned_bed_id?: string | null
          assigned_nurse?: string | null
          assigned_room?: string | null
          attending_physician: string
          created_at?: string | null
          critical_alerts?: string[] | null
          current_status?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          diagnosis: string
          discharge_date?: string | null
          expected_stay_days?: number | null
          gender: string
          id?: string
          is_deleted?: boolean | null
          medications?: string[] | null
          name: string
          patient_id: string
          special_requirements?: string[] | null
          transfer_history?: Json | null
          treatment_plan?: string | null
          updated_at?: string | null
          urgency_level: string
        }
        Update: {
          admission_date?: string | null
          age?: number
          assigned_bed_id?: string | null
          assigned_nurse?: string | null
          assigned_room?: string | null
          attending_physician?: string
          created_at?: string | null
          critical_alerts?: string[] | null
          current_status?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          diagnosis?: string
          discharge_date?: string | null
          expected_stay_days?: number | null
          gender?: string
          id?: string
          is_deleted?: boolean | null
          medications?: string[] | null
          name?: string
          patient_id?: string
          special_requirements?: string[] | null
          transfer_history?: Json | null
          treatment_plan?: string | null
          updated_at?: string | null
          urgency_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      authenticate_admin: {
        Args: { p_username: string; p_password: string }
        Returns: {
          user_id: string
          username: string
          role: string
          is_authenticated: boolean
        }[]
      }
      calculate_overall_score: {
        Args: { supplier_row: Database["public"]["Tables"]["suppliers"]["Row"] }
        Returns: number
      }
      cleanup_expired_deletion_requests: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_deletion_audit_trail: {
        Args: { p_patient_id?: string; p_limit?: number }
        Returns: {
          audit_id: string
          patient_id: string
          patient_name: string
          deletion_type: string
          admin_username: string
          reason: string
          created_at: string
          compliance_notes: string
        }[]
      }
      restore_deleted_patient: {
        Args: {
          p_patient_id: string
          p_admin_user_id: string
          p_admin_username: string
          p_reason?: string
        }
        Returns: {
          success: boolean
          message: string
          audit_id: string
        }[]
      }
      soft_delete_patient: {
        Args: {
          p_patient_id: string
          p_admin_user_id: string
          p_admin_username: string
          p_reason?: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: {
          success: boolean
          message: string
          audit_id: string
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
