import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketThreads, addThread } from '../../redux/slices/ticketSlice';

const TicketThread = ({ ticketId }) => {
    const dispatch = useDispatch();
    const { threads, loading, error } = useSelector((state) => state.tickets.threads);
    const [newThread, setNewThread] = useState('');

    useEffect(() => {
        dispatch(fetchTicketThreads(ticketId));
    }, [dispatch, ticketId]);

    const handleAddThread = (e) => {
        e.preventDefault();
        dispatch(addThread({ ticketId, message: newThread }));
        setNewThread('');
    };

    return (
        <div className="ticket-thread-container">
            <h2>Ticket Threads</h2>
            {loading ? <p>Loading threads...</p> : (
                <ul>
                    {threads.map(thread => (
                        <li key={thread.id}>{thread.message}</li>
                    ))}
                </ul>
            )}
            {error && <p>Error loading threads</p>}
            <form onSubmit={handleAddThread}>
                <textarea
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    placeholder="Add a new thread"
                    required
                />
                <button type="submit">Add Thread</button>
            </form>
        </div>
    );
};

export default TicketThread;
