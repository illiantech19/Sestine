import React from 'react';
import './SestineTable.css';

const SestineTable = ({ sestineFrequency, sestineDelay }) => {
  const sestine = [
    { id: 1, range: '1-6' },
    { id: 2, range: '7-12' },
    { id: 3, range: '13-18' },
    { id: 4, range: '19-24' },
    { id: 5, range: '25-30' },
    { id: 6, range: '31-36' },
  ];

  const frequencies = Object.values(sestineFrequency || {});
  const allEqual = frequencies.every((val) => val === frequencies[0]);

  const maxFreq = Math.max(...frequencies);
  const topSestine = !allEqual
    ? Object.entries(sestineFrequency || {})
        .filter(([_, val]) => val === maxFreq)
        .map(([key]) => parseInt(key))
    : [];

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover sestine-table" role="table" aria-label="Tabella delle sestine">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Sestina</th>
            {sestine.map((sestina) => (
              <th key={sestina.id} scope="col">{sestina.range}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frequenza</td>
            {sestine.map((sestina) => {
              const freq = sestineFrequency[sestina.id] || 0;
              const isTop = topSestine.includes(sestina.id);
              return (
                <td key={sestina.id} className={isTop ? 'bg-success text-white fw-bold' : ''}>
                  {freq}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>Ritardo</td>
            {sestine.map((sestina) => {
              const delay = sestineDelay[sestina.id] || 0;
              const isTop = topSestine.includes(sestina.id);
              const isGreen = isTop && delay >= 6 && delay <= 11;
              const isOrange = delay >= 18 && delay <= 23;
              let className = '';
              if (isGreen) className = 'bg-success text-white fw-bold';
              else if (isOrange) className = 'bg-warning text-dark fw-bold';
              return (
                <td key={sestina.id} className={className}>
                  {delay}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SestineTable;
