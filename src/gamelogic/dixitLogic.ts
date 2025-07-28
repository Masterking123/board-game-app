import { create } from "zustand";
import { useLobbyStore } from "../lobbyStore";
import { useSupabaseStore } from "../supabaseStore";
import type { BaseEvent } from "../types";
import { sendEvent } from "../utils";

interface DixitUserState {
  cards: string[];
  isHost: boolean;
  userName: string;
  hasVoted: boolean;
  points: number;
  hasGameStarted: boolean;
}

interface DixitGameMasterState {
  users: DixitUserState[];
}

export function initDixitGameLogic() {
  const supabase = useSupabaseStore.getState().supabase;
  console.log("Supabase instance in Dixit game logic:", supabase);
  const supabaseChannel = supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "events",
      },
      (payload) => {
        console.log("Dixit game event payload:", payload);
        const newEvent = payload.new as BaseEvent<"game_started">;
        if (newEvent.event_type === "game_started") {
          // get all the users in the lobby
          const users = useLobbyStore.getState().users;

          // Initialize game state for each user
          const masterGameStates: DixitGameMasterState = {
            users: users.map(
              (user): DixitUserState => ({
                userName: user.user_name,
                isHost: user.is_host,
                cards: [],
                hasVoted: false,
                points: 0,
                hasGameStarted: true, // Set to true since the game has started
              })
            ),
          };

          // for each user, add their state to the game state database
          masterGameStates.users.forEach((userState) => {
            supabase
              .from("game_states")
              .insert({
                lobby_id: newEvent.lobby_id,
                user_name: userState.userName,
                game_state: {
                  cards: userState.cards,
                  isHost: userState.isHost,
                  hasVoted: userState.hasVoted,
                  points: userState.points,
                  hasGameStarted: userState.hasGameStarted,
                },
                created_at: new Date().toISOString(),
              })
              .then(({ data, error }) => {
                if (error) {
                  console.error("Error inserting game state:", error);
                } else {
                  console.log("Game state inserted successfully:", data);
                }
              });
          });
        }
      }
    )
    .subscribe();
}
