export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          email: string;
          avatar_url: string | null;
          level: number;
          xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          email?: string;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          email?: string;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subtitle: string;
          icon: string;
          type: "positive" | "negative";
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          subtitle?: string;
          icon?: string;
          type?: "positive" | "negative";
          category?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string;
          icon?: string;
          type?: "positive" | "negative";
          category?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          completed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      goal_streaks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subtitle: string;
          icon: string;
          color: string;
          target_days: number;
          current_streak: number;
          longest_streak: number;
          reward_title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          subtitle?: string;
          icon?: string;
          color?: string;
          target_days?: number;
          current_streak?: number;
          longest_streak?: number;
          reward_title?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string;
          icon?: string;
          color?: string;
          target_days?: number;
          current_streak?: number;
          longest_streak?: number;
          reward_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "goal_streaks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          description: string;
          unlocked: boolean;
          unlocked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
          description?: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          icon?: string;
          description?: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      rewards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          icon: string;
          unlocked: boolean;
          redeemed: boolean;
          valid_until: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          icon?: string;
          unlocked?: boolean;
          redeemed?: boolean;
          valid_until: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          icon?: string;
          unlocked?: boolean;
          redeemed?: boolean;
          valid_until?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rewards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      habit_type: "positive" | "negative";
    };
  };
}
