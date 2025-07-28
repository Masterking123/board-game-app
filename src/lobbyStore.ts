import { useSupabaseStore, type ISupabaseStore } from "./supabaseStore";
import { create, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

console.log("Initializing lobby store...");

interface LobbyUser {
  user_name: string;
  is_host: boolean;
}

interface ILobbyStore {
  users: LobbyUser[];
  lobby_code: string;
  lobby_uuid: string;
  local_user: LobbyUser | null;
}

export const useLobbyStore = create<ILobbyStore>()(
  persist<ILobbyStore>(
    (set) => ({
      users: [], // Ensure initial state is always an empty array
      lobby_code: "",
      lobby_uuid: "",
      local_user: null,
    }),
    {
      name: "lobby-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        users: state.users,
        lobby_code: state.lobby_code,
        lobby_uuid: state.lobby_uuid,
        local_user: state.local_user,
      }),
    }
  )
);

useLobbyStore.subscribe(async (state, prevState) => {
  const supabase = useSupabaseStore.getState().supabase;

  // Update users if the lobby code has changed
  if (state.lobby_code != prevState.lobby_code) {
    console.log("Lobby UUID: ", useLobbyStore.getState().lobby_uuid);
    const { data, error } = await supabase
      .from("lobby_users")
      .select("user_name, is_host")
      .eq("lobby_id", useLobbyStore.getState().lobby_uuid);

    if (error) {
      console.error(error);
      return;
    }

    useLobbyStore.setState({
      users: data
        .filter(
          (user: any) =>
            user &&
            user.user_name != null &&
            user.user_name !== "" &&
            user.is_host != null
        )
        .map((user: any) => ({
          user_name: user.user_name,
          is_host: user.is_host,
        })),
    });
  }
});

const init = async (state: ISupabaseStore) => {
  state.supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
      },
      (payload) => {
        console.log("User Join payload:", payload);

        const newUser = payload.new as { user_name: string; isHost: boolean };
        if (
          newUser &&
          newUser.user_name != null &&
          newUser.user_name !== "" &&
          newUser.isHost != null &&
          !useLobbyStore
            .getState()
            .users.some((u) => u.user_name === newUser.user_name)
        ) {
          useLobbyStore.setState({
            users: [
              ...useLobbyStore.getState().users,
              {
                user_name: newUser.user_name,
                is_host: newUser.isHost,
              },
            ],
          });
        }
      }
    )
    .subscribe();

  console.log("Subscribed to channel: schema-db-changes");
};

useSupabaseStore.subscribe(init);
init(useSupabaseStore.getState());
