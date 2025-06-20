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
const [groupSize, setGroupSize] = useState(10);
  const [terzineFrequency, setTerzineFrequency] = useState({});
  const [terzineDelay, setTerzineDelay] = useState({});
  const [tableButtonStates, setTableButtonStates] = useState([false, false, false, false, false, false]);
  const [showTable, setShowTable] = useState(false);

const handleTableButtonClick = (index) => {
  // Riga con solo la cella index verde, le altre bianche
  const newRow = Array(6).fill(false);
  newRow[index] = true;
  pushNewRow(newRow);
  // Se vuoi anche invertire lo stato del bottone 
};

  const handleStartClick = () => {
  const greenRow = Array(6).fill(true);
  pushNewRow(greenRow);
};

const handleNullClick = () => {
  // Riga tutta bianca (false)
  const whiteRow = Array(6).fill(false);
  pushNewRow(whiteRow);
};
 

const handleNumberClick = (number) => {
  setErrorMessage('');
  setClickHistory((prev) => {
    let updated = [...prev, number];
    if (updated.length > 100) updated = updated.slice(1);
    return updated;
  });
  setTotalInsertedCount(prev => prev + 1);

  // ---- Nuova parte: aggiorno la tabella ----
  // Trovo l'indice della sestina a cui appartiene il numero cliccato
  const sestinaIndex = sestineRanges.findIndex(({ range }) => range.includes(number));
  if (sestinaIndex !== -1) {
    // Creo una riga con tutte false tranne la cella corrispondente alla sestina
    const newRow = Array(6).fill(false);
    newRow[sestinaIndex] = true;
    pushNewRow(newRow);
  }
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
const initialTable = [
  [2, 2, 2, 2, 2, 2],
  [2.4, 2.4, 2.4, 2.4, 2.4, 2.4],
  [3, 3, 3, 3, 3, 3],
  [3.6, 3.6, 3.6, 3.6, 3.6, 3.6],
  [4.2, 4.2, 4.2, 4.2, 4.2, 4.2],
  [5, 5, 5, 5, 5, 5],
  [6, 6, 6, 6, 6, 6],
  [7.2, 7.2, 7.2, 7.2, 7.2, 7.2],
  [8.6, 8.6, 8.6, 8.6, 8.6, 8.6],
  [10.4, 10.4, 10.4, 10.4, 10.4, 10.4],
  [12.4, 12.4, 12.4, 12.4, 12.4, 12.4],
  [15, 15, 15, 15, 15, 15],
  [18, 18, 18, 18, 18, 18],
  [21.6, 21.6, 21.6, 21.6, 21.6, 21.6],
  [26, 26, 26, 26, 26, 26],
  [31.2, 31.2, 31.2, 31.2, 31.2, 31.2],
  [37.4, 37.4, 37.4, 37.4, 37.4, 37.4],
  [44.8, 44.8, 44.8, 44.8, 44.8, 44.8],
];

const initialTable1 = [
  [1, 1,1, 1, 1,1],
  [1.2,1.2, 1.2, 1.2, 1.2, 1.2],
  [1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
  [1.8, 1.8, 1.8, 1.8, 1.8, 1.8],
  [2.1, 2.1, 2.1, 2.1, 2.1, 2.1],
  [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
  [3, 3, 3, 3, 3, 3],
  [3.6, 3.6 , 3.6, 3.6, 3.6, 3.6],
  [4.3, 4.3 , 4.3, 4.3, 4.3, 4.3],
  [5.2, 5.2, 5.2, 5.2, 5.2, 5.2],
  [6.2, 6.2, 6.2, 6.2, 6.2, 6.2],
  [7.5, 7.5, 7.5, 7.5, 7.5, 7.5],
  [9, 9, 9, 9, 9, 9],
  [10.8, 10.8, 10.8, 10.8, 10.8, 10.8],
  [13, 13, 13, 13, 13, 13],
  [15.6, 15.6, 15.6, 15.6, 15.6, 15.7],
  [18.7, 18.7,18.7, 18.7, 18.7,18.7],
  [22.4,22.4,22.4, 22.4, 22.4,22.4],
];
  const [tableRows, setTableRows] = useState(
  Array(18).fill(null).map(() => Array(6).fill(false))
);

const pushNewRow = (newRow) => {
  setTableRows(prev => {
    // Trovo l'indice della cella verde (true) nella nuova riga, se ce n'è uno
    const greenIndex = newRow.findIndex(cell => cell === true);

    // Se non c'è nessuna cella verde, inserisco la riga così com'è
    if (greenIndex === -1) {
      // Inserisco la riga in cima, tagliando l'ultima
      return [newRow, ...prev.slice(0, prev.length - 1)];
    }

    // Altrimenti devo rimuovere il verde in quella colonna dalle righe sottostanti
    const cleanedRows = prev.map(row => {
      // Copio la riga
      const newRowCopy = [...row];
      // Rimuovo il verde nella colonna greenIndex
      newRowCopy[greenIndex] = false;
      return newRowCopy;
    });

    // Inserisco la nuova riga in cima e le righe pulite sotto (troncate alla lunghezza originale)
    return [newRow, ...cleanedRows.slice(0, prev.length - 1)];
  });
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
    <>
      <h1 className="text-center title-small">♥ ♦ Le sestine di zio Ermanno♣ ♠</h1>
      {errorMessage && <div className="alert alert-warning text-center">{errorMessage}</div>}
      <div className="row custom-row-table ">
        <CombinedTable 
          sestineFrequency={sestineFrequency}
          sestineDelay={sestineDelay}
          topSestine={topSestine}
          secondTopSestine={secondTopSestine}
          terzineFrequency={terzineFrequency}
          terzineDelay={terzineDelay}
        />
      </div>
      
   
      <div className="ScaledContainer">
        <div className="row custom-row">
          <div className="col-green-table">  
          <div id="toggle-table">
            <table className="green-table">
              <thead>
                <tr>
                  {[1,2,3,4,5,6].map((num, i) => (
                    <th key={i}> 
                        {num} 
                    </th>
                  ))}
                </tr>
              </thead>
             <tbody>
  {initialTable1.map((rowValues, rowIndex) => (
    <tr key={rowIndex}>
      {rowValues.map((value, colIndex) => {
        const isActive = tableRows[rowIndex] ? tableRows[rowIndex][colIndex] : false;
        return (
          <td
            key={colIndex}
            style={{ backgroundColor: isActive ? 'green' : 'white', transition: 'background-color 0.3s' }}
          >
            {value}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>
            </table>

            <div className="d-flex justify-content-center gap-3 mt-3 ipad-button-group">
              <button className="btn btn-primary" onClick={handleStartClick}>Start</button>
              <button className="btn btn-secondary" onClick={handleNullClick}>Null</button> 
            </div>
          </div>  
          </div>
          <div className="col-roulette">
            <div className="roulette-container">
              <RouletteSurface onNumberClick={handleNumberClick} />
            </div>
          </div> 
        </div>
<div className="row custom-row"> 
            <div className="click-history">
              <h2 className="NumeriEstrattiTitolo">
                Numeri Estratti{" "}
                <span className="badge bg-primary">{totalInsertedCount}</span>
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
    <div className="row custom-row">  
             <div className="col">
              <button className="btn btn-warning" onClick={handleUndoClick}>Cancella Ultimo</button> 
            </div> 
            <div className='col'> 
              <button className="btn btn-danger" onClick={handleClearAllClick}>Cancella Tutto</button> 
            </div> 
         
</div>
      </div>
    </>
  );

};

export default App;

