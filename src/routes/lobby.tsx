import { createFileRoute } from "@tanstack/react-router";
import LobbyPage from "../components/LobbyPage";
import { z } from "zod";

const lobbySearchSchema = z.object({
  hostCode: z.string().length(6),
});

export const Route = createFileRoute("/lobby")({
  component: LobbyRouteComponent,
  validateSearch: lobbySearchSchema,
});

function LobbyRouteComponent() {
  const { hostCode } = Route.useSearch();
  console.log("Lobby Route - Host Code:", hostCode);
  return <LobbyPage hostCode={hostCode} />;
}
