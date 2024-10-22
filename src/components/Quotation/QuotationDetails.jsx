import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Space ,message} from 'antd';
import html2pdf from 'html2pdf.js';
import EditQuotationModal from './EditQuotationModal';
import { updateQuotation } from "../../redux/slices/quotationSlice"; 
import { useDispatch } from "react-redux";
import moment from 'moment/moment';

const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    const dispatch = useDispatch();
    const modalContentRef = useRef();
    const [pdfContent, setPdfContent] = useState(null); // State for PDF content
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for Edit modal visibility
    const [editedQuotation, setEditedQuotation] = useState(quotation); // State to store the edited quotation
   
    const handleEditQuotation = (updatedQuotation) => {
        setEditedQuotation(updatedQuotation);
    };
    const [editableProducts, setEditableProducts] = useState(quotation?.products || []); // Editable products


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
    const handleSaveEdit = (updatedProducts, updatedTerms) => {
        setEditableProducts(updatedProducts); // Update products
        setQuotationTerms(updatedTerms); // Update terms
        setIsEditModalVisible(false); // Close the modal
    };

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

    const formattedDate = moment(quotation?.QuotationDate || '2024-10-18').format('YYYY-MM-DD');

   

// ...

const handleProceed = () => {
    if (!quotation || !quotation.id) {
        console.error("Quotation ID is missing.");
        return;
    }

    // Show confirmation modal
    Modal.confirm({
        title: 'Are you sure you want to proceed?',
        content: 'This will approve the quotation and update its status.',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
            // If the user confirms, proceed with updating the quotation
            const updatedQuotationData = {
                status: "Approved", // Assuming you want to update the status
                // You can add other fields here if needed
            };

            // Dispatch the action to update the quotation
            dispatch(updateQuotation({ id: quotation.id, data: updatedQuotationData }))
                .then(() => {
                    // Handle success
                    console.log(`Quotation ID ${quotation.id} has been approved.`);
                    message.success("Quotation approved successfully!");

                    // Optional: Perform additional actions, like redirecting
                })
                .catch((error) => {
                    // Handle error
                    console.error("Failed to approve the quotation:", error);
                    message.error("Failed to approve the quotation.");
                });
        },
        onCancel() {
            console.log('User canceled proceeding with the quotation.');
        }
    });
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
                    description: 'Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2',
                    quantity: 1,
                    unitPrice: 800,
                    amount: 800, gstAmount: 144, // Example GST
                    TotalAmount: 944, // Amount + GST
                },
                {
                    description: 'Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2',
                    quantity: 1,
                    unitPrice: 800,
                    amount: 800, gstAmount: 144, // Example GST
                    TotalAmount: 944, // Amount + GST
                },
                {
                    description: 'Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2',
                    quantity: 1,
                    unitPrice: 800,
                    amount: 800, gstAmount: 144, // Example GST
                    TotalAmount: 944, // Amount + GST
                },
                {
                    description: 'Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2',
                    quantity: 1,
                    unitPrice: 800,
                    amount: 800, gstAmount: 144, // Example GST
                    TotalAmount: 944, // Amount + GST
                },
                {
                    description: 'Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2Sample Product 2',
                    quantity: 1,
                    unitPrice: 800,
                    amount: 800, gstAmount: 144, // Example GST
                    TotalAmount: 944, // Amount + GST
                },
            ];
        }

        const productsRows = products.map((product, index) => `
            <tr>
                <td style="border: 1px solid #000;   padding: 5px; font-size: 10px;">${index + 1}</td>
                <td style="border: 1px solid #000;   padding: 5px; font-size: 10px;">${product.description}brand modal</td>
                <td style="border: 1px solid #000;  text-align: right;  padding: 5px; font-size: 10px;">${product.quantity}</td>
                <td style="border: 1px solid #000;  text-align: right;  padding: 5px; font-size: 10px;"> Nos</td>
                <td style="border: 1px solid #000;  text-align: right;  padding: 5px; font-size: 10px;">₹${product.unitPrice}</td>
                <td style="border: 1px solid #000;  text-align: right;  padding: 5px; font-size: 10px;">₹${product.amount}</td>
            
      
            </tr>

            
        `).join('');

        const totalFinalAmount = products.reduce((accumulator, product) => accumulator + product.TotalAmount, 0);

        pdfContent.innerHTML = `
            <body style="font-family: 'Arial',  sans-serif; font-size: 10px; background-color: #fff; margin: 0; padding: 0.5in; color: #333;">
                <div style="max-width: 100%; margin: auto; background-color: #fff; padding: 20px; border: 1px solid #000;">
                    <div style="display: flex; justify-content: space-between; align-items: center; ">
                        <img src="logo.png" alt="Company Logo" style="      max-width: 22%; margin-top:-1%;
 
        margin-left: -0.5%;">
                        <h2 style="       margin-top: -1%;
    color: #17A0CC; margin-right: 1.5%;">Quotation</h2>
                    </div>

                    <div style=" font-size: 10px;     margin-top: 2%; display: flex;
    align-items: center;
    justify-content: space-between;">
                    <div style="text-align: left; font-size: 10px; ">
                    <div style="text-align: left; margin-bottom: 15px; font-size: 10px;">
                        <strong style>Techtrix Solutions Private Limited</strong> </br>
                        437 C/6 Narayan Peth Opp. LIC Common Wealth Bldg, </br>
                        Laxmi Road, Pune-411030, Maharashtra, India. </br>
                        Web: www.techtrix.in | Email: info@techtrix.in </br>
                        Phone No: 020 - 24470788, 24447772 </br>
                    </div>

                    
                    
                     <p><strong>Prepared By:</strong> ${quotation?.createdBy || 'N/A'} name will be displayed</p>
                          
                        </div>
                    <table style="border-collapse: collapse; font-size: 8px; margin-bottom: 5%; border: 1px solid black; width: auto;">
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Date</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">${quotation?.formattedDate || '18/10/2024'}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Customer ID</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">'custid'</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Q ID</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">'qid'</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Validity</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">'validity'</td>
    </tr>
</table>


                    </div>


<div  style="font-family: 'Arial', sans-serif; font-size: 10px; ">
                    <div style="     background-color: #838282; color:white;
    font-weight: bolder;">  <strong  style=" margin-left:0.5%;">Customer:</strong></br>  </div>
                               ${quotation?.customer || 'name will be displayed'}</br>
                               ${quotation?.customer || 'address will Be displayed'} </br>
                             ${quotation?.customer || 'phone no. displayed'}</br>
                           
</div>
                        
                        <h3 style="font-size: 12px; color: #000; margin-bottom: 10px; margin-top: 10px;">products:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                        <thead >
                            <tr>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Sr No</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Description</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Qty</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">UoM</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Unit Price</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Amount</th>
                           
                            </tr>
                            
                        </thead>
                        <tbody>
                            ${productsRows}
                            <tr>
            <!-- Empty cells for the first 6 columns -->
            <td ></td>
            <td ></td>
            <td ></td>
            <td ></td>
            <td ></td>
            <!-- Validity in the 7th column -->
            <td>
            
             <table style="border-collapse: collapse; font-size: 10px; margin-bottom: 5%; border: 1px solid black; width: 100%;">
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Subtotal</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">₹ ${totalFinalAmount} </td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Tax Rate 18 %</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">8989</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Tax Rate 28 %</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">8989</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Total Amount</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">898989</td>
    </tr>
</table>
            
            </td>
        </tr>
                        </tbody>
                          
                    </table>
                    



                    <div style="margin-bottom: 10px; font-size: 10px; display: flex;
                        margin-top: -6%;
    align-items: center;
    justify-content: space-between;" >

    
                       <div  >
                        <p style=" margin-bottom:-2%; border: 1px solid #000; padding: 2px; background-color: #17A0CC; color:white; font-size: 10px;"><strong>Terms and conditions:</strong><p>
                        <span><strong>Customer will be billed:</strong> ${quotationTerms.billing}</span></br>
                        <span><strong>Taxes:</strong> ${quotationTerms.taxes}</span></br>
                        <span><strong>Delivery:</strong> ${quotationTerms.delivery}</span></br>
                        <span><strong>Payment:</strong> ${quotationTerms.payment}</span></br>
                        <span><strong>Warranty / Support:</strong> ${quotationTerms.warranty}</span></br>
                        <span><strong>Transport:</strong> ${quotationTerms.transport}</span></br>
                        </div>

                         <div style="text-align: center; font-size: 10px;     margin-top: 10%;">
                     

                         <div style="display:flex; flex-direction:column;">

                        
                         
                        <span style="margin-bottom: -12%">Your’s sincerely,</span></br>
                        <span style="margin-bottom: -12%">For Techtrix Solutions Pvt. Ltd., </span></br>
                        <span style="margin-bottom: -12%">  Pune</span></br>
                        <span style="margin-bottom: -12%"> prepared By name and phone no.</span></br>
                        
                        </div>
                       
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
        <>
        <Modal
            title="Quotation Details"
            visible={visible}
            onCancel={onClose}
            centered
            width={800}
            style={{
              
                padding: '5px',
                // Add additional styles here
                border: '1px solid #ccc', // Example of adding a border
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Example of adding shadow
            }}
             
            footer={[
                <Space key="actions" style={{ float: 'right' }}>

{quotation?.status !== 'Approved' && (
                <Button key="edit" onClick={() => setIsEditModalVisible(true)} style={{ float: 'right' , border: "solid lightblue", borderRadius: '9px' }}>
                Edit Quotation
            </Button>
            )}
                    
                    <Button key="print" onClick={handlePrintQuotation} style={{ float: 'right' , border: "solid lightblue", borderRadius: '9px' }}>
                        Download Quotation
                    </Button>
                     {/* Conditionally render Proceed button only if status is not 'Approved' */}
            {quotation?.status !== 'Approved' && (
                <Button key="proceed" type="primary" onClick={handleProceed}>
                    Proceed
                </Button>
            )}
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

        {/* Edit Quotation Modal */}
        <EditQuotationModal
                    visible={isEditModalVisible}
                    products={editableProducts}
                    terms={quotationTerms}
                    onSave={handleSaveEdit}
                    onClose={() => setIsEditModalVisible(false)}
                />

    </>
    );
};

export default QuotationDetailsModal;
