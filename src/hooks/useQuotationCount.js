import { useMemo } from 'react';

const useQuotationCounts = (quotations) => {
    return useMemo(() => {
        // Ensure quotations is an array
        if (!Array.isArray(quotations) || quotations.length === 0) return { total: 0, pending: 0, approved: 0, closed: 0, open: 0 };

        let total = quotations.length;
        let pending = quotations.filter(ticket => ticket.status === 'Pending').length;
        let approved = quotations.filter(ticket => ticket.status === 'Approved').length;

        return { total, pending, approved, closed, open };
    }, [quotations]);
};

export default useQuotationCounts;
