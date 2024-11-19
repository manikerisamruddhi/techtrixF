import { useMemo } from 'react';

const useUserCounts = (users) => {
    return useMemo(() => {
        // console.log(users);
        // Ensure quotations is an array
        if (!Array.isArray(users) || users.length === 0) {
             return { totalUser: 0, logistics: 0, serviceTechnical: 0, sales: 0};
        }

        let totalUser = users.length;
        let logistics = users.filter(user => user.role === 'Logistics').length;
        let serviceTechnical = users.filter(user => user.role === 'Service_Technical').length;
        let sales = users.filter(user => user.role === 'Sales').length;

        return { totalUser, logistics, serviceTechnical, sales};
    }, [users]);
};

export default useUserCounts;