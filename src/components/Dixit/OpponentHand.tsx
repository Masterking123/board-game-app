import React from "react";

// OpponentHand: shows a hand of cards for an opponent, face down
// No hover, no selection, just display 6 cards as back images

const CARD_BACK_IMAGE = "/src/assets/dixit_cards/card_back.jpg"; // You may need to add this asset if not present

export default function OpponentHand() {
  // For now, always show 6 cards (could be a prop in future)
  const cards = Array(6).fill(null);
  const rotations = [-3, -2, -1, 1, 2, 3];

  return (
    <div className="flex justify-center px-10 py-10 max-w-4xl mx-auto">
      {cards.map((_, index) => (
        <div
          key={index}
          className={`w-16 h-24 rounded-lg shadow-md bg-cover bg-center${index !== 0 ? " -ml-8" : ""}`}
          style={{
            backgroundImage: `url(${CARD_BACK_IMAGE})`,
            transform: `rotate(${rotations[index % rotations.length]}deg)`,
          }}
        ></div>
      ))}
    </div>
  );
}
