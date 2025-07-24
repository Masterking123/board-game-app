import { createFileRoute } from "@tanstack/react-router";
import LobbyPage from "../components/LobbyPage";
import { z } from "zod";
import { useLobbyStore } from "../lobbyStore";

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
  console.log(users);
  console.log("Lobby Route - Host Code:", hostCode);
  return <LobbyPage hostCode={hostCode} />;
}
