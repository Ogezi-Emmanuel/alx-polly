import { z } from 'zod';

export const PollSchema = z.object({
  id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
  question: z.string(),
  user_id: z.string().uuid().nullable().optional(),
});

export const OptionSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  created_at: z.string().datetime().default(() => new Date().toISOString()),
  poll_id: z.string().uuid().nullable().optional(),
  text: z.string(),
  votes: z.number().int().optional().default(0),
});

export const VoteSchema = z.object({
  id: z.string().uuid().optional().default(() => crypto.randomUUID()),
  option_id: z.string(),
  poll_id: z.string(),
  created_at: z.string().datetime().optional().default(() => new Date().toISOString()),
  user_id: z.string().uuid().nullable().optional(),
});

export type Poll = z.infer<typeof PollSchema>;
export type Option = z.infer<typeof OptionSchema>;
export type Vote = z.infer<typeof VoteSchema>;

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
      polls: {
        Row: Poll;
        Insert: Omit<Poll, 'id' | 'created_at'>;
        Update: Partial<Poll>;
        Relationships: [
          {
            foreignKeyName: "polls_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      options: {
        Row: Option;
        Insert: Omit<Option, 'id' | 'created_at'>;
        Update: Partial<Option>;
        Relationships: [
          {
            foreignKeyName: "options_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls";
            referencedColumns: ["id"];
          },
        ];
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Vote>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}