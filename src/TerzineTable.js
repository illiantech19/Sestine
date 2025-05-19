import React, { useEffect, useRef, useState } from 'react';
import './SestineTable.css';

const terzine = Array.from({ length: 12 }, (_, i) => {
  const start = i * 3 + 1;
  return { id: i + 1, range: `${start}-${start + 2}` };
});

const TerzineTable = ({ terzineFrequency, terzineDelay }) => {
  const [greenDelays, setGreenDelays] = useState([]);
  const prevDelays = useRef({});
  const greenCounters = useRef({});

  const validFrequencies = Object.entries(terzineFrequency || {}).filter(([, f]) => f > 0);
  const maxFreqEntry = validFrequencies.length > 0
    ? validFrequencies.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
    : null;
  const maxFreqIndex = maxFreqEntry ? parseInt(maxFreqEntry[0]) : null;

  useEffect(() => {
    const allZero = Object.values(terzineFrequency || {}).every(f => f === 0);
    if (allZero) {
      setGreenDelays([]);
      prevDelays.current = {};
      greenCounters.current = {};
      return;
    }

    const sortedFreq = Object.entries(terzineFrequency || {})
      .filter(([, freq]) => freq > 0)
      .sort(([, a], [, b]) => b - a);
    const top2 = sortedFreq.slice(0, 2).map(([id]) => parseInt(id));

    top2.forEach(id => {
      const currentDelay = terzineDelay[id] || 0;
      const previousDelay = prevDelays.current[id] || 0;
      if (previousDelay >= 6 && currentDelay === 0) {
        greenCounters.current[id] = 7;
      }
      prevDelays.current[id] = currentDelay;
    });

    const stillGreen = [];
    Object.entries(greenCounters.current).forEach(([id, count]) => {
      const newCount = count - 1;
      if (newCount > 0) {
        greenCounters.current[id] = newCount;
        stillGreen.push(parseInt(id));
      } else {
        delete greenCounters.current[id];
      }
    });

    setGreenDelays(stillGreen);
  }, [terzineFrequency, terzineDelay]);

  return (
    <div className="table-responsive mt-4">
      <h2 className="text-center">Statistiche Terzine</h2>
      <table className="table table-bordered table-hover terzine-table text-center">
        <thead className="thead-dark">
          <tr>
            <th>Terzine</th>
            {terzine.map(t => (
              <th key={t.id}>{t.range}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frequenza</td>
            {terzine.map(t => {
              const freq = terzineFrequency[t.id] || 0;
              const isTop = t.id === maxFreqIndex;
              return (
                <td key={t.id} className={isTop ? 'bg-success text-white fw-bold' : ''}>
                  {freq}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>Ritardo</td>
            {terzine.map(t => {
              const delay = terzineDelay[t.id] || 0;
              const isGreen = greenDelays.includes(t.id);
              const isOrange = delay >= 18 && delay <= 23;
              let className = '';
              if (isGreen) className = 'bg-success text-white fw-bold';
              else if (isOrange) className = 'bg-warning text-dark fw-bold';
              return (
                <td key={t.id} className={className}>
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

export default TerzineTable;
