import React, { useEffect, useState } from 'react';
import { Input } from 'antd' ;

const EditableCell = ({ editable, value, onChange, ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleClick = () => {
        setEditing(true);
    };

    const handleBlur = () => {
        setEditing(false);
        onChange(inputValue);
    };

    return (
        <td {...restProps} onDoubleClick={handleClick}>
            {editing ? (
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                />
            ) : (
                value
            )}
        </td>
    );
};

export default EditableCell;