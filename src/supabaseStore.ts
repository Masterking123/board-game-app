import {
  createClient,
  type Session,
  SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { create } from "zustand";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface ISupabaseStore {
  supabase: SupabaseClient<any, "public", any>;
  session: Session | null;
  user: User | null;
}

export const useSupabaseStore = create<ISupabaseStore>((set) => ({
  supabase: null as unknown as SupabaseClient<any, "public", any>, // Initialize as null
  session: null,
  user: null,
}));

useSupabaseStore.setState({ supabase });
