import React, { useState } from 'react';
import { Modal, Descriptions, Badge, Button } from 'antd';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import CreateQuotationModal from './CreateQuotationByTicket'; // Importing the modal component
import UpdateTicketModal from './UpdateTicketModal'; // Importing the update ticket modal

const TicketDetailsModal = ({ visible, ticket, onClose, onCreateQuotation, onUpdateTicket }) => {
    const [isQuotationModalVisible, setQuotationModalVisible] = useState(false); // State to manage quotation modal visibility
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false); // State to manage update ticket modal visibility

    // Function to open the create quotation modal
    const handleCreateQuotationClick = () => {
        setQuotationModalVisible(true); // Open the create quotation modal
    };

    // Function to close the create quotation modal
    const handleQuotationModalClose = () => {
        setQuotationModalVisible(false); // Close the create quotation modal
    };

    // Function to open the update ticket modal and pass the ticket data
    const handleUpdateTicketClick = () => {
        setUpdateModalVisible(true); // Open the update ticket modal
    };

    // Function to close the update ticket modal
    const handleUpdateModalClose = () => {
        setUpdateModalVisible(false); // Close the update ticket modal
    };

    return (
        <>
            {/* Main Ticket Details Modal */}
            <Modal
                title="Ticket Details"
                visible={visible}
                onCancel={onClose}
                footer={null}
                centered
                width={900}
            >
                {ticket ? (
                    <>
                        <Descriptions
                            bordered
                            size="middle"
                            title="Detailed Information"
                            column={2}
                            labelStyle={{ padding: '10px 24px' }}
                            contentStyle={{ padding: '10px 24px' }}
                        >
                            <Descriptions.Item label="Ticket ID" span={1}>{ticket.id}</Descriptions.Item>
                            <Descriptions.Item label="title" span={1}>{ticket.title}</Descriptions.Item>
                            {ticket.customerID && (
                                <Descriptions.Item label="Customer ID" span={1}>{ticket.customerID}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Created By" span={1}>{ticket.createdBy}</Descriptions.Item>
                            <Descriptions.Item label="remark" span={2}>{ticket.remark}</Descriptions.Item>
                            <Descriptions.Item label="status" span={1}>
                                <Badge status={ticket.status === 'Resolved' ? 'success' : 'processing'} text={ticket.status} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Created Date" span={1}>{new Date(ticket.CreatedDate).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Resolved" span={1}>{ticket.isResolved ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Is Chargeable" span={1}>{ticket.isChargeble ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Assigned To" span={1}>{ticket.assignedTo ? ticket.assignedTo : 'Not Assigned'}</Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            {/* Update Ticket Button */}
                            <Button 
                                type="primary" 
                                onClick={handleUpdateTicketClick} // Open the Update Ticket modal
                                style={{ marginRight: '10px' }}
                                icon={<ReloadOutlined />}
                            >
                                Update Ticket
                            </Button>

                            {/* Render the Create Quotation button if isChargeble is true */}
                            {ticket.isChargeble && (
                                <Button 
                                    type="primary" 
                                    onClick={handleCreateQuotationClick}  // Open the Create Quotation modal
                                    icon={<DollarOutlined />}
                                >
                                    Create Quotation
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <p>No ticket details available</p>
                )}
            </Modal>

            {/* Create Quotation Modal */}
            <CreateQuotationModal 
                ticketId={ticket && ticket.id} 
                title="Create Quotation"
                visible={isQuotationModalVisible} // This controls the visibility of the quotation modal
                onCancel={handleQuotationModalClose} // Pass handleQuotationModalClose here
                footer={null}
                centered
            />

            {/* Update Ticket Modal */}
            <UpdateTicketModal
                ticketData={ticket} // Pass the current ticket data for updating
                isVisible={isUpdateModalVisible}
                onUpdate={(updatedTicket) => {
                    onUpdateTicket(updatedTicket);
                    handleUpdateModalClose();
                    // onClose();
                }}
                onCancel={handleUpdateModalClose}
                onClose={onClose}
            />
        </>
    );
};

export default TicketDetailsModal;
