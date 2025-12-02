export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      trainer_clients: {
        Row: {
          activity_level: string | null;
          client_user_id: string | null;
          created_at: string | null;
          current_weight_lbs: number | null;
          date_of_birth: string | null;
          dietary_restrictions: string | null;
          email: string;
          full_name: string;
          gender: string | null;
          goal_notes: string | null;
          goal_weight_lbs: number | null;
          height_feet: number | null;
          height_inches: number | null;
          id: string;
          injuries: string | null;
          lead_source: string | null;
          medical_conditions: string | null;
          monthly_rate: number | null;
          next_payment_date: string | null;
          payment_method: string | null;
          payment_status: string | null;
          phone: string | null;
          portal_enabled: boolean | null;
          primary_goal: string | null;
          start_date: string | null;
          status: string | null;
          target_calories: number | null;
          target_carbs_g: number | null;
          target_fat_g: number | null;
          target_protein_g: number | null;
          tdee: number | null;
          trainer_id: string;
          updated_at: string | null;
        };
        Insert: {
          activity_level?: string | null;
          client_user_id?: string | null;
          created_at?: string | null;
          current_weight_lbs?: number | null;
          date_of_birth?: string | null;
          dietary_restrictions?: string | null;
          email: string;
          full_name: string;
          gender?: string | null;
          goal_notes?: string | null;
          goal_weight_lbs?: number | null;
          height_feet?: number | null;
          height_inches?: number | null;
          id?: string;
          injuries?: string | null;
          lead_source?: string | null;
          medical_conditions?: string | null;
          monthly_rate?: number | null;
          next_payment_date?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          phone?: string | null;
          portal_enabled?: boolean | null;
          primary_goal?: string | null;
          start_date?: string | null;
          status?: string | null;
          target_calories?: number | null;
          target_carbs_g?: number | null;
          target_fat_g?: number | null;
          target_protein_g?: number | null;
          tdee?: number | null;
          trainer_id: string;
          updated_at?: string | null;
        };
        Update: {
          activity_level?: string | null;
          client_user_id?: string | null;
          created_at?: string | null;
          current_weight_lbs?: number | null;
          date_of_birth?: string | null;
          dietary_restrictions?: string | null;
          email?: string;
          full_name?: string;
          gender?: string | null;
          goal_notes?: string | null;
          goal_weight_lbs?: number | null;
          height_feet?: number | null;
          height_inches?: number | null;
          id?: string;
          injuries?: string | null;
          lead_source?: string | null;
          medical_conditions?: string | null;
          monthly_rate?: number | null;
          next_payment_date?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          phone?: string | null;
          portal_enabled?: boolean | null;
          primary_goal?: string | null;
          start_date?: string | null;
          status?: string | null;
          target_calories?: number | null;
          target_carbs_g?: number | null;
          target_fat_g?: number | null;
          target_protein_g?: number | null;
          tdee?: number | null;
          trainer_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trainer_clients_trainer_id_fkey";
            columns: ["trainer_id"];
            isOneToOne: false;
            referencedRelation: "trainer_trainers";
            referencedColumns: ["id"];
          }
        ];
      };
      trainer_trainers: {
        Row: {
          bio: string | null;
          business_name: string | null;
          clerk_user_id: string;
          created_at: string | null;
          custom_domain: string | null;
          email: string;
          full_name: string | null;
          id: string;
          logo_url: string | null;
          phone: string | null;
          primary_color: string | null;
          profile_image_url: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subdomain: string | null;
          subscription_ends_at: string | null;
          subscription_plan: string | null;
          subscription_status: string | null;
          trial_ends_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          bio?: string | null;
          business_name?: string | null;
          clerk_user_id: string;
          created_at?: string | null;
          custom_domain?: string | null;
          email: string;
          full_name?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          primary_color?: string | null;
          profile_image_url?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subdomain?: string | null;
          subscription_ends_at?: string | null;
          subscription_plan?: string | null;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          bio?: string | null;
          business_name?: string | null;
          clerk_user_id?: string;
          created_at?: string | null;
          custom_domain?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          primary_color?: string | null;
          profile_image_url?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subdomain?: string | null;
          subscription_ends_at?: string | null;
          subscription_plan?: string | null;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };

    Functions: {
      get_clerk_user_id: { Args: never; Returns: string };
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
