import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import DixitHand from "../components/DixitHand";

const searchSchema = z.object({
  hostCode: z.string().length(6),
});

export const Route = createFileRoute("/dixit")({
  component: DixitComponent,
  validateSearch: searchSchema,
});

function DixitComponent() {
  const { hostCode } = Route.useSearch();
  console.log("Dixit Route - Host Code:", hostCode);
  return (
    <div>
      <DixitHand />
    </div>
  );
}
