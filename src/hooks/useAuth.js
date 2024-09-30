import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../redux/slices/userSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.users);

    const login = async (role) => {
        try {
            // Only pass the role to loginUser and ignore email/password
            await dispatch(loginUser(role)).unwrap();
        } catch (err) {
            throw new Error('Failed to login');
        }
    };

    const logout = () => {
        dispatch(logoutUser());
    };

    return {
        user,
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;
