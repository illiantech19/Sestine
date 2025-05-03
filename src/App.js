import React, { useState, useEffect } from 'react';
import RouletteSurface from './RouletteSurface';
import SestineTable from './SestineTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const sestineRanges = [
  { id: 1, range: [1, 2, 3, 4, 5, 6] },
  { id: 2, range: [7, 8, 9, 10, 11, 12] },
  { id: 3, range: [13, 14, 15, 16, 17, 18] },
  { id: 4, range: [19, 20, 21, 22, 23, 24] },
  { id: 5, range: [25, 26, 27, 28, 29, 30] },
  { id: 6, range: [31, 32, 33, 34, 35, 36] },
];

const App = () => {
  const [sestineFrequency, setSestineFrequency] = useState({});
  const [sestineDelay, setSestineDelay] = useState({});
  const [clickHistory, setClickHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNumberClick = (number) => {
    setErrorMessage('');
    setClickHistory((prev) => {
      let updated = [...prev, number];
      if (updated.length > 100) updated = updated.slice(1);
      return updated;
    });
  };

  const handleUndoClick = () => {
    setClickHistory((prev) => prev.slice(0, -1));
  };

  const handleClearAllClick = () => {
    const confirmClear = window.confirm('Vuoi cancellare tutti i numeri selezionati?');
    if (!confirmClear) return;
  
    setClickHistory([]);
    setSestineFrequency({});
    setSestineDelay({});
    setErrorMessage('');
  };

  useEffect(() => {
    const newFrequency = {};
    const newDelay = {};
    const lastSeen = {};

    sestineRanges.forEach(s => {
      newFrequency[s.id] = 0;
      newDelay[s.id] = 0;
    });

    clickHistory.forEach(num => {
      sestineRanges.forEach(s => {
        if (s.range.includes(num)) {
          newFrequency[s.id]++;
        }
      });
    });

    [...clickHistory].reverse().forEach((num, idx) => {
      sestineRanges.forEach(s => {
        if (s.range.includes(num) && lastSeen[s.id] === undefined) {
          lastSeen[s.id] = idx;
        }
      });
    });

    sestineRanges.forEach(s => {
      newDelay[s.id] = lastSeen[s.id] !== undefined ? lastSeen[s.id] : clickHistory.length;
    });

    setSestineFrequency(newFrequency);
    setSestineDelay(newDelay);
  }, [clickHistory]); // ✅ Solo clickHistory, sestineRanges è stabile fuori

  const sortedSestine = Object.keys(sestineFrequency).sort(
    (a, b) => sestineFrequency[b] - sestineFrequency[a]
  );
  const maxFrequency = sestineFrequency[sortedSestine[0]] || 0;
  const topSestine = sortedSestine.filter(s => sestineFrequency[s] === maxFrequency);
  const secondTopSestine = sortedSestine.find(s => sestineFrequency[s] < maxFrequency) || null;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Le sestine di zio Ermanno</h1>
      <h4>♥ ♦ Made in Naples ♣ ♠</h4>
      {errorMessage && <div className="alert alert-warning text-center">{errorMessage}</div>}

      <div className="row">
        <div className="col-12">
          <SestineTable
            sestineFrequency={sestineFrequency}
            sestineDelay={sestineDelay}
            topSestine={topSestine}
            secondTopSestine={secondTopSestine}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <div className="click-history mt-4">
        
  <h2 >Numeri Estratti</h2>
  <div className="extracted-numbers-grid">
    {[...clickHistory].reverse().map((num, i) => {
      const getColorClass = () => {
        if (num === 0) return 'green';
        const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        return redNumbers.includes(num) ? 'red' : 'black';
      };

      return (
        <div key={i} className={`extracted-number ${getColorClass()}`}>
          {num}
        </div>
      );
    })} 
</div>
          </div>
        </div>

        <div className="col-6">
          <RouletteSurface onNumberClick={handleNumberClick} />
          <button className="btn btn-danger mt-4 d-block mx-auto" onClick={handleUndoClick}>Cancella Ultimo</button>
          <button className="btn btn-warning mt-2 d-block mx-auto" onClick={handleClearAllClick}>Cancella Tutto</button>
        </div>
      </div>
    </div>
  );
};

export default App;
