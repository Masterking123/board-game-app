import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lobby/$hostCode")({
  component: LobbyComponent,
});

function LobbyComponent() {
  const { hostCode } = Route.useParams();
  return <div>Hello from lobby: {hostCode}</div>;
}
