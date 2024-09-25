import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';

const useNotification = () => {
    const dispatch = useDispatch();

    const notify = (type, message) => {
        dispatch(addNotification({ type, message }));
    };

    return {
        notifySuccess: (message) => notify('success', message),
        notifyError: (message) => notify('error', message),
        notifyWarning: (message) => notify('warning', message),
    };
};

export default useNotification;
