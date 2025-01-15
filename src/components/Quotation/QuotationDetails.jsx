import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Space, message } from 'antd';
import html2pdf from 'html2pdf.js';
import EditQuotationModal from './EditQuotationModal';
import {
    updateQuotation,
} from "../../redux/slices/quotationSlice";
import { fetchUserById } from '../../redux/slices/userSlice';
import { fetchProducts, selectProductsByIds } from '../../redux/slices/productSlice';
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment/moment';


const QuotationDetailsModal = ({ visible, quotation, onClose }) => {
    const dispatch = useDispatch();
    const modalContentRef = useRef();
    const quoteProducts = useRef();
    const preparedBy = useRef();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for Edit modal visibility
   // const allProducts = useSelector(selectProducts); // All products from Redux

    const [QuotationData, setQuotationData] = useState(null);

    useEffect(() => {
        setQuotationData(quotation);
    }, [dispatch, visible]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, []);


    const quotationProducts = quotation ? quotation.quotationProducts : [];
    // console.log(`wwwwwwww ${quotationProducts}`)

    useEffect(() => {
        if (quotation && visible) {
            // console.log(quotation.createdBy);
            dispatch(fetchUserById(quotation.createdBy))
                .then((res) => {
                    preparedBy.current = res.payload.data;
                    // console.log(preparedBy.current); 
                })
        }

    }, [dispatch, visible]);

    const handleEditQuotation = () => {
        setIsEditModalVisible(true);
    };

    const products = quotationProducts ? quotationProducts : [];
    const arrayOfProductIds = products.map(product => product.productId);

    // Use the memoized selector
    const filteredProducts = useSelector(state => selectProductsByIds(state, arrayOfProductIds));

    const handlePrintQuotation = () => {
        const pdfElement = createPdfContent(filteredProducts); // Pass filtered products to createPdfContent

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

    const formattedDate = moment(QuotationData?.quotationDate || '').format('DD/MM/YYYY');

    // ...
    const handleRejectQuotation = () => {
        // Logic to update the status to 'Rejected'
        // This could be an API call or state update

        Modal.confirm({
            title: 'Are you sure you want to proceed?',
            content: 'This will reject the quotation and update its status.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                // If the user confirms, proceed with updating the quotation
                const updatedQuotationData = { ...quotation, status: 'Rejected' };

                const quotationId = quotation.quotationId;

                // Dispatch the action to update the quotation
                dispatch(updateQuotation({ quotationId, data: updatedQuotationData }))
                    .then(response => {
                        // Handle success (e.g., update local state, show a message)
                        // console.log('Quotation rejected successfully:', response);
                        message.warning("Quotation Rejected!");
                    })
                    .catch(error => {
                        // Handle error (e.g., show an error message)
                        // console.error('Error rejecting quotation:', error);
                        message.error("Error approving quotation", error);
                    });
                onClose();
            },
            onCancel() {
                // console.log('User canceled rejecting the quotation.');
                message.warning('User canceled rejecting the quotation.');
            }
        });

    };

    const handleProceed = () => {
        if (!quotation) {
            // console.error("Quotation ID is missing.");
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
                const quotationId = quotation.quotationId;
                // Dispatch the action to update the quotation
                dispatch(updateQuotation({ quotationId, data: updatedQuotationData }))
                    .then(() => {
                        // Handle success
                        // console.log(`Quotation ID ${quotation.quotationId} has been approved.`);
                        message.success("Quotation approved successfully!");
                        onClose();

                        // Optional: Perform additional actions, like redirecting
                    })
                    .catch((error) => {
                        // Handle error
                        // console.error("Failed to approve the quotation:", error);
                        message.error("Failed to approve the quotation.");
                    });
            },
            onCancel() {
                // console.log('User canceled proceeding with the quotation.');
            }
        });
    };

    // console.log(`${quotationProducts}`, JSON.stringify(quotationProducts, null, 2));
    const createPdfContent = (filteredProducts) => {


        // console.log(filteredProducts);

        quoteProducts.current = filteredProducts;

        const pdfContent = document.createElement('div');
        const productsRows = filteredProducts.map((filteredProduct, index) => {
            // Calculate the amount
            let quantity = filteredProduct.quantity ? filteredProduct.quantity : 1;
            const amount = (quantity && filteredProduct.price)
                ? (quantity * filteredProduct.price).toFixed(2)
                : 'NA';


            let gstAmount18 = 'NA';
            if (filteredProduct.gst === 18 && amount !== 'NA') {
                gstAmount18 = (amount * 0.18).toFixed(2);
            }

            // Return the updated row
            return `
      <tr>
        <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">${index + 1}</td>
  
        <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">
          ${filteredProduct.partCode ? filteredProduct.partCode : 'NA'}
        </td>
        
        <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">
          ${filteredProduct.brand && filteredProduct.modelNo ? `${filteredProduct.brand} -- ${filteredProduct.modelNo}` : 'NA'} 
          <br />
          ${filteredProduct.description ? `${filteredProduct.description} brand modal` : 'NA'}
        </td>
        
        <td style="border: 1px solid #000; text-align: right; padding: 5px; font-size: 10px;">
         ${quantity}
        </td>
        
        <td style="border: 1px solid #000; text-align: right; padding: 5px; font-size: 10px;">
          ${filteredProduct.unitOfMeasurement ? filteredProduct.unitOfMeasurement : 'NA'}
        </td>
        
        <td style="border: 1px solid #000; text-align: right; padding: 5px; font-size: 10px;">
          ${filteredProduct.price ? `₹${filteredProduct.price}` : 'NA'}
        </td>
        
        <td style="border: 1px solid #000; text-align: right; padding: 5px; font-size: 10px;">
          ${amount === 'NA' ? 'NA' : `₹${amount}`}
        </td>
      </tr>
    `;
        }).join('');


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

                    
                
                          
                        </div>
                    <table style="border-collapse: collapse; font-size: 8px; margin-bottom: 5%; border: 1px solid black; width: auto;">
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Date</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">${formattedDate}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Quotation ID</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">${quotation ? (quotation.quot_ID ? quotation.quot_ID : 'N/A') : 'N/A'}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Customer ID</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"> ${quotation ? (quotation.c_Cust_ID ? quotation.c_Cust_ID : 'N/A') : 'N/A'}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;"><strong>Validity</strong></td>
        <td style="border: 1px solid black; padding: 1px 4px; white-space: nowrap;">${quotation ? (quotation.validity ? quotation.validity : 'N/A') : 'N/A'} days</td>
    </tr>
</table>


                    </div>


<div  style="font-family: 'Arial', sans-serif; font-size: 10px; ">
                    <div style="     background-color: #838282; color:white;
    font-weight: bolder;">  <strong  style=" margin-left:0.5%;">Customer:</strong></br>  </div>
                              ${quotation ? (quotation.c_companyName ? quotation.c_companyName : 'N/A') : 'N/A'},</br>
                              ${quotation ? (quotation.c_address ? quotation.c_address : 'N/A') : 'N/A'} </br>
                           
</div>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;     margin-top: 2%;">
                        <thead >
                            <tr>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;     width: 7%;">Sr. No.</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px; width: 9%;">Part Code</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Description</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">Qty</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px;">UoM</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px; width: 9%;">Unit Price</th>
                                <th style="border: 1px solid #000; padding: 5px; background-color: #17A0CC; color:white; font-size: 10px; width: 20%">Amount</th>
                           
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
            <td ></td>
            <!-- Validity in the 7th column -->
            <td>
            
             <table style="border-collapse: collapse; font-size: 10px; margin-bottom: 5%; border: 1px solid black; width: 100%;">
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Subtotal</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">₹ ${QuotationData?.totalAmount || ''} </td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Tax Rate 18 %</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">₹ ${QuotationData?.total18GstTax?.toFixed(2) || '0'}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Tax Rate 28 %</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">₹ ${QuotationData?.total28GstTax.toFixed(2) || '0'}</td>
    </tr>
    <tr>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap;"><strong>Total Amount</strong></td>
        <td style="border: 1px solid black; padding: 2px 3px; white-space: nowrap; text-align: right;">₹ ${QuotationData?.finalAmount || ''}</td>
    </tr>
</table>
            
            </td>
        </tr>
                        </tbody>
                          
                    </table>
                    



                    <div style="margin-bottom: 10px; font-size: 10px; display: flex;
                        margin-top: -13%;
    align-items: center;
    justify-content: space-between;" >

    
                       <div style="max-width: 480px" >
                        <p style=" margin-bottom:-2%; border: 1px solid #000; padding: 2px; background-color: #17A0CC; color:white; font-size: 10px;"><strong>Terms and conditions:</strong><p>
                        
                        <span><strong>Comments:</strong> ${quotation ? (quotation.comments ? quotation.comments : 'N/A') : 'N/A'}</span></br>
                        <span><strong>Customer will be billed:</strong> After indicating acceptance of this Quotation.</span></br>
                        
                        <span><strong>Taxes:</strong> Inclusive in Quotation.</span></br>
                        <span><strong>Delivery:</strong> ${quotation ? (quotation.delivery ? quotation.delivery : 'N/A') : 'N/A'}</span></br>
                        <span><strong>Payment:</strong> ${quotation ? (quotation.payment ? quotation.payment : 'N/A') : 'N/A'}</span></br>
                        <span><strong>Warranty / Support:</strong>  ${quotation ? (quotation.warrantyOrSupport ? quotation.warrantyOrSupport : 'N/A') : 'N/A'}</span></br>
                        <span><strong>Transport:</strong> ${quotation ? (quotation.transport ? quotation.transport : 'N/A') : 'N/A'}</span></br>
                        </div>

                         <div style="text-align: center; font-size: 10px;     margin-top: 10%;">
                     

                         <div style="display:flex; flex-direction:column; margin-top:10%">

                        
                         
                        <span style="margin-bottom: -12%">Your’s sincerely,</span></br>
                        <span style="margin-bottom: -12%">For Techtrix Solutions Pvt. Ltd., </span></br>
                        <span style="margin-bottom: -12%">  Pune</span></br>
                        <span style="margin-bottom: -12%"> ${preparedBy ? (preparedBy.current ? `${preparedBy.current.firstName} ${preparedBy.current.lastName} ${preparedBy.current.phoneNumber}` : 'N/A') : 'N/A'}
                       </span></br>
                        
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
                open={visible}
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
                        {quotation?.status === 'Pending' && (
                            <Button
                                key="edit"
                                onClick={handleEditQuotation}
                                style={{ float: 'right', border: "solid lightblue", borderRadius: '9px' }}
                          >
                                Edit Quotation
                            </Button>
                        )}

                        <Button
                            key="print"
                            onClick={handlePrintQuotation}
                            style={{ float: 'right', border: "solid lightblue", borderRadius: '9px' }}
                        >
                            Download Quotation
                        </Button>


                        {/* Add Reject button to update status to 'Rejected' */}
                        {quotation?.status === 'Pending' && (
                            <Button
                                key="reject"
                                type="danger"
                                onClick={() => handleRejectQuotation()}
                                style={{ float: 'right', border: "solid lightblue", borderRadius: '9px', color: 'red', background: 'white' }}
                            >
                                Reject
                            </Button>
                        )}

                        {/* Conditionally render Proceed button only if status is not 'Approved' */}
                        {quotation?.status === 'Pending' && (
                            <Button
                                key="proceed"
                                type="primary"
                                onClick={handleProceed}
                            >
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
                    <div dangerouslySetInnerHTML={{ __html: createPdfContent(filteredProducts).innerHTML }} />
                </div>

            </Modal>

            {/* Edit Quotation Modal */}
            <EditQuotationModal
                visible={isEditModalVisible}
                products={quoteProducts.current}
                quotation={quotation}
                // onSave={handleSaveEdit}
                onClose={() => {
                    setIsEditModalVisible(false);
                    onClose();
                    // dispatch(fetchProducts()); // Refresh products if needed
                }}
            />

        </>
    );
};

export default QuotationDetailsModal;
