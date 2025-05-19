import React, { useEffect, useRef, useState } from 'react';
import './SestineTable.css';

const sestine = [
  { id: 1, range: '1-6' },
  { id: 2, range: '7-12' },
  { id: 3, range: '13-18' },
  { id: 4, range: '19-24' },
  { id: 5, range: '25-30' },
  { id: 6, range: '31-36' },
];

const terzine = [
  { id: 1, range: '1-3' },
  { id: 2, range: '4-6' },
  { id: 3, range: '7-9' },
  { id: 4, range: '10-12' },
  { id: 5, range: '13-15' },
  { id: 6, range: '16-18' },
  { id: 7, range: '19-21' },
  { id: 8, range: '22-24' },
  { id: 9, range: '25-27' },
  { id: 10, range: '28-30' },
  { id: 11, range: '31-33' },
  { id: 12, range: '34-36' },
];

const CombinedTable = ({
  sestineFrequency,
  sestineDelay,
  terzineFrequency,
  terzineDelay,
  terzineAverageDelay
}) => {
  const [greenDelays, setGreenDelays] = useState([]);
  const prevDelays = useRef({});
  const greenCounters = useRef({});

  const validFrequencies = Object.entries(sestineFrequency || {}).filter(([, freq]) => freq > 0);
  const maxFreqEntry = validFrequencies.length > 0
    ? validFrequencies.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
    : null;
  const maxFreqIndex = maxFreqEntry ? parseInt(maxFreqEntry[0]) : null;


  const validFrequenciesterzine = Object.entries(terzineFrequency || {}).filter(([, freq]) => freq > 0);
  const maxFreqEntryterzine = validFrequenciesterzine.length > 0
    ? validFrequenciesterzine.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
    : null;
  const maxFreqIndexterzine = maxFreqEntryterzine ? parseInt(maxFreqEntryterzine[0]) : null;

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
          <tr className="header-row-gray">
            <th >Sestina</th>
            {sestine.map(s => <th colSpan={2} key={s.id}>{s.range}</th>)}
          </tr>
        </thead>
        <tbody>
          {/* RIGA DOZZINE */}
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
                return <td colSpan={4} key={`${a}-${b}`} className={className} >{val}</td>;
              });
            })()}
          </tr>

          {/* RIGA FREQUENZA */}
          <tr>
            <td>Frequenza</td>
            {sestine.map(s => {
              const freq = sestineFrequency[s.id] || 0;
              const isTop = s.id === maxFreqIndex;
              return <td colSpan={2} key={s.id} className={isTop ? 'bg-success text-white fw-bold' : ''}>{freq}</td>;
            })}
          </tr>

          {/* RIGA RITARDO */}
          <tr>
            <td>Ritardo</td>
            {sestine.map(s => {
              const delay = sestineDelay[s.id] || 0;
              const isGreen = greenDelays.includes(s.id);
              const isOrange = delay >= 18 && delay <= 23;
              let className = '';
              if (isGreen) className = 'bg-success text-white fw-bold';
              else if (isOrange) className = 'bg-warning text-dark fw-bold';
              return <td colSpan={2} key={s.id} className={className}>{delay}</td>;
            })}
          </tr>

          {/* RIGA VUOTA */}
         

          {/* TABELLA TERZINE */}
          <tr className="header-row-gray">
  <th>Terzine</th>
  {terzine.map(s => (
    <th key={s.id}>{s.range}</th>
  ))}
</tr>

          <tr>
            <td>Frequenza</td>
              {terzine.map(s => {
              const freq = terzineFrequency[s.id] || 0;
              const isTop = s.id === maxFreqIndexterzine;
              return <td key={s.id} className={isTop ? 'bg-success text-white fw-bold' : ''}>{freq}</td>;
            })}
          </tr>

          <tr>
            <td>Ritardo</td>
             {terzine.map(s => {
              const delay = terzineDelay[s.id] || 0; 
              let className = ''; 
             return <td key={s.id} className={className} >{delay}</td>;
            })}
          </tr> 
        </tbody>
      </table>
    </div>
  );
};

export default CombinedTable;
