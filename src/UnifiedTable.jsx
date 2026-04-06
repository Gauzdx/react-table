import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import './UnifiedTable.css';

const ROW_COUNT = 1001; // 1000 data rows + 1 header
const COL_COUNT = 1001; 
const COL_WIDTH = 120;
const ROW_HEIGHT = 35;

export default function UnifiedTable() {
  const gridARef = useRef(null);
  const gridBRef = useRef(null);
  
  // Use a ref to prevent infinite scrolling event loops
  const isSyncing = useRef(false);

  const handleScrollA = useCallback(({ scrollTop, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested && gridBRef.current) {
      gridBRef.current.scrollTo({ scrollTop });
    }
  }, []);

  const handleScrollB = useCallback(({ scrollTop, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested && gridARef.current) {
        gridARef.current.scrollTo({ scrollTop });
    }
  }, []);

  return (
    <div className="unified-table-container">
      <div className="table-wrapper">
        <SubGrid source="A" ref={gridARef} onScroll={handleScrollA} hideRowHeaders={false} />
        <div className="grid-divider"></div>
        <SubGrid source="B" ref={gridBRef} onScroll={handleScrollB} hideRowHeaders={true} />
      </div>
    </div>
  );
}

const SubGrid = forwardRef(({ source, onScroll, hideRowHeaders }, ref) => {
  const [dataCache, setDataCache] = useState({});
  const [localEdits, setLocalEdits] = useState({});
  
  const [visibleRange, setVisibleRange] = useState({
    startRow: 0, stopRow: 20, startCol: 0, stopCol: 10
  });

  const fetchTimer = useRef(null);

  useEffect(() => {
    const dataStartRow = Math.max(0, visibleRange.startRow - 1);
    const dataStopRow = Math.min(1000, visibleRange.stopRow + 2);
    const dataStartCol = Math.max(0, visibleRange.startCol - (hideRowHeaders ? 0 : 1));
    const dataStopCol = Math.min(1000, visibleRange.stopCol + 2);

    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    
    fetchTimer.current = setTimeout(() => {
      fetch(`/api/data?source=${source}&startRow=${dataStartRow}&endRow=${dataStopRow}&startCol=${dataStartCol}&endCol=${dataStopCol}`)
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
    }, 150); 
  }, [visibleRange, source, hideRowHeaders]);

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
    const isRowHeaderCol = !hideRowHeaders && columnIndex === 0;

    if (rowIndex === 0 && isRowHeaderCol) {
      return <div className="cell header-cell" style={style}></div>;
    }
    if (rowIndex === 0) {
      const colLabel = hideRowHeaders ? columnIndex + 1 : columnIndex;
      return <div className="cell header-cell col-header" style={style}>Col {colLabel} ({source})</div>;
    }
    if (isRowHeaderCol) {
      return <div className="cell header-cell row-header" style={style}>{rowIndex}</div>;
    }

    const dRow = rowIndex - 1;
    const dCol = hideRowHeaders ? columnIndex : columnIndex - 1;
    
    const editedData = localEdits[`${dRow},${dCol}`];
    const serverData = dataCache[dRow]?.[dCol] || '...';
    
    const displayValue = editedData !== undefined ? editedData : serverData;

    return <EditCell style={style} initialValue={displayValue} onSave={(val) => handleEdit(dRow, dCol, val)} />;
  };

  return (
    <div className={`sub-grid pane-${source}`}>
      <Grid
        ref={ref}
        columnCount={hideRowHeaders ? COL_COUNT - 1 : COL_COUNT}
        columnWidth={COL_WIDTH}
        height={700}
        rowCount={ROW_COUNT}
        rowHeight={ROW_HEIGHT}
        width={hideRowHeaders ? 600 : 720}
        onItemsRendered={onItemsRendered}
        onScroll={onScroll}
      >
        {Cell}
      </Grid>
    </div>
  );
});

function EditCell({ style, initialValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(initialValue);

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
