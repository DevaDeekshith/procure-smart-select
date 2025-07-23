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
      audit_logs: {
        Row: {
          action: string
          additional_data: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          patient_id: string | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          additional_data?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          patient_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          additional_data?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          patient_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          bed_id: string
          bed_number: string | null
          bed_type: string | null
          created_at: string | null
          current_patient_id: string | null
          daily_rate: number | null
          department_id: string
          equipment_attached: Json | null
          equipment_level: number | null
          fhir_location_id: string | null
          floor_number: number | null
          has_monitoring: boolean | null
          id: string
          is_isolation: boolean | null
          last_sanitized: string | null
          notes: string | null
          room_number: string | null
          sanitized_by: string | null
          special_requirements: string[] | null
          status: string
          updated_at: string | null
          ward_number: string | null
        }
        Insert: {
          bed_id: string
          bed_number?: string | null
          bed_type?: string | null
          created_at?: string | null
          current_patient_id?: string | null
          daily_rate?: number | null
          department_id: string
          equipment_attached?: Json | null
          equipment_level?: number | null
          fhir_location_id?: string | null
          floor_number?: number | null
          has_monitoring?: boolean | null
          id?: string
          is_isolation?: boolean | null
          last_sanitized?: string | null
          notes?: string | null
          room_number?: string | null
          sanitized_by?: string | null
          special_requirements?: string[] | null
          status?: string
          updated_at?: string | null
          ward_number?: string | null
        }
        Update: {
          bed_id?: string
          bed_number?: string | null
          bed_type?: string | null
          created_at?: string | null
          current_patient_id?: string | null
          daily_rate?: number | null
          department_id?: string
          equipment_attached?: Json | null
          equipment_level?: number | null
          fhir_location_id?: string | null
          floor_number?: number | null
          has_monitoring?: boolean | null
          id?: string
          is_isolation?: boolean | null
          last_sanitized?: string | null
          notes?: string | null
          room_number?: string | null
          sanitized_by?: string | null
          special_requirements?: string[] | null
          status?: string
          updated_at?: string | null
          ward_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beds_current_patient_id_fkey"
            columns: ["current_patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beds_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beds_sanitized_by_fkey"
            columns: ["sanitized_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
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
      departments: {
        Row: {
          capacity: number | null
          code: string
          contact_number: string | null
          created_at: string | null
          current_occupancy: number | null
          department_type: string | null
          description: string | null
          email: string | null
          floor_number: number | null
          head_of_department: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          code: string
          contact_number?: string | null
          created_at?: string | null
          current_occupancy?: number | null
          department_type?: string | null
          description?: string | null
          email?: string | null
          floor_number?: number | null
          head_of_department?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          code?: string
          contact_number?: string | null
          created_at?: string | null
          current_occupancy?: number | null
          department_type?: string | null
          description?: string | null
          email?: string | null
          floor_number?: number | null
          head_of_department?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_head"
            columns: ["head_of_department"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_kpis: {
        Row: {
          calculation_method: string | null
          category: string
          created_at: string | null
          data_source: string | null
          definition: string
          frequency: string | null
          id: string
          is_active: boolean | null
          kpi_name: string
          target_excellent: number | null
          target_good: number | null
          target_poor: number | null
          unit: string | null
          weight: number | null
        }
        Insert: {
          calculation_method?: string | null
          category: string
          created_at?: string | null
          data_source?: string | null
          definition: string
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          kpi_name: string
          target_excellent?: number | null
          target_good?: number | null
          target_poor?: number | null
          unit?: string | null
          weight?: number | null
        }
        Update: {
          calculation_method?: string | null
          category?: string
          created_at?: string | null
          data_source?: string | null
          definition?: string
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          kpi_name?: string
          target_excellent?: number | null
          target_good?: number | null
          target_poor?: number | null
          unit?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      fhir_resources: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          last_updated: string | null
          patient_id: string | null
          resource_data: Json
          resource_id: string
          resource_type: string
          status: string | null
          version_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated?: string | null
          patient_id?: string | null
          resource_data: Json
          resource_id: string
          resource_type: string
          status?: string | null
          version_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated?: string | null
          patient_id?: string | null
          resource_data?: Json
          resource_id?: string
          resource_type?: string
          status?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fhir_resources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fhir_resources_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_key_encrypted: string | null
          configuration: Json | null
          created_at: string | null
          endpoint_url: string | null
          error_log: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          name: string
          sync_status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          configuration?: Json | null
          created_at?: string | null
          endpoint_url?: string | null
          error_log?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name: string
          sync_status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          configuration?: Json | null
          created_at?: string | null
          endpoint_url?: string | null
          error_log?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name?: string
          sync_status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      medications: {
        Row: {
          administered_by: string | null
          contraindications: string | null
          created_at: string | null
          dosage: string
          end_date: string | null
          fhir_medication_id: string | null
          frequency: string
          generic_name: string | null
          id: string
          indication: string | null
          instructions: string | null
          medication_name: string
          patient_id: string
          pharmacy_notes: string | null
          prescribed_by: string | null
          route: string
          side_effects: string | null
          start_date: string
          status: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          administered_by?: string | null
          contraindications?: string | null
          created_at?: string | null
          dosage: string
          end_date?: string | null
          fhir_medication_id?: string | null
          frequency: string
          generic_name?: string | null
          id?: string
          indication?: string | null
          instructions?: string | null
          medication_name: string
          patient_id: string
          pharmacy_notes?: string | null
          prescribed_by?: string | null
          route: string
          side_effects?: string | null
          start_date: string
          status?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          administered_by?: string | null
          contraindications?: string | null
          created_at?: string | null
          dosage?: string
          end_date?: string | null
          fhir_medication_id?: string | null
          frequency?: string
          generic_name?: string | null
          id?: string
          indication?: string | null
          instructions?: string | null
          medication_name?: string
          patient_id?: string
          pharmacy_notes?: string | null
          prescribed_by?: string | null
          route?: string
          side_effects?: string | null
          start_date?: string
          status?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_administered_by_fkey"
            columns: ["administered_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_prescribed_by_fkey"
            columns: ["prescribed_by"]
            isOneToOne: false
            referencedRelation: "staff"
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
          allergies: string[] | null
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
          emergency_contact: Json | null
          expected_stay_days: number | null
          fhir_patient_id: string | null
          gender: string
          id: string
          insurance_info: Json | null
          is_deleted: boolean | null
          medications: string[] | null
          mrn: string | null
          name: string
          patient_id: string
          primary_care_physician: string | null
          special_requirements: string[] | null
          ssn_encrypted: string | null
          transfer_history: Json | null
          treatment_plan: string | null
          updated_at: string | null
          urgency_level: string
        }
        Insert: {
          admission_date?: string | null
          age: number
          allergies?: string[] | null
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
          emergency_contact?: Json | null
          expected_stay_days?: number | null
          fhir_patient_id?: string | null
          gender: string
          id?: string
          insurance_info?: Json | null
          is_deleted?: boolean | null
          medications?: string[] | null
          mrn?: string | null
          name: string
          patient_id: string
          primary_care_physician?: string | null
          special_requirements?: string[] | null
          ssn_encrypted?: string | null
          transfer_history?: Json | null
          treatment_plan?: string | null
          updated_at?: string | null
          urgency_level: string
        }
        Update: {
          admission_date?: string | null
          age?: number
          allergies?: string[] | null
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
          emergency_contact?: Json | null
          expected_stay_days?: number | null
          fhir_patient_id?: string | null
          gender?: string
          id?: string
          insurance_info?: Json | null
          is_deleted?: boolean | null
          medications?: string[] | null
          mrn?: string | null
          name?: string
          patient_id?: string
          primary_care_physician?: string | null
          special_requirements?: string[] | null
          ssn_encrypted?: string | null
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
          {
            foreignKeyName: "patients_primary_care_physician_fkey"
            columns: ["primary_care_physician"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures_schedule: {
        Row: {
          actual_duration: number | null
          anesthesia_type: string | null
          assisting_staff: string[] | null
          complications: string | null
          consent_obtained: boolean | null
          created_at: string | null
          department_id: string | null
          estimated_duration: number | null
          fhir_procedure_id: string | null
          id: string
          patient_id: string
          performed_by: string | null
          post_procedure_notes: string | null
          pre_procedure_notes: string | null
          priority: string | null
          procedure_code: string | null
          procedure_name: string
          room_number: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          anesthesia_type?: string | null
          assisting_staff?: string[] | null
          complications?: string | null
          consent_obtained?: boolean | null
          created_at?: string | null
          department_id?: string | null
          estimated_duration?: number | null
          fhir_procedure_id?: string | null
          id?: string
          patient_id: string
          performed_by?: string | null
          post_procedure_notes?: string | null
          pre_procedure_notes?: string | null
          priority?: string | null
          procedure_code?: string | null
          procedure_name: string
          room_number?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          anesthesia_type?: string | null
          assisting_staff?: string[] | null
          complications?: string | null
          consent_obtained?: boolean | null
          created_at?: string | null
          department_id?: string | null
          estimated_duration?: number | null
          fhir_procedure_id?: string | null
          id?: string
          patient_id?: string
          performed_by?: string | null
          post_procedure_notes?: string | null
          pre_procedure_notes?: string | null
          priority?: string | null
          procedure_code?: string | null
          procedure_name?: string
          room_number?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procedures_schedule_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_schedule_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_schedule_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      scans_tests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          critical_values: boolean | null
          department_id: string | null
          fhir_diagnostic_report_id: string | null
          id: string
          interpretation: string | null
          ordered_by: string | null
          patient_id: string
          performed_by: string | null
          priority: string | null
          report_url: string | null
          results_data: Json | null
          results_summary: string | null
          scheduled_at: string
          status: string | null
          test_category: string | null
          test_type: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          critical_values?: boolean | null
          department_id?: string | null
          fhir_diagnostic_report_id?: string | null
          id?: string
          interpretation?: string | null
          ordered_by?: string | null
          patient_id: string
          performed_by?: string | null
          priority?: string | null
          report_url?: string | null
          results_data?: Json | null
          results_summary?: string | null
          scheduled_at: string
          status?: string | null
          test_category?: string | null
          test_type: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          critical_values?: boolean | null
          department_id?: string | null
          fhir_diagnostic_report_id?: string | null
          id?: string
          interpretation?: string | null
          ordered_by?: string | null
          patient_id?: string
          performed_by?: string | null
          priority?: string | null
          report_url?: string | null
          results_data?: Json | null
          results_summary?: string | null
          scheduled_at?: string
          status?: string | null
          test_category?: string | null
          test_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scans_tests_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_tests_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_tests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_tests_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string | null
          department_id: string | null
          email: string
          emergency_contact: string | null
          fhir_practitioner_id: string | null
          first_name: string
          hire_date: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string
          license_number: string | null
          password_hash: string
          permissions: Json | null
          phone_number: string | null
          role: string
          specialization: string | null
          staff_id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          email: string
          emergency_contact?: string | null
          fhir_practitioner_id?: string | null
          first_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name: string
          license_number?: string | null
          password_hash: string
          permissions?: Json | null
          phone_number?: string | null
          role: string
          specialization?: string | null
          staff_id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          email?: string
          emergency_contact?: string | null
          fhir_practitioner_id?: string | null
          first_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string
          license_number?: string | null
          password_hash?: string
          permissions?: Json | null
          phone_number?: string | null
          role?: string
          specialization?: string | null
          staff_id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_audit_scores: {
        Row: {
          audit_date: string
          auditor_notes: string | null
          category: string
          created_at: string | null
          criterion_name: string
          description: string | null
          id: string
          improvement_actions: string | null
          max_score: number
          score: number
          subcategory: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          audit_date?: string
          auditor_notes?: string | null
          category: string
          created_at?: string | null
          criterion_name: string
          description?: string | null
          id?: string
          improvement_actions?: string | null
          max_score: number
          score: number
          subcategory?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          audit_date?: string
          auditor_notes?: string | null
          category?: string
          created_at?: string | null
          criterion_name?: string
          description?: string | null
          id?: string
          improvement_actions?: string | null
          max_score?: number
          score?: number
          subcategory?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_audit_scores_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_audit_scores_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_with_latest_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_evaluations: {
        Row: {
          annual_revenue: number | null
          certifications: string[] | null
          classification: string | null
          communication_score: number | null
          company_code: string
          compliance_status: string | null
          contact_person: string
          cost_reduction_score: number | null
          created_at: string | null
          defect_rate_score: number | null
          email: string
          emergency_response_score: number | null
          employee_count: number | null
          id: string
          industry: string
          innovation_score: number | null
          last_audit_date: string | null
          lead_time_score: number | null
          location: string
          name: string
          next_audit_date: string | null
          order_ack_score: number | null
          otd_performance: number | null
          overall_score: number | null
          payment_terms_score: number | null
          phone: string | null
          ppm_score: number | null
          pricing_score: number | null
          quality_certification_score: number | null
          responsiveness_score: number | null
          risk_level: string | null
          technical_support_score: number | null
          updated_at: string | null
          value_engineering_score: number | null
          website: string | null
        }
        Insert: {
          annual_revenue?: number | null
          certifications?: string[] | null
          classification?: string | null
          communication_score?: number | null
          company_code: string
          compliance_status?: string | null
          contact_person: string
          cost_reduction_score?: number | null
          created_at?: string | null
          defect_rate_score?: number | null
          email: string
          emergency_response_score?: number | null
          employee_count?: number | null
          id?: string
          industry: string
          innovation_score?: number | null
          last_audit_date?: string | null
          lead_time_score?: number | null
          location: string
          name: string
          next_audit_date?: string | null
          order_ack_score?: number | null
          otd_performance?: number | null
          overall_score?: number | null
          payment_terms_score?: number | null
          phone?: string | null
          ppm_score?: number | null
          pricing_score?: number | null
          quality_certification_score?: number | null
          responsiveness_score?: number | null
          risk_level?: string | null
          technical_support_score?: number | null
          updated_at?: string | null
          value_engineering_score?: number | null
          website?: string | null
        }
        Update: {
          annual_revenue?: number | null
          certifications?: string[] | null
          classification?: string | null
          communication_score?: number | null
          company_code?: string
          compliance_status?: string | null
          contact_person?: string
          cost_reduction_score?: number | null
          created_at?: string | null
          defect_rate_score?: number | null
          email?: string
          emergency_response_score?: number | null
          employee_count?: number | null
          id?: string
          industry?: string
          innovation_score?: number | null
          last_audit_date?: string | null
          lead_time_score?: number | null
          location?: string
          name?: string
          next_audit_date?: string | null
          order_ack_score?: number | null
          otd_performance?: number | null
          overall_score?: number | null
          payment_terms_score?: number | null
          phone?: string | null
          ppm_score?: number | null
          pricing_score?: number | null
          quality_certification_score?: number | null
          responsiveness_score?: number | null
          risk_level?: string | null
          technical_support_score?: number | null
          updated_at?: string | null
          value_engineering_score?: number | null
          website?: string | null
        }
        Relationships: []
      }
      supplier_order_flows: {
        Row: {
          category: string
          created_at: string | null
          id: string
          order_count: number
          order_value: number
          period_end: string
          period_start: string
          supplier_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          order_count: number
          order_value: number
          period_end: string
          period_start: string
          supplier_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          order_count?: number
          order_value?: number
          period_end?: string
          period_start?: string
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_order_flows_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_order_flows_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_with_latest_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_performance: {
        Row: {
          avg_delay_days: number | null
          communication_score: number | null
          cost_score: number | null
          created_at: string
          delivery_score: number | null
          id: string
          innovation_score: number | null
          oa_accuracy_percent: number | null
          oa_response_hours: number | null
          otd_percentage: number | null
          ppm_defects: number | null
          quality_score: number | null
          reporting_period: string
          supplier_name: string
          updated_at: string
        }
        Insert: {
          avg_delay_days?: number | null
          communication_score?: number | null
          cost_score?: number | null
          created_at?: string
          delivery_score?: number | null
          id?: string
          innovation_score?: number | null
          oa_accuracy_percent?: number | null
          oa_response_hours?: number | null
          otd_percentage?: number | null
          ppm_defects?: number | null
          quality_score?: number | null
          reporting_period: string
          supplier_name: string
          updated_at?: string
        }
        Update: {
          avg_delay_days?: number | null
          communication_score?: number | null
          cost_score?: number | null
          created_at?: string
          delivery_score?: number | null
          id?: string
          innovation_score?: number | null
          oa_accuracy_percent?: number | null
          oa_response_hours?: number | null
          otd_percentage?: number | null
          ppm_defects?: number | null
          quality_score?: number | null
          reporting_period?: string
          supplier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_performance_history: {
        Row: {
          communication_score: number | null
          cost_score: number | null
          created_at: string | null
          delivery_score: number | null
          id: string
          innovation_score: number | null
          order_ack_actual: number | null
          otd_actual: number | null
          overall_score: number | null
          period_date: string
          ppm_actual: number | null
          quality_score: number | null
          supplier_id: string | null
        }
        Insert: {
          communication_score?: number | null
          cost_score?: number | null
          created_at?: string | null
          delivery_score?: number | null
          id?: string
          innovation_score?: number | null
          order_ack_actual?: number | null
          otd_actual?: number | null
          overall_score?: number | null
          period_date: string
          ppm_actual?: number | null
          quality_score?: number | null
          supplier_id?: string | null
        }
        Update: {
          communication_score?: number | null
          cost_score?: number | null
          created_at?: string | null
          delivery_score?: number | null
          id?: string
          innovation_score?: number | null
          order_ack_actual?: number | null
          otd_actual?: number | null
          overall_score?: number | null
          period_date?: string
          ppm_actual?: number | null
          quality_score?: number | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_performance_history_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_performance_history_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_with_latest_performance"
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
          id: string
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
          id?: string
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
          id?: string
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
      tasks: {
        Row: {
          actual_duration: number | null
          assigned_to: string | null
          attachments: Json | null
          completion_notes: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          description: string
          due_date: string
          estimated_duration: number | null
          fhir_task_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
          priority_level: number
          status: string
          task_id: string
          task_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          completion_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description: string
          due_date: string
          estimated_duration?: number | null
          fhir_task_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          priority_level: number
          status?: string
          task_id: string
          task_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          completion_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string
          due_date?: string
          estimated_duration?: number | null
          fhir_task_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          priority_level?: number
          status?: string
          task_id?: string
          task_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_history: {
        Row: {
          billing_code: string | null
          complications: string | null
          cost: number | null
          created_at: string | null
          department_id: string | null
          description: string
          duration_minutes: number | null
          fhir_procedure_id: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          notes: string | null
          outcome: string | null
          patient_id: string
          performed_by: string | null
          treatment_date: string
          treatment_type: string
          updated_at: string | null
        }
        Insert: {
          billing_code?: string | null
          complications?: string | null
          cost?: number | null
          created_at?: string | null
          department_id?: string | null
          description: string
          duration_minutes?: number | null
          fhir_procedure_id?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          outcome?: string | null
          patient_id: string
          performed_by?: string | null
          treatment_date: string
          treatment_type: string
          updated_at?: string | null
        }
        Update: {
          billing_code?: string | null
          complications?: string | null
          cost?: number | null
          created_at?: string | null
          department_id?: string | null
          description?: string
          duration_minutes?: number | null
          fhir_procedure_id?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          outcome?: string | null
          patient_id?: string
          performed_by?: string | null
          treatment_date?: string
          treatment_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_history_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          bmi: number | null
          created_at: string | null
          device_used: string | null
          fhir_observation_id: string | null
          heart_rate: number | null
          height: number | null
          height_unit: string | null
          id: string
          notes: string | null
          oxygen_saturation: number | null
          pain_scale: number | null
          patient_id: string
          recorded_at: string
          recorded_by: string | null
          respiratory_rate: number | null
          temperature: number | null
          temperature_unit: string | null
          updated_at: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          created_at?: string | null
          device_used?: string | null
          fhir_observation_id?: string | null
          heart_rate?: number | null
          height?: number | null
          height_unit?: string | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_scale?: number | null
          patient_id: string
          recorded_at: string
          recorded_by?: string | null
          respiratory_rate?: number | null
          temperature?: number | null
          temperature_unit?: string | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          created_at?: string | null
          device_used?: string | null
          fhir_observation_id?: string | null
          heart_rate?: number | null
          height?: number | null
          height_unit?: string | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_scale?: number | null
          patient_id?: string
          recorded_at?: string
          recorded_by?: string | null
          respiratory_rate?: number | null
          temperature?: number | null
          temperature_unit?: string | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vital_signs_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      supplier_with_latest_performance: {
        Row: {
          annual_revenue: number | null
          classification: string | null
          communication_score: number | null
          employee_count: number | null
          id: string | null
          industry: string | null
          innovation_score: number | null
          lead_time_score: number | null
          name: string | null
          order_ack_score: number | null
          otd_performance: number | null
          overall_score: number | null
          ppm_score: number | null
          pricing_score: number | null
          quality_certification_score: number | null
          risk_level: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_task: {
        Args: {
          p_task_type: string
          p_priority_level: number
          p_assigned_to: string
          p_patient_id: string
          p_department_id: string
          p_title: string
          p_description: string
          p_due_date: string
          p_created_by: string
        }
        Returns: string
      }
      authenticate_admin: {
        Args: { p_username: string; p_password: string }
        Returns: {
          user_id: string
          username: string
          role: string
          is_authenticated: boolean
        }[]
      }
      authenticate_staff: {
        Args: { p_username: string; p_password: string }
        Returns: {
          user_id: string
          username: string
          role: string
          department_id: string
          permissions: Json
          is_authenticated: boolean
        }[]
      }
      calculate_overall_score: {
        Args: { supplier_row: Database["public"]["Tables"]["suppliers"]["Row"] }
        Returns: number
      }
      calculate_supplier_aggregate_score: {
        Args: { supplier_evaluation_id: string }
        Returns: {
          category: string
          total_score: number
          max_possible_score: number
          percentage: number
          grade: string
        }[]
      }
      calculate_supplier_overall_score: {
        Args: {
          supplier_row: Database["public"]["Tables"]["supplier_evaluations"]["Row"]
        }
        Returns: number
      }
      cleanup_expired_deletion_requests: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_fhir_resource: {
        Args: {
          p_resource_type: string
          p_resource_id: string
          p_resource_data: Json
          p_patient_id?: string
          p_created_by?: string
        }
        Returns: string
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
      log_audit_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_resource_type: string
          p_resource_id: string
          p_patient_id?: string
          p_additional_data?: Json
        }
        Returns: undefined
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
    Enums: {},
  },
} as const
