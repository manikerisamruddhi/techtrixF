import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketAttachments, uploadAttachment } from '../../redux/slices/ticketSlice';

const TicketAttachment = ({ ticketId }) => {
    const dispatch = useDispatch();
    const { attachments, loading, error } = useSelector((state) => state.tickets.attachments);
    const [file, setFile] = useState(null);

    useEffect(() => {
        dispatch(fetchTicketAttachments(ticketId));
    }, [dispatch, ticketId]);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (file) {
            dispatch(uploadAttachment({ ticketId, file }));
        }
    };

    return (
        <div className="ticket-attachment-container">
            <h2>Ticket Attachments</h2>
            {loading ? <p>Loading attachments...</p> : (
                <ul>
                    {attachments.map(attachment => (
                        <li key={attachment.id}>
                            <a href={attachment.url} download>{attachment.filename}</a>
                        </li>
                    ))}
                </ul>
            )}
            {error && <p>Error loading attachments</p>}
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileUpload} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default TicketAttachment;
