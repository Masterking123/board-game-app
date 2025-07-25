import { useState, useEffect } from "react";

// Opening Phase
// Pick your story teller
// They select a card and a theme
// Every other player recieves the theme
// All players select Card

// Card selection phase
// Players get to vote on cards
// Players lock in their votes

// Results phase
// Reveal the storytellers card
// Reveal whose card and whose
// Allocate points on the game board
// Move tiles on the game board
// Change the story teller counter clockwise
// Check if any player has won the game

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function DixitHand() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cards, setCards] = useState<number[]>([]);

  function handleOnHover(card: number | null) {
    setHoveredCard(card);
  }

  useEffect(() => {
    const generatedCards: number[] = [];
    while (generatedCards.length !== 6) {
      const number = getRandomInt(1, 108);
      if (!generatedCards.includes(number)) {
        generatedCards.push(number);
      }
    }
    setCards(generatedCards);
  }, []);

  const rotations = [-8, -5, -1, 1, 5, 8];

  return (
    <div className="min-h-screen flex flex-col justify-end">
      <div className="flex justify-center items-center grow">
        {hoveredCard && (
          <div
            className="w-32 h-48 rounded-lg shadow-lg bg-cover bg-center"
            style={{
              backgroundImage: `url(/src/assets/dixit_cards/card_${hoveredCard}.png)`,
            }}
          ></div>
        )}
      </div>

      <div className="flex justify-center gap-4 px-10 py-10 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-16 h-24 rounded-lg shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(/src/assets/dixit_cards/card_${card}.png)`,
              transform: `rotate(${rotations[index % rotations.length]}deg)`,
            }}
            onMouseEnter={() => handleOnHover(card)}
            onMouseLeave={() => handleOnHover(null)}
          ></div>
        ))}
      </div>
    </div>
  );
}
