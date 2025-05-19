import React from 'react';
import './RouletteSurface.css';

const RouletteSurface = ({ onNumberClick }) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1); // Numeri da 0 a 36

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19,21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17,  20, 22, 24, 26, 28, 29, 31, 33, 35];
  
  const numberColors = Array.from({ length: 37 }, (_, i) => i).reduce((acc, num) => {
    if (num === 0) {
      acc[num] = 'green';
    } else if (redNumbers.includes(num)) {
      acc[num] = 'red';
    } else if (blackNumbers.includes(num)) {
      acc[num] = 'black';
    }
    return acc;
  }, {});

  return (
<div className="roulette-surface">
  <div className="empty-cell" />
  <div
       className="roulette-number green"
    onClick={() => onNumberClick(0)}
    role="button"
    aria-label="Seleziona numero 0"
  >
    0
  </div>
  <div className="empty-cell" />

  {numbers.map((number) => (
    <div
      key={number}
      className={`roulette-number ${numberColors[number]}`}
      onClick={() => onNumberClick(number)}
      role="button"
      aria-label={`Seleziona numero ${number}`}
    >
      {number}
    </div>
  ))}
</div>
  );
};

export default RouletteSurface;
