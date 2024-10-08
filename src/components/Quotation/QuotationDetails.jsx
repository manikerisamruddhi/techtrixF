import React, { useRef } from 'react';
import { Modal, Descriptions, Badge, Button, Space } from 'antd';
import html2pdf from 'html2pdf.js';

const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    const modalContentRef = useRef();

    const handlePrintQuotation = () => {
        const pdfElement = createPdfContent(); // Generate content for PDF

        // Set PDF options
        const options = {
            margin: 1,
            filename: `Quotation_${quotation?.id || 'default'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().from(pdfElement).set(options).save();
    };

    const createPdfContent = () => {
        // Create a new div element for PDF content
        const pdfContent = document.createElement('div');
        pdfContent.innerHTML = `
            <h1 style="text-align:center;">Quotation</h1>
            <p style="text-align:center;">Techtrix Solutions Private Limited</p>
            <p style="text-align:center;">437 C/6 Narayan Peth Opp.LIC Common Wealth Bldg, Laxmi Road Pune-411030, Maharashtra, India.</p>
            <p style="text-align:center;">Phone No - 020 - 24470788, 24447772</p>
            <hr />
            <h3>Quotation ID: ${quotation.id}</h3>
            <h3>Ticket ID: ${quotation.TicketID}</h3>
            <h3>Created By: ${quotation.CreatedBy}</h3>
            <h3>Quotation Date: ${new Date(quotation.QuotationDate).toLocaleString()}</h3>
            <h3>Final Amount: ${quotation.FinalAmount}</h3>
            <h3>Status: <span style="color:${quotation.Status === 'Approved' ? 'green' : quotation.Status === 'Rejected' ? 'red' : 'orange'};">${quotation.Status}</span></h3>
            <h3>Created Date: ${new Date(quotation.CreatedDate).toLocaleString()}</h3>
            <h3>Comments: ${quotation.Comments}</h3>
            <div>
                <h2>Customer Acceptance (sign below):</h2>
                <p>Delivery: 3 to 4 Days</p>
                <p>Payment: 100% Advance</p>
                <p>Warranty / Support: As per Principal</p>
                <p>Transport: Ex Pune</p>
            </div>
            <h2>Terms and Conditions</h2>
            <ol>
                <li>Customer will be billed after indicating acceptance of this quote</li>
                <li>Taxes - Extra</li>
            </ol>
            <h2>Thank You For Your Business!</h2>
            <p>Your’s sincerely,</p>
            <p>For Techtrix Solutions Pvt. Ltd.</p>
            <p>Pune</p>
        `;
        return pdfContent;
    };

    const handleProceed = () => {
        console.log('Proceed with Quotation');
    };

    return (
        <Modal
            title="Quotation Details"
            visible={visible}
            onCancel={onClose}
            centered
            width={900}
            footer={[
                <Space key="actions" style={{ float: 'right' }}>
                    <Button key="print" onClick={handlePrintQuotation}>
                        Print Quotation
                    </Button>
                    <Button key="proceed" type="primary" onClick={handleProceed}>
                        Proceed
                    </Button>
                </Space>,
            ]}
        >
            <div ref={modalContentRef}> {/* Keep original design for viewing */}
                {quotation ? (
                    <Descriptions
                        bordered
                        size="middle"
                        column={2}
                        labelStyle={{ padding: '10px 24px' }}
                        contentStyle={{ padding: '10px 24px' }}
                    >
                        <Descriptions.Item label="Quotation ID" span={1}>{quotation.id}</Descriptions.Item>
                        <Descriptions.Item label="Ticket ID" span={1}>{quotation.TicketID}</Descriptions.Item>
                        <Descriptions.Item label="Created By" span={1}>{quotation.CreatedBy}</Descriptions.Item>
                        <Descriptions.Item label="Quotation Date" span={1}>{new Date(quotation.QuotationDate).toLocaleString()}</Descriptions.Item>
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
            </div>
        </Modal>
    );
};

export default QuotationDetailsModal;
