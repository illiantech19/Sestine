import React, { useState, useEffect, useRef } from 'react';
import './SestineTable.css';

const sestine = [
  { id: 1, range: '1-6' },
  { id: 2, range: '7-12' },
  { id: 3, range: '13-18' },
  { id: 4, range: '19-24' },
  { id: 5, range: '25-30' },
  { id: 6, range: '31-36' },
];

const SestineTable = ({ sestineFrequency, sestineDelay }) => {
  const [greenDelays, setGreenDelays] = useState([]);
  const prevDelays = useRef({});
  const greenCounters = useRef({});

  const validFrequencies = Object.entries(sestineFrequency || {}).filter(([, freq]) => freq > 0);
  const maxFreqEntry = validFrequencies.length > 0
    ? validFrequencies.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
    : null;
  const maxFreqIndex = maxFreqEntry ? parseInt(maxFreqEntry[0]) : null;

  useEffect(() => {
    const allFreqZero = Object.values(sestineFrequency || {}).every(f => f === 0);
    if (allFreqZero) {
      setGreenDelays([]);
      prevDelays.current = {};
      greenCounters.current = {};
      return;
    }

    const sortedFreq = Object.entries(sestineFrequency || {})
      .filter(([, freq]) => freq > 0)
      .sort(([, a], [, b]) => b - a);
    const top2 = sortedFreq.slice(0, 2).map(([id]) => parseInt(id));

    top2.forEach(id => {
      const currentDelay = sestineDelay[id] || 0;
      const previousDelay = prevDelays.current[id] || 0;

      // Se passa da >=6 a 0 → parte il conteggio verde per 7 turni
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
  }, [sestineFrequency, sestineDelay]);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover sestine-table">
        <thead className="thead-dark">
          <tr>
            <th>Sestina</th>
            {sestine.map(s => <th key={s.id}>{s.range}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dozzine</td>
            {(() => {
              const coppie = [[1, 2], [3, 4], [5, 6]];
              const somme = coppie.map(([a, b]) => (sestineFrequency[a] || 0) + (sestineFrequency[b] || 0));
              const allZero = somme.every(val => val === 0);
              let max = 0, min = 0, middle = null;
              if (!allZero) {
                max = Math.max(...somme);
                min = Math.min(...somme);
                middle = somme.find(s => s !== max && s !== min);
              }

              return coppie.map(([a, b], idx) => {
                const val = somme[idx];
                let className = '';
                if (!allZero) {
                  if (val === max) className = 'bg-success text-white fw-bold';
                  else if (val === middle) className = 'bg-warning text-dark fw-bold';
                  else if (val === min) className = 'bg-danger text-white fw-bold';
                }
                return <td key={`${a}-${b}`} className={className} colSpan={2}>{val}</td>;
              });
            })()}
          </tr>
          <tr>
            <td>Frequenza</td>
            {sestine.map(s => {
              const freq = sestineFrequency[s.id] || 0;
              const isTop = s.id === maxFreqIndex;
              return <td key={s.id} className={isTop ? 'bg-success text-white fw-bold' : ''}>{freq}</td>;
            })}
          </tr>
          <tr>
            <td>Ritardo</td>
            {sestine.map(s => {
              const delay = sestineDelay[s.id] || 0;
              const isGreen = greenDelays.includes(s.id);
              const isOrange = delay >= 18 && delay <= 23;
              let className = '';
              if (isGreen) className = 'bg-success text-white fw-bold';
              else if (isOrange) className = 'bg-warning text-dark fw-bold';
              return <td key={s.id} className={className}>{delay}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SestineTable;
