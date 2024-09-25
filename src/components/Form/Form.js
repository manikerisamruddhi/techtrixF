import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import styles from './Form.module.css';

const Form = ({ inputs, onSubmit, buttonLabel = 'Submit' }) => {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {inputs.map((input, idx) => (
                <Input
                    key={idx}
                    label={input.label}
                    type={input.type}
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    placeholder={input.placeholder}
                />
            ))}
            <Button>{buttonLabel}</Button>
        </form>
    );
};

export default Form;
