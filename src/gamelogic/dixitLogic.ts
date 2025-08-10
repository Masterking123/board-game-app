import { useLobbyStore } from "../lobbyStore";
import { useSupabaseStore } from "../supabaseStore";
import type { BaseEvent } from "../types";

interface DixitUser {
  userName: string;
  isHost: boolean;
  cards: string[];
  hasVoted: boolean;
}

interface DixitGameMasterState {
  deck: string[];
  playedCards: string[];
  phase: "story" | "vote" | "reveal";
  votes: string[];
  users: DixitUser[];
  points: Map<string, number>;
  round: number;
  storyteller: string;
  hasGameStarted: boolean;
}

export interface UserSpecificDixitGameState {
  user_game_state: DixitUser;
  hasGameStarted: boolean;
  round: number;
  storyteller: string;
  gameType: "Dixit";
  phase: "story" | "vote" | "reveal";
}

export type EventType =
  | "player_voted"
  | "card_played"
  | "round_ended"
  | "draw_card";

export interface EventDataMap {
  player_voted: { userId: string; cardId: string };
  card_played: { userId: string; cardId: string };
  round_ended: { winnerId: string; points: number };
  draw_card: { userId: string; cardId: string };
}

let masterGameState: DixitGameMasterState | null = null;

function uploadUserSpecificGameStates() {
  const supabase = useSupabaseStore.getState().supabase;

  if (!masterGameState) return;

  for (let user of masterGameState.users) {
    const userSpecficGameState: UserSpecificDixitGameState = {
      user_game_state: user,
      hasGameStarted: masterGameState.hasGameStarted,
      round: masterGameState.round,
      storyteller: masterGameState.storyteller,
      gameType: "Dixit",
      phase: masterGameState.phase,
    };

    // Upload the user-specific game state to Supabase
    supabase
      .from("game_states")
      .insert({
        lobby_id: useLobbyStore.getState().lobby_uuid,
        user_name: user.userName,
        game_state: userSpecficGameState,
      })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error uploading user game state:", error);
        } else {
          console.log("User game state uploaded successfully:", data);
        }
      });
  }
}

export function initDixitGameLogic() {
  console.log("Initializing Dixit game logic...");
  const lobby_uuid = useLobbyStore.getState().lobby_uuid;
  const supabase = useSupabaseStore.getState().supabase;
  masterGameState = {
    deck: [],
    playedCards: [],
    phase: "story",
    votes: [],
    users: useLobbyStore.getState().users.map((user) => ({
      userName: user.user_name,
      isHost: user.is_host,
      cards: [],
      hasVoted: false,
    })),
    points: new Map(),
    round: 0,
    storyteller: "",
    hasGameStarted: true,
  };

  supabase
    .from("lobby")
    .update({ game_route: "dixit" })
    .eq("id", lobby_uuid)
    .then(({ data, error }) => {
      if (error) {
        console.error("Error updating lobby game route:", error);
        return;
      }
      console.log("Lobby game route updated successfully:", data);
    });

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
        const event = payload.new as BaseEvent;
        switch (event.event_type as EventType) {
          case "draw_card":
            // handle draw card event

            break;
          case "player_voted":
            // handle player voted event
            break;
          case "card_played":
            // handle card played event
            break;
          case "round_ended":
            // handle round ended event
            break;
          default:
            console.warn("Unknown event type:", event.event_type);
        }
      }
    )
    .subscribe();

  uploadUserSpecificGameStates();
}
