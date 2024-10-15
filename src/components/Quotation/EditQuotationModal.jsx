import React from 'react';
import { Modal } from 'antd';

const dummyQuotation = {
  preparedBy: 'Dummy User',
  customerName: 'Dummy Customer',
  comments: 'No comments available.',
  finalAmount: 0,
  status: 'Pending',
};

const createPdfContent = (quotation) => {
  return {
    preparedBy: quotation.preparedBy || 'Unknown',
    customerName: quotation.customerName || 'Unknown Customer',
    comments: quotation.comments || 'No comments available.',
    finalAmount: quotation.finalAmount || 0,
    status: quotation.status || 'Unknown Status',
  };
};

const QuotationDetailsModal = ({ visible, onClose }) => {
  const pdfContent = createPdfContent(dummyQuotation); // Use dummy data directly

  return (
    <Modal
      title="Quotation Details"
      visible={visible}
      onCancel={onClose}
    >
      <div>
        <p>Prepared By: {pdfContent.preparedBy}</p>
        <p>Customer Name: {pdfContent.customerName}</p>
        <p>Comments: {pdfContent.comments}</p>
        <p>Final Amount: ${pdfContent.finalAmount}</p>
        <p>Status: {pdfContent.status}</p>
      </div>
    </Modal>
  );
};

export default QuotationDetailsModal;
