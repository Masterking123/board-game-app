import React from 'react';
import { createFileRoute } from '@tanstack/react-router'
import "./index.css"

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [hostCode, setHostCode] = React.useState<string | null>(null);
  const [joinMode, setJoinMode] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);

  function generateCode() {
    // Simple random 6-digit code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setHostCode(code);
    setJoinMode(false);
    setSubmittedCode(null);
  }

  function handleJoin() {
    setJoinMode(true);
    setHostCode(null);
    setSubmittedCode(null);
  }

  function submitJoinCode(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedCode(joinCode);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200">
        <h3 className="mb-6 text-2xl font-extrabold text-center text-gray-800 tracking-tight">Connect to a Lobby</h3>
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
        {hostCode && (
          <div className="mb-6 text-center animate-fade-in">
            <span className="font-bold text-gray-700">Your Host Code:</span>
            <span className="text-2xl font-mono ml-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 tracking-widest shadow-sm">{hostCode}</span>
          </div>
        )}
        {joinMode && (
          <form onSubmit={submitJoinCode} className="mb-6 flex flex-col gap-3 items-center">
            <label htmlFor="join-code" className="font-bold text-gray-700">Enter Host Code:</label>
            <input
              id="join-code"
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              className="border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-2 rounded-lg text-lg font-mono w-48 text-center transition"
              required
              placeholder="e.g. ABC123"
              maxLength={6}
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400">Submit</button>
          </form>
        )}
        {submittedCode && (
          <div className="text-center animate-fade-in">
            <span className="font-bold text-gray-700">Joining with code:</span>
            <span className="text-2xl font-mono ml-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200 text-green-700 tracking-widest shadow-sm">{submittedCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}