import React, { useState, useEffect } from 'react';
import RouletteSurface from './RouletteSurface';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CombinedTable from './CombinedTable';

const sestineRanges = [
  { id: 1, range: [1, 2, 3, 4, 5, 6] },
  { id: 2, range: [7, 8, 9, 10, 11, 12] },
  { id: 3, range: [13, 14, 15, 16, 17, 18] },
  { id: 4, range: [19, 20, 21, 22, 23, 24] },
  { id: 5, range: [25, 26, 27, 28, 29, 30] },
  { id: 6, range: [31, 32, 33, 34, 35, 36] },
];

const terzineRanges = [
  { id: 1, range: [1, 2, 3] },
  { id: 2, range: [4, 5, 6] },
  { id: 3, range: [7, 8, 9] },
  { id: 4, range: [10, 11, 12] },
  { id: 5, range: [13, 14, 15] },
  { id: 6, range: [16, 17, 18] },
  { id: 7, range: [19, 20, 21] },
  { id: 8, range: [22, 23, 24] },
  { id: 9, range: [25, 26, 27] },
  { id: 10, range: [28, 29, 30] },
  { id: 11, range: [31, 32, 33] },
  { id: 12, range: [34, 35, 36] },
];


const App = () => { 
  const [sestineFrequency, setSestineFrequency] = useState({});
  const [sestineDelay, setSestineDelay] = useState({});
  const [clickHistory, setClickHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalInsertedCount, setTotalInsertedCount] = useState(0);
  const [groupSize, setGroupSize] = useState(window.innerWidth < 768 ? 25 : 10); 
  const [terzineFrequency, setTerzineFrequency] = useState({});
  const [terzineDelay, setTerzineDelay] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setGroupSize(window.innerWidth < 768 ? 25 : 10);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNumberClick = (number) => {
    setErrorMessage('');
    setClickHistory((prev) => {
      let updated = [...prev, number];
      if (updated.length > 100) updated = updated.slice(1);
      return updated;
    });
    setTotalInsertedCount(prev => prev + 1);
  };

  const handleUndoClick = () => {
    setClickHistory((prev) => prev.slice(0, -1));
    if(totalInsertedCount>0){
    setTotalInsertedCount(prev => prev - 1);
    }  
  };

  const handleClearAllClick = () => {
    if(clickHistory.length>0){
          const confirmClear = window.confirm('Vuoi cancellare tutti i numeri selezionati?');
    if (!confirmClear) return;

    setClickHistory([]);
    setSestineFrequency({});
    setSestineDelay({});
    setErrorMessage(''); 
    setTotalInsertedCount(0);
    } 
  };

 useEffect(() => {
  const newSestineFrequency = {};
  const newSestineDelay = {};
  const lastSeenSestine = {};

  const newTerzineFrequency = {};
  const newTerzineDelay = {};
  const lastSeenTerzine = {};

  // Inizializza valori a 0
  sestineRanges.forEach(({ id }) => {
    newSestineFrequency[id] = 0;
    newSestineDelay[id] = 0;
  });

  terzineRanges.forEach(({ id }) => {
    newTerzineFrequency[id] = 0;
    newTerzineDelay[id] = 0;
  });

  // Calcola frequenza
  clickHistory.forEach(num => {
    sestineRanges.forEach(({ id, range }) => {
      if (range.includes(num)) newSestineFrequency[id]++;
    });

    terzineRanges.forEach(({ id, range }) => {
      if (range.includes(num)) newTerzineFrequency[id]++;
    });
  });

  // Calcola ritardo (indice del primo match, partendo dalla fine)
  [...clickHistory].reverse().forEach((num, idx) => {
    sestineRanges.forEach(({ id, range }) => {
      if (range.includes(num) && lastSeenSestine[id] === undefined) {
        lastSeenSestine[id] = idx;
      }
    });

    terzineRanges.forEach(({ id, range }) => {
      if (range.includes(num) && lastSeenTerzine[id] === undefined) {
        lastSeenTerzine[id] = idx;
      }
    });
  });

  sestineRanges.forEach(({ id }) => {
    newSestineDelay[id] = lastSeenSestine[id] !== undefined ? lastSeenSestine[id] : clickHistory.length;
  });

  terzineRanges.forEach(({ id }) => {
    newTerzineDelay[id] = lastSeenTerzine[id] !== undefined ? lastSeenTerzine[id] : clickHistory.length;
  });

  setSestineFrequency(newSestineFrequency);
  setSestineDelay(newSestineDelay);
  setTerzineFrequency(newTerzineFrequency);
  setTerzineDelay(newTerzineDelay);
}, [clickHistory]);

  const sortedSestine = Object.keys(sestineFrequency).sort(
    (a, b) => sestineFrequency[b] - sestineFrequency[a]
  );
  const maxFrequency = sestineFrequency[sortedSestine[0]] || 0;
  const topSestine = sortedSestine.filter(s => sestineFrequency[s] === maxFrequency);
  const secondTopSestine = sortedSestine.find(s => sestineFrequency[s] < maxFrequency) || null;

  const groupNumbers = (numbers) => {
    const groups = [];
    for (let i = 0; i < numbers.length; i += groupSize) {
      groups.push(numbers.slice(i, i + groupSize));
    }
    return groups;
  };

  const groupedNumbers = groupNumbers([...clickHistory].reverse());

  return (
    <div> 
      <h1 className="text-center title-small">Le sestine di zio Ermanno</h1>
<h4 className="text-center subtitle-small">♥ ♦ Versione 100 numeri ♣ ♠</h4>
      {errorMessage && <div className="alert alert-warning text-center">{errorMessage}</div>}

      <div className="row">
        
         <CombinedTable 
  sestineFrequency={sestineFrequency}
  sestineDelay={sestineDelay}
  topSestine={topSestine}
  secondTopSestine={secondTopSestine}
  terzineFrequency={terzineFrequency}
  terzineDelay={terzineDelay}
/>
        
      </div>

      <div className="row">
        <div className="col-6">
          <div className="click-history mt-4">
    <h2 style={{ fontSize: "1rem" }}>
  Numeri Estratti{" "} <span className="badge bg-primary" style={{ fontSize: "0.46rem" }}>
    {totalInsertedCount}
  </span>
</h2>
            <div className="extracted-numbers-grid">
              {groupedNumbers.map((group, i) => (
                <div key={i} className="extracted-column">
                  {group.map((num, index) => {
                    const getColorClass = () => {
                      if (num === 0) return 'green';
                      const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
                      return redNumbers.includes(num) ? 'red' : 'black';
                    };

                    return (
                      <div key={index} className={`extracted-number ${getColorClass()}`}>
                        {num}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
     <div className="col-6 d-flex align-items-center">
     <RouletteSurface onNumberClick={handleNumberClick} />
     
     <div className="vertical-buttons"style={{ marginLeft: '-40px' }}> 
        <button className="btn btn-danger rotated-button  " onClick={handleUndoClick}>Cancella Ultimo</button>
      <button className="btn btn-warning rotated-button " onClick={handleClearAllClick}>Cancella Tutto</button>
       
      
      </div>
      </div>
      </div>
    </div>
  );

};

export default App;


