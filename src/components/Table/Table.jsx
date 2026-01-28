import React, { useEffect } from 'react';
import TableCell from './TableCell';
import Pagination from './Pagination';

const Table = ({
    tableId,
    data,
    pagination,
    onUpdate,
    onDelete,
    onAdd,
    onInitialize,
    onPageChange,
    onPageSizeChange
}) => {

    useEffect(() => {
        onInitialize(tableId);
    }, [tableId, onInitialize]);

    // Calculate slice manually for display
    const { page, pageSize } = pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayData = data.slice(startIndex, endIndex);

    // Derive columns from the first item or a fixed schema if data is empty (using fallback)
    const columns = data.length > 0 ? Object.keys(data[0]) : ['id', 'name', 'email', 'role', 'status', 'lastLogin', 'department', 'salary', 'performance', 'notes'];

    const handleAddRow = () => {
        const newRow = {
            name: 'New User',
            email: 'new@example.com',
            role: 'Developer',
            status: 'Pending',
            lastLogin: new Date().toISOString().split('T')[0],
            department: 'Engineering',
            salary: '$0',
            performance: '0%',
            notes: ''
        };
        onAdd(tableId, newRow);
    };

    return (
        <div className="table-wrapper">
            <div className="table-header-controls">
                <h2 className="table-title">Table: {tableId}</h2>
                <button onClick={handleAddRow} className="add-btn">
                    + Add New Record
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => (
                                    <TableCell
                                        key={`${row.id}-${col}`}
                                        tableId={tableId}
                                        rowId={row.id}
                                        field={col}
                                        value={row[col]}
                                        onUpdate={onUpdate}
                                    />
                                ))}
                                <td>
                                    <button
                                        onClick={() => onDelete(tableId, row.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {displayData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 1} className="no-data">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                tableId={tableId}
                pagination={pagination}
                totalRecords={data.length}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    );
};

export default Table;
