import React from 'react';
import './RouletteSurface.css';

const RouletteSurface = ({ onNumberClick }) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1); // Numeri da 0 a 36

  // Mappa dei colori per i numeri
  const numberColors = {
    0: 'green',
    1: 'red',
    2: 'black',
    3: 'red',
    4: 'black',
    5: 'red',
    6: 'black',
    7: 'red',
    8: 'black',
    9: 'red',
    10: 'black',
    11: 'black',
    12: 'red',
    13: 'black',
    14: 'red',
    15: 'black',
    16: 'red',
    17: 'black',
    18: 'red',
    19: 'black',
    20: 'black',
    21: 'red',
    22: 'black',
    23: 'red',
    24: 'black',
    25: 'red',
    26: 'black',
    27: 'red',
    28: 'red',
    29: 'black',
    30: 'red',
    31: 'black',
    32: 'red',
    33: 'black',
    34: 'red',
    35: 'black',
    36: 'red'
  };

  return (
    <><div className="roulette-number zero green" onClick={() => onNumberClick(0)} role="button" aria-label="Seleziona numero 0">
      0
    </div>
    <div className="roulette-surface">
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
      </div></>
  );
};

export default RouletteSurface;
