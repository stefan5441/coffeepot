import { Debt } from "./types";
import { supabase } from "@/lib/supabase";

export const fetchDebt = async () => {
  try {
    const { data, error } = await supabase.from("Debt").select("*").limit(1).single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (e) {
    console.error("Error fetching debt:", e);
    return { data: null, error: "Failed to fetch debt data" };
  }
};

export const updateDebt = async (debtPayload: Omit<Debt, "id" | "created_at">) => {
  try {
    const { data, error } = await supabase.from("Debt").update(debtPayload).eq("id", 1).select().single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (e) {
    console.error("Error updating debt:", e);
    return { data: null, error: "Failed to update debt data" };
  }
};
