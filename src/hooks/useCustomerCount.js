import { useMemo } from 'react';

const useCustomerCounts = (customers) => {
    return useMemo(() => {
        // console.log(customers);
        // Ensure quotations is an array
        if (!Array.isArray(customers) || customers.length === 0) return { totalCustomers: 0};

        let totalCustomers = customers.length;
        // let logistics = customers.filter(cust => cust.role === 'Logistics').length;
        // let serviceTechnical = customers.filter(cust => cust.role === 'Sales').length;
        // let sales = customers.filter(cust => cust.role === 'Service_Technical').length;

        return { totalCustomers};
    }, [customers]);
};

export default useCustomerCounts;