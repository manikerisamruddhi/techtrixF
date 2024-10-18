import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Space } from 'antd';
import html2pdf from 'html2pdf.js';

const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    const modalContentRef = useRef();
    const [pdfContent, setPdfContent] = useState(null); // State for PDF content

    const [quotationTerms, setQuotationTerms] = useState({
        billing: 'Customer will be billed after indicating acceptance of this quote.',
        taxes: 'Inclusive in qoutation',
        delivery: '3 to 4 Days',
        payment: '100% Advance',
        warranty: 'As per Principal',
        transport: 'Ex Pune'
    });

    // useEffect(() => {
    //     if (visible) {
    //         fetchQuotationTerms();
    //     }
    // }, [visible]);

    // const fetchQuotationTerms = async () => {
    //     // Replace with real API call
    //     const response = await fetch('/api/quotationTerms'); // Assuming the endpoint exists
    //     const data = await response.json();
    //     setQuotationTerms(data);
    // };

    const handlePrintQuotation = () => {
        const pdfElement = createPdfContent(); // Generate content for PDF

        // Set PDF options
        const options = {
            margin: [0.5, 0.5], // Tighten margins to fit content on one page
            filename: `Quotation_${quotation?.id || 'default'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().from(pdfElement).set(options).save();
    };

    const createPdfContent = () => {
        const pdfContent = document.createElement('div');
        let products = quotation?.products || []; // Assuming quotation has a products array

        if (products.length === 0) {
            products = [
                {
                    description: 'Sample Product 1',
                    quantity: 2,
                    unitPrice: 500,
                    amount: 1000,
                    gstAmount: 180, // Example GST
                    TotalAmount: 1180, // Amount + GST
                },
                {
                    description: 'Sample Product 2',
                    quantity: 1,
                    unitPrice: 800,
                    amount: 800, gstAmount: 144, // Example GST
                    TotalAmount: 944, // Amount + GST
                },
            ];
        }

        const productsRows = products.map((product, index) => `
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">${index + 1}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">${product.description}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">${product.quantity} Nos</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">₹${product.unitPrice}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">₹${product.amount}</td>
                  <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">₹${product.gstAmount}</td>
            <td style="border: 1px solid #000; padding: 8px; font-size: 10px;">₹${product.TotalAmount}</td>
      
            </tr>

            
        `).join('');

        const totalFinalAmount = products.reduce((accumulator, product) => accumulator + product.TotalAmount, 0);

        pdfContent.innerHTML = `
            <body style="font-family: 'Arial', sans-serif; background-color: #fff; margin: 0; padding: 0.5in; color: #333;">
                <div style="max-width: 100%; margin: auto; background-color: #fff; padding: 20px; border: 1px solid #000;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <img src="logo.png" alt="Company Logo" style="max-width: 120px;">
                    </div>

                    <div style="margin-bottom: 15px; font-size: 10px; display: flex;
    align-items: center;
    justify-content: space-between;">
                    <div style="text-align: left; font-size: 10px; ">
                    <div style="text-align: left; margin-bottom: 15px; font-size: 10px;">
                        <p><strong>Techtrix Solutions Private Limited</strong></p>
                        <p>437 C/6 Narayan Peth Opp. LIC Common Wealth Bldg,</p>
                        <p>Laxmi Road, Pune-411030, Maharashtra, India.</p>
                        <p>Web: www.techtrix.in | Email: info@techtrix.in</p>
                        <p>Phone No: 020 - 24470788, 24447772</p>
                    </div>

                    
                    
                     <p><strong>Prepared By:</strong> ${quotation?.createdBy || 'N/A'} name will be displayed</p>
                          
                        </div>
                        <div style="text-align: left; font-size: 10px;  margin-bottom: 5%;">
                            <p><strong>Date:</strong> ${quotation?.QuotationDate || '18/10/2024'}</p>
                            <p><strong>customerID:</strong> 'custid'</p>
                            <p><strong>Q ID:</strong> 'qid'</p>
                            <p><strong>validity:</strong> 'validity'</p>
                        </div>
                    </div>


<div  style="font-family: 'Arial', sans-serif; font-size: 10px; ">
                    <div style="     background-color: #8080807d;
    font-weight: bolder;">  <strong>Customer:</strong></br>  </div>
                               ${quotation?.customer || 'name will be displayed'}</br>
                               ${quotation?.customer || 'address will Be displayed'} </br>
                             ${quotation?.customer || 'phone no. displayed'}</br>
                           
</div>
                        
                        <h3 style="font-size: 12px; color: #000; margin-bottom: 10px;">products:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">Sr No</th>
                                <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">Description</th>
                                <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">Qty</th>
                                <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">Unit Price</th>
                                <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">Amount</th>
                           <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">GST Amount</th>
                            <th style="border: 1px solid #000; padding: 8px; background-color: #f1f1f1; font-size: 10px;">Total Amount</th>
                          
                            </tr>
                        </thead>
                        <tbody>
                            ${productsRows}
                        </tbody>
                        
                    </table>
                    

 <div style="margin-top: 10px; margin-right: 20px; text-align: right; font-style: bold; font-size: 10px; font-weight:bold; ">
                        <span >Total Final Amount : </span>
                        <span style="text-decoration:underline;"> ₹ ${totalFinalAmount} </span>
                    </div>

                    <div style="margin-bottom: 10px; font-size: 10px; display: flex;
    align-items: center;
    justify-content: space-between;" >
                       <div  >
                        <p><strong>Customer will be billed:</strong> ${quotationTerms.billing}</p>
                        <p><strong>Taxes:</strong> ${quotationTerms.taxes}</p>
                        <p><strong>Delivery:</strong> ${quotationTerms.delivery}</p>
                        <p><strong>Payment:</strong> ${quotationTerms.payment}</p>
                        <p><strong>Warranty / Support:</strong> ${quotationTerms.warranty}</p>
                        <p><strong>Transport:</strong> ${quotationTerms.transport}</p>
                        </div>

                         <div style="text-align: center; font-size: 10px;     margin-top: 5%;">
                     
                        <p>Your’s sincerely,</p>
                        <p>For Techtrix Solutions Pvt. Ltd. </p>
                     <p>  Pune</p>
                    </div>
                    </div>
                    <h5 style="font-size: 10px; margin-top: 10px;">Customer Acceptance (sign below):</h5>
 <hr style="border: none; border-top: 1px solid #000; margin-bottom: -1%; margin-top: 4%;" />
                    

                        
                    <div style="text-align: center; font-style: italic; font-size: 10px;">
                        <p>If you have any questions about this price quote, please contact at helpdesk@techtrix.in</p>
                    </div>
                    <div style="text-align: center;     margin-bottom: -2%; font-size: 10px;">
                        <h4 style="font-size: 10px;">Thank You For Your Business!</h4>
                        </div>
                </div>
            </body>
        `;
        return pdfContent;
    };

    return (
        <Modal
            title="Quotation Details"
            visible={visible}
            onCancel={onClose}
            centered
            width={700}
            footer={[
                <Space key="actions" style={{ float: 'right' }}>
                    <Button key="edit" onClick={() => console.log("Edit Quotation")}>
                        Edit Quotation
                    </Button>
                    <Button key="print" onClick={handlePrintQuotation}>
                        Download Quotation
                    </Button>
                    <Button key="proceed" type="primary" onClick={() => console.log('Proceed with Quotation')}>
                        Proceed
                    </Button>
                </Space>,
            ]}
        >
            <div
                ref={modalContentRef}
                style={{
                    maxHeight: '600px',
                    overflowY: 'auto',
                    padding: '5px',
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: createPdfContent().innerHTML }} />
            </div>
        </Modal>
    );
};

export default QuotationDetailsModal;
