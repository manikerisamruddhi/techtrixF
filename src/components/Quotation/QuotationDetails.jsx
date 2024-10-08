import React from 'react';
import { Modal, Descriptions, Badge } from 'antd';

const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    return (
        <Modal
            title="Quotation Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={900} // Adjust modal width for better visibility
        >
            {quotation ? (
                <Descriptions
                    bordered
                    size="middle"
                    title="Quotation Information"
                    column={2}
                    labelStyle={{ padding: '10px 24px' }}  // Adds padding for labels
                    contentStyle={{ padding: '10px 24px' }} // Adds padding for content
                >
                    <Descriptions.Item label="Quotation ID" span={1}>{quotation.id}</Descriptions.Item>
                    <Descriptions.Item label="Ticket ID" span={1}>{quotation.TicketID}</Descriptions.Item>
                    <Descriptions.Item label="Created By" span={1}>{quotation.CreatedBy}</Descriptions.Item>
                    <Descriptions.Item label="Quotation Date" span={1}>{new Date(quotation.QuotationDate).toLocaleString()}</Descriptions.Item>
                    {/* <Descriptions.Item label="Total Amount" span={1}>{quotation.TotalAmount.toFixed(2)}</Descriptions.Item> */}
                    {/* <Descriptions.Item label="Discount" span={1}>{quotation.Discount.toFixed(2)}</Descriptions.Item> */}
                    <Descriptions.Item label="Final Amount" span={1}>{quotation.FinalAmount}</Descriptions.Item>
                    <Descriptions.Item label="Status" span={1}>
                        <Badge status={quotation.Status === 'Approved' ? 'success' : quotation.Status === 'Rejected' ? 'error' : 'processing'} text={quotation.Status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created Date" span={1}>{new Date(quotation.CreatedDate).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Comments" span={2}>{quotation.Comments}</Descriptions.Item>
                </Descriptions>
            ) : (
                <p>No quotation details available</p>
            )}
        </Modal>
    );
};

export default QuotationDetailsModal;
