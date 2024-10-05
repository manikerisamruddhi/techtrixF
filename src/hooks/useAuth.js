import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '.././redux/slices/loginSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.users);

    const login = async (credentials) => { // Change `role` to `credentials`
        try {
            console.log(`logging ${credentials}`);
            await dispatch(loginUser(credentials)).unwrap(); // Pass entire credentials object
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
