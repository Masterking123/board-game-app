import { createFileRoute } from "@tanstack/react-router";
import LobbyPage from "../../components/LobbyPage";

export const Route = createFileRoute("/lobby/$hostCode")({
  component: LobbyComponent,
});

function LobbyComponent() {
  const { hostCode } = Route.useParams();
  return <LobbyPage></LobbyPage>;
}
