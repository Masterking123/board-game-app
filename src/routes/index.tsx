import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import "./index.css";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [joinMode, setJoinMode] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");
  const navigate = useNavigate();

  function generateCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate({ to: `/lobby/${code}` });
  }

  function handleJoin() {
    setJoinMode(true);
  }

  function submitJoinCode() {
    if (!joinCode) return;
    navigate({ to: `/lobby/${joinCode.toUpperCase()}` });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200">
        <h3 className="mb-6 text-2xl font-extrabold text-center text-gray-800 tracking-tight">
          Connect to a Lobby
        </h3>
        <div className="flex gap-4 mb-8 justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={generateCode}
          >
            Host
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
        {joinMode && (
          <form
            onSubmit={submitJoinCode}
            className="mb-6 flex flex-col gap-3 items-center"
          >
            <label htmlFor="join-code" className="font-bold text-gray-700">
              Enter Host Code:
            </label>
            <input
              id="join-code"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-2 rounded-lg text-lg font-mono w-48 text-center transition"
              required
              placeholder="e.g. ABC123"
              maxLength={6}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
