import React from 'react';
import { Modal, Descriptions, Badge, Button } from 'antd';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';

const TicketDetailsModal = ({ visible, ticket, onClose, onCreateQuotation, onUpdateTicket }) => {

    console.log(ticket);
    return (
        <Modal
            title="Ticket Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={900} // Adjust modal width for better visibility
        >
            {ticket ? (
                <>
                    <Descriptions
                        bordered
                        size="middle"
                        title="Detailed Information"
                        column={2}
                        labelStyle={{ padding: '10px 24px' }}  // Adds padding for labels
                        contentStyle={{ padding: '10px 24px' }} // Adds padding for content
                    >
                        <Descriptions.Item label="Ticket ID" span={1}>{ticket.id}</Descriptions.Item>
                        <Descriptions.Item label="Title" span={1}>{ticket.Title}</Descriptions.Item>
                        {ticket.CustomerID && (
                            <Descriptions.Item label="Customer ID" span={1}>{ticket.CustomerID}</Descriptions.Item>
                        )}
                        <Descriptions.Item label="Created By" span={1}>{ticket.CreatedBy}</Descriptions.Item>

                        {/* hide priority */}
                        {/* <Descriptions.Item label="Priority" span={1}>
                            <Badge status={ticket.Priority === 'High' ? 'error' : 'warning'} text={ticket.Priority} />
                        </Descriptions.Item> */}
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
                            onClick={() => onUpdateTicket(ticket.id)}  // Call the update ticket function
                            style={{ marginRight: '10px' }}
                            icon={<ReloadOutlined />}
                        >
                            Update Ticket
                        </Button>

                        {/* Render the Create Quotation button if Chargeability is true */}
                        {ticket.Chargeability && (
                            <Button 
                                type="primary" 
                                onClick={() => onCreateQuotation(ticket.id)}  // Call the create quotation function
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
    );
};

export default TicketDetailsModal;
