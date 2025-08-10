import { createFileRoute, useNavigate } from "@tanstack/react-router";
import LobbyPage from "../components/LobbyPage";
import { z } from "zod";
import { useLobbyStore } from "../lobbyStore";
import { useEffect } from "react";
import { useSupabaseStore } from "../supabaseStore";

const lobbySearchSchema = z.object({
  hostCode: z.string().length(6),
});

export const Route = createFileRoute("/lobby")({
  component: LobbyRouteComponent,
  validateSearch: lobbySearchSchema,
});

function LobbyRouteComponent() {
  const { hostCode } = Route.useSearch();
  const users = useLobbyStore((state) => state.users);
  const local_user = useLobbyStore((state) => state.local_user);
  const lobby_uuid = useLobbyStore((state) => state.lobby_uuid);
  const supabase = useSupabaseStore.getState().supabase;
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      if (!lobby_uuid) return;

      const { data, error } = await supabase
        .from("lobby_users")
        .select("user_name, is_host")
        .eq("lobby_id", lobby_uuid);

      if (error) {
        console.error("Failed to fetch users on load:", error);
        return;
      }

      useLobbyStore.setState({
        users: data.map((user) => user),
      });
    };

    getUsers();
  }, [lobby_uuid]);

  useEffect(() => {
    console.log("Setting up game state subscription...");

    const local_user = useLobbyStore.getState().local_user;
    if (!lobby_uuid || !local_user || !local_user.user_name) return;

    const channel = supabase
      .channel("game-state-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to INSERT and UPDATE
          schema: "public",
          table: "game_states",
        },
        async (payload) => {
          console.log("Detected game state change in DB:", payload);

          const changedGameState = payload.new as {
            lobby_id?: string;
            user_name?: string;
          };

          if (
            changedGameState.lobby_id !== lobby_uuid ||
            changedGameState.user_name !== local_user.user_name
          ) {
            return;
          }

          // Always re-fetch the game state fresh
          const { data, error } = await supabase
            .from("game_states")
            .select("*")
            .eq("lobby_id", lobby_uuid)
            .eq("user_name", local_user.user_name)
            .maybeSingle();

          if (error) {
            console.error("Failed to re-fetch game state:", error);
          } else {
            console.log("Updated game state:", data);
            if (data.game_state.hasGameStarted) {
              console.log("Game has started for user:", local_user.user_name);
              navigate({
                to: `/${data.game_state.gameType.toLowerCase()}`,
                search: { hostCode },
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobby_uuid]);

  useEffect(() => {
    if (!lobby_uuid) return;

    const channel = supabase
      .channel("lobby-game-route-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lobby",
          filter: `id=eq.${lobby_uuid}`,
        },
        async (payload) => {
          console.log("Detected lobby game route change in DB:", payload);
          const changedLobby = payload.new as { game_route?: string };
          if (changedLobby && changedLobby.game_route) {
            navigate({
              to: `/${changedLobby.game_route}`,
              search: { hostCode },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  console.log(users);
  console.log("Current User in lobby:", local_user);

  console.log("Lobby Route - Host Code:", hostCode);
  return <LobbyPage hostCode={hostCode} />;
}
