// TicketDetailsModal.jsx

import React from 'react';
import { Modal } from 'antd';

const TicketDetailsModal = ({ visible, ticket, onClose }) => {
    return (
        <Modal
            title="Ticket Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {ticket && (
                <div>
                    <p><strong>Ticket ID:</strong> {ticket.id}</p>
                    <p><strong>Title :</strong> {ticket.Title}</p>
                    <p><strong>Customer ID :</strong> {ticket.CustomerID}</p>
                    <p><strong>Created By :</strong> {ticket.CreatedBy}</p>
                    <p><strong>Priority :</strong> {ticket.Priority}</p>
                    <p><strong>Remark :</strong> {ticket.Remark}</p>
                    <p><strong>Status :</strong> {ticket.Status}</p>
                    {/* <p><strong>Category :</strong> {ticket.Category}</p> */}
                    <p><strong>Created Date :</strong> {new Date(ticket.CreatedDate).toLocaleString()}</p>
                    <p><strong>Resolved :</strong> {ticket.IsResolved ? 'Yes' : 'No'}</p>
                    <p><strong>Assigned To ID :</strong> {ticket.AssignedToID}</p>
                </div>
            )}
        </Modal>
    );
};

export default TicketDetailsModal;


// a issue of new ticket added assigned id if he refreshed it will show