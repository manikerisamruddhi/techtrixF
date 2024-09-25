import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useFetch = (fetchAction, selector, entityName) => {
    const dispatch = useDispatch();
    const { data, status, error } = useSelector(selector);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAction());
        }
    }, [dispatch, status, fetchAction]);

    return {
        data,
        status,
        error,
        isLoading: status === 'loading',
        isFailed: status === 'failed',
        isSucceeded: status === 'succeeded',
        errorMessage: error ? `Failed to fetch ${entityName}: ${error}` : '',
    };
};

export default useFetch;
