import { useState } from "react";

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

export default function DixitHand() {
  // This function max and min are inclusive
  function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max + 1);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  const [isCardSelected, setIsCardSelected] = useState(false);

  function handleOnHover() {}

  const cards: number[] = [];
  const rotations = [-8, -5, -1, 1, 5, 8];

  while (cards.length != 6) {
    let number = getRandomInt(1, 108);
    if (!cards.includes(number)) {
      cards.push(number);
    }
  }
  console.log(cards);

  return (
    <div className="min-h-screen flex flex-col justify-end">
      <div className="flex justify-center items-center grow"></div>

      <div className="flex justify-center gap-4 px-10 py-10 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-16 h-24 rounded-lg shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(/src/assets/dixit_cards/card_${card}.png)`,
              transform: `rotate(${rotations[index % rotations.length]}deg)`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
