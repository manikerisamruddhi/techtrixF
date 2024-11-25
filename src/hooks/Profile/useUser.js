import { useState, useEffect } from 'react';

const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const updateUser = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logoutUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, updateUser, logoutUser };
};

export default useUser;
