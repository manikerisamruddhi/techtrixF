import React, { useState } from 'react';
import { Modal, Descriptions, Badge, Button } from 'antd';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import CreateQuotationModal from './CreateQuotationByTicket'; // Importing the modal component

const TicketDetailsModal = ({ visible, ticket, onClose, onCreateQuotation, onUpdateTicket }) => {
    const [isQuotationModalVisible, setQuotationModalVisible] = useState(false); // State to manage quotation modal visibility

    // Function to open the create quotation modal
    const handleCreateQuotationClick = () => {
        setQuotationModalVisible(true); // Open the create quotation modal
    };

    // Function to close the create quotation modal
    const handleQuotationModalClose = () => {
        setQuotationModalVisible(false); // Close the create quotation modal
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
                            <Descriptions.Item label="Title" span={1}>{ticket.Title}</Descriptions.Item>
                            {ticket.CustomerID && (
                                <Descriptions.Item label="Customer ID" span={1}>{ticket.CustomerID}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Created By" span={1}>{ticket.CreatedBy}</Descriptions.Item>
                            <Descriptions.Item label="Remark" span={2}>{ticket.Remark}</Descriptions.Item>
                            <Descriptions.Item label="Status" span={1}>
                                <Badge status={ticket.Status === 'Resolved' ? 'success' : 'processing'} text={ticket.Status} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Created Date" span={1}>{new Date(ticket.CreatedDate).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Resolved" span={1}>{ticket.IsResolved ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Is Chargeable" span={1}>{ticket.Chargeability ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Assigned To" span={1}>{ticket.AssignedToID ? ticket.AssignedToID : 'Not Assigned'}</Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            {/* Update Ticket Button */}
                            <Button 
                                type="primary" 
                                onClick={() => onUpdateTicket(ticket.id)} 
                                style={{ marginRight: '10px' }}
                                icon={<ReloadOutlined />}
                            >
                                Update Ticket
                            </Button>

                            {/* Render the Create Quotation button if Chargeability is true */}
                            {ticket.Chargeability && (
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
        </>
    );
};

export default TicketDetailsModal;
