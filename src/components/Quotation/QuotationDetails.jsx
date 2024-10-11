import React, { useRef, useState } from 'react';
import { Modal, Descriptions, Badge, Button, Space } from 'antd';
import html2pdf from 'html2pdf.js';

const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    const modalContentRef = useRef();
    const [pdfContent, setPdfContent] = useState(null); // State for PDF content preview
    const [showPdfPreview, setShowPdfPreview] = useState(false); // State to control PDF preview modal

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
        <table style="width:100%; border-collapse: collapse;">
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Quotation ID:</strong> ${quotation.id}</td>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Created Date:</strong> ${quotation.CreatedDate}</td>
         
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Created By:</strong> ${quotation.CreatedBy}</td>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Status:</strong> <span style="color:${quotation.Status === 'Approved' ? 'green' : quotation.Status === 'Rejected' ? 'red' : 'orange'};">${quotation.Status}</span></td>
          
               </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>Final Amount:</strong> ${quotation.FinalAmount}</td>
                     <td style="border: 1px solid #000; padding: 8px;"><strong>Comments:</strong> ${quotation.Comments}</td>
                  </tr>
            <tr>
            </tr>
        </table>
        <div>
          
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
          <h5  style="text-align:right;">Customer Acceptance (sign below):</h5>
          </br>
        <hr />
        <div style="text-align:center;">
        <h4>Thank You For Your Business!</h4>
        <p>Your’s sincerely,</p>
        <p>For Techtrix Solutions Pvt. Ltd.</p>
        <p>Pune</p> 
        </div> `;
        return pdfContent;
    };

    const handleProceed = () => {
        //console.log('Proceed with Quotation');
    };

    const handleViewDetails = () => {
        const content = createPdfContent();
        setPdfContent(content.innerHTML); // Set PDF content for preview
        setShowPdfPreview(true); // Show PDF preview modal
    };

    return (
        <>
            <Modal
                title="Quotation Details"
                visible={visible}
                onCancel={onClose}
                centered
                width={900}
                footer={[
                    <Space key="actions" style={{ float: 'right' }}>
                        <Button key="view-details" onClick={handleViewDetails}>
                            View Quotation
                        </Button>
                        <Button key="print" onClick={handlePrintQuotation}>
                            Download Quotation
                        </Button>
                        <Button key="proceed" type="primary" onClick={handleProceed}>
                            Proceed
                        </Button>
                    </Space>,
                ]}
            >
                <div ref={modalContentRef}>
                    {quotation ? (
                        <Descriptions
                            bordered
                            size="middle"
                            column={2}
                            labelStyle={{ padding: '10px 24px' }}
                            contentStyle={{ padding: '10px 24px' }}
                        >
                            <Descriptions.Item label="Quotation ID" span={1}>{quotation.id}</Descriptions.Item>
                            {/* <Descriptions.Item label="Ticket ID" span={1}>{quotation.TicketID}</Descriptions.Item> */}
                            <Descriptions.Item label="Created By" span={1}>{quotation.CreatedBy}</Descriptions.Item>
                            {/* <Descriptions.Item label="Quotation Date" span={1}>{new Date(quotation.QuotationDate).toLocaleString()}</Descriptions.Item> */}
                            <Descriptions.Item label="Final Amount" span={1}>{quotation.FinalAmount}</Descriptions.Item>
                            <Descriptions.Item label="Status" span={1}>
                                <Badge status={quotation.Status === 'Approved' ? 'success' : quotation.Status === 'Rejected' ? 'error' : 'processing'} text={quotation.Status} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Created Date" span={1}>{quotation.CreatedDate}</Descriptions.Item>
                            <Descriptions.Item label="Comments" span={2}>{quotation.Comments}</Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>No quotation details available</p>
                    )}
                </div>
            </Modal>

            {/* PDF Preview Modal */}
            <Modal
                title="PDF Preview"
                visible={showPdfPreview}
                onCancel={() => setShowPdfPreview(false)}
                footer={null}
                width={800}
            >
                <div dangerouslySetInnerHTML={{ __html: pdfContent }} />
            </Modal>
        </>
    );
};

export default QuotationDetailsModal;
