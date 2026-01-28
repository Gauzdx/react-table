import React from 'react';

const Pagination = ({ tableId, pagination, totalRecords, onPageChange, onPageSizeChange }) => {
    const { page, pageSize } = pagination;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(tableId, page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            onPageChange(tableId, page - 1);
        }
    };

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                <span>Show</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(tableId, Number(e.target.value))}
                    className="page-size-select"
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span>entries</span>
            </div>

            <div className="pagination-controls">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="pagination-btn"
                >
                    Previous
                </button>
                <span className="page-indicator">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
