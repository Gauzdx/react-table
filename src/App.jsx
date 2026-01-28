import { useEffect } from 'react'
import Table from './components/Table/Table'
import { useTableData } from './hooks/useTableData'

function App() {
  const {
    tablesData,
    initializeTable,
    updateRow,
    deleteRow,
    addRow,
    paginations,
    setPage,
    setPageSize,
    getTableData,
    getPagination
  } = useTableData()

  // Example table ID
  const MAIN_TABLE_ID = 'employees-table';

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Excel Table</h1>
        <p>Double-click cells to edit. Manage records with ease.</p>
      </header>

      <main>
        <Table
          tableId={MAIN_TABLE_ID}
          data={getTableData(MAIN_TABLE_ID)}
          pagination={getPagination(MAIN_TABLE_ID)}
          onUpdate={updateRow}
          onDelete={deleteRow}
          onAdd={addRow}
          onInitialize={initializeTable}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />

        {/* Demonstrate multiple tables support by adding another one slightly different if needed, 
            but for now sticking to one as per primary request, but the architecture supports N. */}
      </main>

      <footer className="app-footer">
        <p>Built with React & Vite - Premium Data Grid Experience</p>
      </footer>
    </div>
  )
}

export default App
