# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


please run the json on port 4000
cmd = json-server --watch db.json --port 4000

and for frountend 
cmd = npm run dev

url for sales = http://localhost:3000/Sales

<!-- 


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketList from './pages/Tickets/Tickets';
import CreateTicket from './components/Ticket/CreateTicket';
import Quotations from './pages/Quotations/QuotationList';
// import InvoiceList from './pages/Invoices/InvoiceList';
// import InvoiceDetails from './pages/Invoices/InvoiceDetails';
// import CreateInvoice from './pages/Invoices/CreateInvoice';
// import EditInvoice from './pages/Invoices/EditInvoice';
// import PaymentTracking from './pages/Payments/PaymentTracking'; 
import Dashboard from './pages/dashboard/AdminDashboard';
// import Users from './pages/Users/Users';
// import Customers from './pages/Customers/Customers';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/AdminNav';
import Login from './pages/auth/LoginPage';
import ForgotPass from './pages/auth/ForgotPasswordPage'
import Register from './pages/auth/RegisterPage';
import AdminHomeDash from './pages/dashboard/AdminDashHome'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme'; // Custom theme

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            
            <CssBaseline />
            <Router>
                <Header/>
                 <Navbar/>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPass />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/TicketList" element={<TicketList />} />
               
                    
                    {/* Unprotected Routes */}

                    <Route path="/CreateTicket" element={<CreateTicket />} />
                    <Route path="/Quotations" element={<Quotations />} />
                    


                    {/* <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoice/:invoiceId" element={<InvoiceDetails />} />
                    <Route path="/create-invoice" element={<CreateInvoice />} />
                    <Route path="/edit-invoice/:invoiceId" element={<EditInvoice />} />
                    <Route path="/payments" element={<PaymentTracking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/customers" element={<Customers />} /> */}

                    {/* Default Route */}
                    <Route path="/" element={<Dashboard />} />
                 

                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;




admin dashboard 

:
import React from 'react';
import { useSelector } from 'react-redux';
import TicketList from '../Tickets/Tickets.jsx';
import QuotationList from '../Quotations/QuotationList.jsx';
import Users from '../Users/Users.jsx';
import Customers from '../Customers/Customers.jsx';
// import NotificationList from '../../pages/Notifications/NotificationList'; present in the component
import NotificationList from '../../components/NotificationList.jsx';

const AdminDashboard = () => {
    const tickets = useSelector((state) => state.tickets.allTickets);
    const quotations = useSelector((state) => state.quotations.allQuotations);
    const users = useSelector((state) => state.users.allUsers);
    const customers = useSelector((state) => state.customers.allCustomers);
    const notifications = useSelector((state) => state.notifications.allNotifications);

    return (
        <div class="wrapper">
       
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
          
            <section>
                <h2>User Management</h2>
                <Customers users={customers} />
            </section>
            <section>
            {/* <h2>Notifications</h2> */}
                {/* 
                <NotificationList notifications={notifications} /> */}
            </section>
        </div>
        </div>
    );
};

export default AdminDashboard;










import React, { useRef, useState } from 'react';
import { Modal, Button, Space } from 'antd';
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
                <td style="border: 1px solid #000; padding: 8px;"><strong>Created By:</strong> ${quotation.createdBy}</td>
                <td style="border: 1px solid #000; padding: 8px;"><strong>status:</strong> <span style="color:${quotation.status === 'Approved' ? 'green' : quotation.status === 'Rejected' ? 'red' : 'orange'};">${quotation.status}</span></td>
          
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
                    {/* Render the PDF content directly in the modal */}
                    <div dangerouslySetInnerHTML={{ __html: createPdfContent().innerHTML }} />
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
</body>
 -->