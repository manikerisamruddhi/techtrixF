import { useMemo } from 'react';

const useTicketCounts = (tickets) => {
    return useMemo(() => {
        // Ensure tickets is an array
        if (!Array.isArray(tickets) || tickets.length === 0) return { total: 0, inProgress: 0, resolved: 0, closed: 0, open: 0 };

        let total = tickets.length;
        let inProgress = tickets.filter(ticket => ticket.Status === 'in-progress').length;
        let open = tickets.filter(ticket => ticket.Status === 'Open').length;
        let resolved = tickets.filter(ticket => ticket.Status === 'Resolved').length;
        let closed = tickets.filter(ticket => ticket.Status === 'Closed').length;

        return { total, inProgress, resolved, closed, open };
    }, [tickets]);
};

export default useTicketCounts;
