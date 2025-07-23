import React from "react";

export default function LobbySidebar() {
  // Test player data
  const players = [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
    { name: "Dana" },
  ];

  return (
    <aside className="fixed top-0 right-0 h-screen w-1/4 min-w-[300px] max-w-[400px] bg-white shadow-xl rounded-l-2xl p-8 border-l border-gray-200 flex flex-col gap-6 z-20">
      <h2 className="text-2xl font-extrabold mb-2 text-blue-700 text-center tracking-tight">
        Lobby
      </h2>
      <ul className="flex flex-col gap-3">
        <li>
          <a
            href="#"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Lobby Settings
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="7" r="4" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.5 21a6.5 6.5 0 0 1 13 0"
              />
            </svg>
            Participants
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6"
              />
            </svg>
            Chat
          </a>
        </li>
      </ul>
      <div>
        <h3 className="text-lg font-bold mb-2 text-gray-700">Players</h3>
        <ul className="flex flex-col gap-3">
          {players.map((player, idx) => (
            <li
              key={player.name}
              className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
            >
              <span className="inline-block w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
                {/* Simple SVG avatar icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 20a6 6 0 0 1 12 0"
                  />
                </svg>
              </span>
              <span className="font-medium text-gray-800">{player.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
