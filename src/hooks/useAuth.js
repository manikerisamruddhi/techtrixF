import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../redux/slices/userSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.users);

    const login = async (credentials) => {
        try {
            await dispatch(loginUser(credentials)).unwrap();
        } catch (err) {
            throw new Error('Failed to login');
        }
    };

    const logout = () => {
        dispatch(logoutUser());
    };

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;
