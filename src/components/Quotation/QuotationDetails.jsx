import React, { useRef, useState } from 'react';
import { Modal, Button, Space } from 'antd';
import html2pdf from 'html2pdf.js';

const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    const modalContentRef = useRef();
    const [pdfContent, setPdfContent] = useState(null); // State for PDF content

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
            <body style="font-family: 'Arial', sans-serif; background-color: #fff; margin: 0; padding: 20px; color: #333;">
                <div style="max-width: 900px; margin: auto; background-color: #fff; padding: 30px; border: 2px solid #000; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <img src="logo.png" alt="Company Logo" style="max-width: 150px;">
                    </div>
                    <div style="text-align: left; margin-bottom: 30px;">
                        <p style="margin: 5px 0;"><strong>Techtrix Solutions Private Limited</strong></p>
                        <p style="margin: 5px 0;">437 C/6 Narayan Peth Opp. LIC Common Wealth Bldg, Laxmi Road, Pune-411030, Maharashtra, India.</p>
                        <p style="margin: 5px 0;">Web: www.techtrix.in | Email: info@techtrix.in</p>
                        <p style="margin: 5px 0;">Phone No: 020 - 24470788, 24447772</p>
                    </div>
                    <div style="text-align: left; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Prepared By:</strong> Subhash Kandhare</p>
                        <p style="margin: 5px 0;"><strong>Customer:</strong> Bajaj Auto, Hinjewadi, Pune - 411057</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> 12-Aug-24 | <strong>Quote Ref No:</strong> TSPL/Quote/SK/228/24-25</p>
                    </div>
                    <h2 style="font-size: 22px; color: #000; margin-bottom: 20px;">Items</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #000; padding: 12px; background-color: #f1f1f1; font-weight: bold;">Sr No</th>
                                <th style="border: 1px solid #000; padding: 12px; background-color: #f1f1f1; font-weight: bold;">Description</th>
                                <th style="border: 1px solid #000; padding: 12px; background-color: #f1f1f1; font-weight: bold;">Qty</th>
                                <th style="border: 1px solid #000; padding: 12px; background-color: #f1f1f1; font-weight: bold;">Unit Price</th>
                                <th style="border: 1px solid #000; padding: 12px; background-color: #f1f1f1; font-weight: bold;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border: 1px solid #000; padding: 12px;">1</td>
                                <td style="border: 1px solid #000; padding: 12px;">Dell Latitude 3400 Laptop - i3 - Black</td>
                                <td style="border: 1px solid #000; padding: 12px;">3 Nos</td>
                                <td style="border: 1px solid #000; padding: 12px;">₹47,750.00</td>
                                <td style="border: 1px solid #000; padding: 12px;">₹1,43,250.00</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #000; padding: 12px;">2</td>
                                <td style="border: 1px solid #000; padding: 12px;">HP Pavilion X360 Convert 14</td>
                                <td style="border: 1px solid #000; padding: 12px;">1 Nos</td>
                                <td style="border: 1px solid #000; padding: 12px;">₹72,500.00</td>
                                <td style="border: 1px solid #000; padding: 12px;">₹72,500.00</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Customer will be billed </strong> after indicating acceptance of this quote.</p>
                        <p style="margin: 5px 0;"><strong>Taxes:</strong> Extra.</p>
                        <p style="margin: 5px 0;"><strong>Delivery:</strong> 3 to 4 Days</p>
                        <p style="margin: 5px 0;"><strong>Payment:</strong> 100% Advance</p>
                        <p style="margin: 5px 0;"><strong>Warranty / Support:</strong> As per Principal</p>
                        <p style="margin: 5px 0;"><strong>Transport:</strong> Ex Pune</p>
                    </div>
                    <h5 style="font-size: 16px; margin-top: 20px;">Customer Acceptance (sign below):</h5>
                    <div style="text-align: center; margin-top: 40px;">
                        <h4 style="font-size: 20px; margin-bottom: 10px;">Thank You For Your Business!</h4>
                        <p style="margin: 5px 0;">Your’s sincerely,</p>
                        <p style="margin: 5px 0;">For Techtrix Solutions Pvt. Ltd.</p>
                        <p style="margin: 5px 0;">Pune</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #000; margin: 30px 0;" />
                    <div style="margin-top: 40px; text-align: left; font-style: italic;">
                        <p>If you have any questions about this price quote, please contact Subhash Kandhare at +91 9890180071 or Subhash@techtrix.in</p>
                    </div>
                </div>
            </body>`;
        return pdfContent;
    };

    const handleProceed = () => {
        // Proceed with the quotation logic
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
                    <Button key="edit" onClick={() => console.log("Edit Quotation")}>
                        Edit Quotation
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
            <div
                ref={modalContentRef}
                style={{
                    maxHeight: '600px', // Set fixed max height
                    overflowY: 'auto', // Enable vertical scrolling if content exceeds height
                    padding: '5px', // Optional padding for content area
                }}
            >
                {/* Render the PDF content directly in the modal */}
                <div dangerouslySetInnerHTML={{ __html: createPdfContent().innerHTML }} />
            </div>
        </Modal>
    );
};

export default QuotationDetailsModal;
