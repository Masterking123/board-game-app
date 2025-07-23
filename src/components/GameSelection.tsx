import { useNavigate } from "@tanstack/react-router";

interface GameProps {
  hostCode: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
}

export function Game({ hostCode, name, minPlayers, maxPlayers }: GameProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: `/${name.toLowerCase().replace(/\s+/g, "-")}`,
      search: { hostCode },
    });
  };

  return (
    <div
      className="flex flex-col w-52 h-52 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border-2 border-blue-300 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center h-2/3 text-xl font-extrabold text-gray-800">
        {name}
      </div>
      <div className="flex items-center justify-center h-1/3 text-center text-base text-gray-700">
        {minPlayers === maxPlayers
          ? `${minPlayers} Player${minPlayers > 1 ? "s" : ""}`
          : `${minPlayers} - ${maxPlayers} Players`}
      </div>
    </div>
  );
}

export default function GameSelection({ hostCode }: { hostCode: string }) {
  const games = [
    { name: "Dixit", minPlayers: 3, maxPlayers: 6 },
    { name: "Chess", minPlayers: 2, maxPlayers: 2 },
    { name: "Sudoku", minPlayers: 1, maxPlayers: 1 },
    { name: "Tic Tac Toe", minPlayers: 2, maxPlayers: 2 },
    { name: "Minesweeper", minPlayers: 1, maxPlayers: 1 },
    { name: "Checkers", minPlayers: 2, maxPlayers: 2 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 drop-shadow-lg">
        Select a Game
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {games.map((game) => (
          <Game
            key={game.name}
            name={game.name}
            minPlayers={game.minPlayers}
            maxPlayers={game.maxPlayers}
            hostCode={hostCode}
          />
        ))}
      </div>
    </div>
  );
}
