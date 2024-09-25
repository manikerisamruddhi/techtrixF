import { useState } from 'react';

const useForm = (initialValues, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });

        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }

        setTouched({
            ...touched,
            [name]: true,
        });
    };

    const handleSubmit = (event, callback) => {
        event.preventDefault();
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                callback();
            }
        } else {
            callback();
        }
    };

    return {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
    };
};

export default useForm;
