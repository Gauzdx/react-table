import React from 'react';
import UnifiedTable from './UnifiedTable';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Virtualized Dual Grid Workbench</h1>
        <p>Two separate data grid components joined seamlessly into a single split-pane table, streaming independent CSVs.</p>
      </header>
      <div className="grids-view">
        <UnifiedTable />
      </div>
    </div>
  );
}

export default App;
