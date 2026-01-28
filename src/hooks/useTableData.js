import { useState } from 'react';
import { INITIAL_DATA } from '../utils/dummyData';

export const useTableData = () => {
    // Store data per tableId: { [tableId]: [...rows] }
    const [tablesData, setTablesData] = useState({
        default: INITIAL_DATA // Initialize with one default table populated
    });

    // Store pagination per tableId: { [tableId]: { page: 1, pageSize: 25 } }
    const [paginations, setPaginations] = useState({
        default: { page: 1, pageSize: 25 }
    });

    const getTableData = (tableId) => {
        return tablesData[tableId] || [];
    };

    const getPagination = (tableId) => {
        return paginations[tableId] || { page: 1, pageSize: 25 };
    };

    const initializeTable = (tableId) => {
        if (!tablesData[tableId]) {
            setTablesData(prev => ({ ...prev, [tableId]: INITIAL_DATA }));
            setPaginations(prev => ({ ...prev, [tableId]: { page: 1, pageSize: 25 } }));
        }
    };

    const updateRow = (tableId, rowId, field, value) => {
        setTablesData((prev) => {
            const currentTableData = prev[tableId] || [];
            const updatedTableData = currentTableData.map((row) =>
                row.id === rowId ? { ...row, [field]: value } : row
            );
            return { ...prev, [tableId]: updatedTableData };
        });
    };

    const deleteRow = (tableId, rowId) => {
        setTablesData((prev) => {
            const currentTableData = prev[tableId] || [];
            const updatedTableData = currentTableData.filter((row) => row.id !== rowId);
            return { ...prev, [tableId]: updatedTableData };
        });
    };

    const addRow = (tableId, newRow) => {
        setTablesData((prev) => {
            const currentTableData = prev[tableId] || [];
            const rowWithId = { ...newRow, id: Date.now() }; // Simple ID generation
            return { ...prev, [tableId]: [...currentTableData, rowWithId] };
        });
    };

    const setPage = (tableId, page) => {
        setPaginations(prev => ({
            ...prev,
            [tableId]: { ...prev[tableId], page }
        }));
    };

    const setPageSize = (tableId, pageSize) => {
        setPaginations(prev => ({
            ...prev,
            [tableId]: { ...prev[tableId], pageSize, page: 1 } // Reset to page 1 on size change
        }));
    };

    return {
        tablesData,
        getTableData,
        initializeTable,
        updateRow,
        deleteRow,
        addRow,
        paginations,
        getPagination,
        setPage,
        setPageSize
    };
};
