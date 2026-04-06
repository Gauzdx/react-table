import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import './VirtualGrid.css';

const ROW_COUNT = 1001; // 1000 data rows + 1 header
const COL_COUNT = 1001; // 1000 data columns + 1 header
const COL_WIDTH = 120;
const ROW_HEIGHT = 35;

export default function VirtualGrid({ id }) {
  const [dataCache, setDataCache] = useState({});
  const [localEdits, setLocalEdits] = useState({});
  
  const [visibleRange, setVisibleRange] = useState({
    startRow: 0, stopRow: 20, startCol: 0, stopCol: 10
  });

  const fetchTimer = useRef(null);

  // When visible range changes, fetch missing data.
  useEffect(() => {
    // subtract 1 because row 0 is our header, data starts at index 0.
    const dataStartRow = Math.max(0, visibleRange.startRow - 1);
    const dataStopRow = Math.min(1000, visibleRange.stopRow + 2); // Buffer to prevent empty edges
    const dataStartCol = Math.max(0, visibleRange.startCol - 1);
    const dataStopCol = Math.min(1000, visibleRange.stopCol + 2);

    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    
    fetchTimer.current = setTimeout(() => {
      fetch(`/api/data?startRow=${dataStartRow}&endRow=${dataStopRow}&startCol=${dataStartCol}&endCol=${dataStopCol}`)
        .then(res => res.json())
        .then(chunk => {
          setDataCache(prev => {
            const next = { ...prev };
            chunk.forEach((rowArr, rIdx) => {
              const actualRow = dataStartRow + rIdx;
              if (!next[actualRow]) next[actualRow] = {};
              rowArr.forEach((val, cIdx) => {
                const actualCol = dataStartCol + cIdx;
                next[actualRow][actualCol] = val;
              });
            });
            return next;
          });
        })
        .catch(err => console.error("Data fetch error", err));
    }, 150); // 150ms debounce helps batch scrolling actions
  }, [visibleRange]);

  const onItemsRendered = useCallback(({ visibleRowStartIndex, visibleRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex }) => {
    setVisibleRange({
      startRow: visibleRowStartIndex,
      stopRow: visibleRowStopIndex,
      startCol: visibleColumnStartIndex,
      stopCol: visibleColumnStopIndex
    });
  }, []);

  const handleEdit = (r, c, val) => {
    setLocalEdits(prev => ({ ...prev, [`${r},${c}`]: val }));
  };

  const Cell = ({ columnIndex, rowIndex, style }) => {
    // Top-Left corner empty block
    if (rowIndex === 0 && columnIndex === 0) {
      return <div className="cell header-cell" style={style}></div>;
    }
    // Column Headers (A, B, C... or 1, 2, 3...)
    if (rowIndex === 0) {
      return <div className="cell header-cell col-header" style={style}>{columnIndex}</div>;
    }
    // Row Headers (1, 2, 3...)
    if (columnIndex === 0) {
      return <div className="cell header-cell row-header" style={style}>{rowIndex}</div>;
    }

    // Data cells
    const dRow = rowIndex - 1;
    const dCol = columnIndex - 1;
    
    const editedData = localEdits[`${dRow},${dCol}`];
    const serverData = dataCache[dRow]?.[dCol] || '...';
    
    const displayValue = editedData !== undefined ? editedData : serverData;

    return <EditCell style={style} initialValue={displayValue} onSave={(val) => handleEdit(dRow, dCol, val)} />;
  };

  return (
    <div className="grid-container">
      <h3>Grid Component {id}</h3>
      <div className="grid-wrapper">
        <Grid
          columnCount={COL_COUNT}
          columnWidth={COL_WIDTH}
          height={600}
          rowCount={ROW_COUNT}
          rowHeight={ROW_HEIGHT}
          width={700}
          onItemsRendered={onItemsRendered}
        >
          {Cell}
        </Grid>
      </div>
    </div>
  );
}

function EditCell({ style, initialValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(initialValue);

  // Sync val if initialValue gets populated after loading
  useEffect(() => {
    if (!isEditing) {
      setVal(initialValue);
    }
  }, [initialValue, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== initialValue) {
      onSave(val);
    }
  };

  if (isEditing) {
    return (
      <div className="cell data-cell active" style={style}>
        <input 
          autoFocus 
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') handleBlur() }}
        />
      </div>
    );
  }

  return (
    <div 
      className="cell data-cell" 
      style={style} 
      onDoubleClick={() => setIsEditing(true)}
      title="Double click to edit"
    >
      <span className="cell-content">{val}</span>
    </div>
  );
}
