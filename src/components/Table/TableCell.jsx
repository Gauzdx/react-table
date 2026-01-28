import React, { useState, useEffect, useRef } from 'react';

const TableCell = ({ value, field, rowId, tableId, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (currentValue !== value) {
            onUpdate(tableId, rowId, field, currentValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setCurrentValue(value);
        }
    };

    return (
        <td
            className="table-cell"
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="cell-input"
                />
            ) : (
                <span className="cell-value">{value}</span>
            )}
        </td>
    );
};

export default TableCell;
