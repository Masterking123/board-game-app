import type { BaseEvent } from "./types";
import { useSupabaseStore } from "./supabaseStore";

export function sendEvent(event: BaseEvent) {
  const supabase = useSupabaseStore.getState().supabase;
  console.log("Sending event:", event);
  return new Promise((resolve, reject) => {
    supabase
      .from("events")
      .insert([event])
      .then(({ data, error }) => {
        if (error) {
          console.error("Error sending event:", error);
          reject(error);
        } else {
          console.log("Event sent successfully:", data);
          resolve(data);
        }
      });
  });
}
