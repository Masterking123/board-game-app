import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Hand from "../components/Dixit/Hand";
import { useLobbyStore } from "../lobbyStore";
import GameBoard from "../components/Dixit/GameBoard";
import OpponentHand from "../components/Dixit/OpponentHand";
import { useSupabaseStore } from "../supabaseStore";
import { useCallback, useEffect, useState } from "react";
import { initDixitGameLogic } from "../gamelogic/dixitLogic";
import { sendEvent } from "../utils";

const searchSchema = z.object({
  hostCode: z.string().length(6),
});

export const Route = createFileRoute("/dixit")({
  component: DixitComponent,
  validateSearch: searchSchema,
});

function DixitComponent() {
  const { hostCode } = Route.useSearch();

  const users = useLobbyStore((state) => state.users);
  const lobby_uuid = useLobbyStore((state) => state.lobby_uuid);
  const supabase = useSupabaseStore.getState().supabase;
  const [gameState, setGameState] = useState(null);

  console.log("lobby_uuid:", lobby_uuid);

  useEffect(() => {
    const getUsers = async () => {
      if (!lobby_uuid) return;

      const { data, error } = await supabase
        .from("lobby_users")
        .select("user_name, is_host")
        .eq("lobby_id", lobby_uuid);

      console.log("Fetched users:", data);
      if (error) {
        console.error("Failed to fetch users on load:", error);
        return;
      }

      useLobbyStore.setState({
        users: data.filter(
          (user) =>
            user &&
            user.user_name != null &&
            user.user_name !== "" &&
            user.is_host != null
        ),
      });
    };

    getUsers();
  }, [lobby_uuid]);

  useEffect(() => {
    const local_user = useLobbyStore.getState().local_user;
    if (local_user && local_user.is_host) {
      console.log(
        "Initializing Dixit game logic for host:",
        local_user.user_name
      );
      initDixitGameLogic();
    }

    sendEvent({
      id: crypto.randomUUID(),
      lobby_id: lobby_uuid,
      event_type: "game_started",
      event_data: {
        gameName: "Dixit",
        hostCode: hostCode,
      },
      created_at: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    const local_user = useLobbyStore.getState().local_user;
    if (!lobby_uuid || !local_user || !local_user.user_name) return;

    const fetchGameState = async () => {
      const { data, error } = await supabase
        .from("game_states")
        .select("game_state")
        .eq("lobby_id", lobby_uuid)
        .eq("user_name", local_user.user_name)
        .single();

      if (error) {
        console.error("Failed to fetch game state:", error);
        return;
      }

      if (data) {
        setGameState(data.game_state);
      }
    };

    fetchGameState();

    const gameStateChannel = supabase
      .channel("game-state-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_states",
          filter: `lobby_id=eq.${lobby_uuid},user_name=eq.${local_user.user_name}`,
        },
        (payload) => {
          console.log("Game state update payload:", payload);
          const newState = payload.new.game_state;
          setGameState(newState);
        }
      )
      .subscribe();
  }, [lobby_uuid]);

  console.log("Users in Dixit:", users);

  // Number of opponent hands to render
  const N = users.length;

  function getCustomAngles(numPlayers: number): number[] {
    const sequence = [300, 600, 0, 450, 150, 750, 1050]; // predefined pattern

    return sequence.slice(0, numPlayers - 1); // your hand is assumed to be the missing 1
  }

  const anglesRad = getCustomAngles(N);

  // Ellipse radii (tweak to push them farther out/in)
  const radiusX = 600;
  const radiusY = 350;

  return (
    <div className="relative flex flex-col min-h-screen justify-between items-center bg-gray-100 overflow-hidden">
      {/* Draw ellipse with radius x and radius y */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "50%",
          width: `${radiusX * 2}px`,
          height: `${radiusY * 2}px`,
          border: "1px dashed #ccc",
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
      >
        {/* Opponents arranged around ellipse */}
        {anglesRad.map((angle, i) => {
          // Convert to CSS coords
          const x = radiusX * Math.cos(angle);
          const y = radiusY * Math.sin(angle);

          // Rotate each hand to face center
          const rotationDeg = (angle + Math.PI / 2) * (180 / Math.PI);

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
              }}
            >
              <OpponentHand />
            </div>
          );
        })}
      </div>

      {/* Game board in the center */}
      <div className="flex-1 flex items-center justify-center w-full z-10">
        <GameBoard />
      </div>

      {/* Your hand at the bottom */}
      <div className="pb-8 z-20">
        <Hand />
      </div>
    </div>
  );
}
