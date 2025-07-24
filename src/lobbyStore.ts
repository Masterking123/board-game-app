import { useSupabaseStore, type ISupabaseStore } from "./supabaseStore";
import { create, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

console.log("Initializing lobby store...");

interface ILobbyStore {
  users: string[];
  lobby_code: string;
  lobby_uuid: string;
}

export const useLobbyStore = create<ILobbyStore>()(
  persist(
    (set) => ({
      users: [],
      lobby_code: "",
      lobby_uuid: "",
    }),
    {
      name: "lobby-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        lobby_code: state.lobby_code,
        lobby_uuid: state.lobby_uuid,
      }),
    }
  )
);

useLobbyStore.subscribe(async (state, prevState) => {
  const supabase = useSupabaseStore.getState().supabase;
  if (state.lobby_code != prevState.lobby_code) {
    console.log("Lobby UUID: ", useLobbyStore.getState().lobby_uuid);

    const { data, error } = await supabase
      .from("lobby_users")
      .select("user_name")
      .eq("lobby_id", useLobbyStore.getState().lobby_uuid);

    if (error) {
      console.error(error);
      return;
    }

    useLobbyStore.setState({
      users: data.map((user) => user.user_name),
    });
  }
});

const init = async (state: ISupabaseStore) => {
  const channel = state.supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
      },
      (payload) => {
        console.log("User Join payload:", payload);

        // @ts-ignore
        if (!useLobbyStore.getState().users.includes(payload.new.user_name)) {
          useLobbyStore.setState({
            // @ts-ignore
            users: [...useLobbyStore.getState().users, payload.new.user_name],
          });
        }
      }
    )
    .subscribe();

  console.log("Subscribed to channel: schema-db-changes");
};

useSupabaseStore.subscribe(init);
init(useSupabaseStore.getState());
