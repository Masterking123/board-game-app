import React from "react";
import LobbySidebar from "./LobbySidebar";
import GameSelection from "./GameSelection";

export default function LobbyPage() {
  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: 3 }}>
          <GameSelection />
        </div>
        <div style={{ flex: 1, borderLeft: "1px solid #eee", height: "100vh" }}>
          <LobbySidebar />
        </div>
      </div>
    </>
  );
}
