import { createFileRoute } from "@tanstack/react-router";
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

  console.log(users);
  console.log("Current User in lobby:", local_user);

  console.log("Lobby Route - Host Code:", hostCode);
  return <LobbyPage hostCode={hostCode} />;
}
