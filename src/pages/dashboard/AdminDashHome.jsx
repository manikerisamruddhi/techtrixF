import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTickets, fetchQuotations } from '../../redux/slices/adminDash';
import useTicketCounts from '../../hooks/useTicketCount';
import useQuotationCounts from '../../hooks/useQuotationCount';
import useUserCounts from '../../hooks/useUserCount';
import useCustomerCounts from '../../hooks/useCustomerCount';
import useProductCounts from '../../hooks/useProductCount';
import CreateTicketModal from '../../components/Ticket/CreateTicketModalForm';
import CreateQuotationModal from '../../components/Quotation/CreateQuotation';
import CustomerFormModal from '../../components/Customer/CustomerFormModal';
import AddProduct from '../../components/Product/AddProduct'
import CreateUserForm from '../../components/User/CreateUserForm'
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import { ArrowCircleLeft } from '@mui/icons-material';
import { Button, Modal } from 'antd';
import '../../styles/Pages/Admin/Dashboard.css';
import { fetchUsers } from '../../redux/slices/adminDash';
import { fetchCustomers } from '../../redux/slices/adminDash';
import { fetchNonCustProducts } from '../../redux/slices/adminDash';

// Shared card styles
const cardStyle = {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    padding: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
};

const ButtonStyle = {

    position: 'absolute',
    right: '20px',
    bottom: '20px',
    // fontSize: '15px',
    padding: '4px 8px',
    // backgroundColor: '#4CAF50', // Change the background color
    // borderColor: '#4CAF50', // Change the border color
    // color: '#fff', // Change the text color


}

const Dashboard = () => {
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
    const [showCustomerFormModal, setShowCustomerFormModal] = useState(false);
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showTicketDetails, setShowTicketDetails] = useState(false);
    const [showQuotationDetails, setShowQuotationDetails] = useState(false);
    const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tickets, quotations, users, customers, products, invoices, loading, error } = useSelector(state => state.dashboard);
    const { total, inProgress, closed, open } = useTicketCounts(tickets);
    const { totalQuote, pending, approved, rejected } = useQuotationCounts(quotations);
    const { totalUser, logistics, serviceTechnical, sales } = useUserCounts(users);
    const { totalCustomers } = useCustomerCounts(customers);
    const { totalProduct } = useProductCounts(products);
    const selectedUser = null;
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchQuotations());
        dispatch(fetchUsers());
        dispatch(fetchCustomers());
        // dispatch(fetchInvoices());
        dispatch(fetchNonCustProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            setShowError(true); // Show error message when there's an error
            const timer = setTimeout(() => {
                setShowError(false); // Hide error message after 2 seconds
            }, 2000);

            return () => clearTimeout(timer); // Cleanup the timer on unmount or when error changes
        }
    }, [error]);


    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage
    const userRole = user.role;
    const userType = user.userType;

    // console.log(products);

    const handleCustomerFormFinish = (values) => {
        // console.log(values); // Handle the form submission logic here
        setShowCustomerFormModal(false);
        navigate('/customers'); // Navigate to the customers page after submission
    };

    const [showQuotationModal, setShowQuotationModal] = useState(false);

    const handleCreateQuotationClick = () => {
        setShowQuotationModal(true);
    };

    const handleQuotationModalClose = () => {
        setShowQuotationModal(false);
    };


    const handleMainCardClick = (setShowDetails) => {
        setShowTicketDetails(false);
        setShowQuotationDetails(false);
        setShowInvoiceDetails(false);
        setShowCustomerDetails(false);
        setShowUserDetails(false);
        setShowProductDetails(false);
        setShowDetails(true);
    };

    const handleSubCardClick = (status) => {
        if (!status)
            navigate(`/tickets`);
        else {
            navigate(`/tickets?status=${status}`);
        }
    };

    const handleQuotationSubCardClick = (status) => {
        if (!status)
            navigate(`/quotations`);
        else {
            navigate(`/quotations?status=${status}`);
        }
    };

    const handleBackButtonClick = () => {
        setShowTicketDetails(false);
        setShowQuotationDetails(false);
        setShowInvoiceDetails(false);
        setShowCustomerDetails(false);
        setShowUserDetails(false);
        setShowProductDetails(false);
    };

    const showMainCards = !(
        showTicketDetails ||
        showQuotationDetails ||
        showInvoiceDetails ||
        showCustomerDetails ||
        showUserDetails ||
        showProductDetails
    );

    return (
        <div className="dashboard-container" style={{ padding: '20px', backgroundColor: '#40d1ff2b' }}>
            {showCreateTicketModal && (
                <CreateTicketModal
                    visible={showCreateTicketModal}
                    onClose={() => setShowCreateTicketModal(false)}
                />
            )}

            {showCustomerFormModal && (
                <CustomerFormModal
                    visible={showCustomerFormModal}
                    onCancel={() => setShowCustomerFormModal(false)}
                    onFinish={handleCustomerFormFinish}
                    initialValues={{}}
                    mode="add"
                />
            )}

            {showCreateProductModal && (
                <AddProduct
                    visible={showCreateProductModal}
                    onCancel={() => setShowCreateProductModal(false)}
                />
            )}

            {showCreateUserModal && (
                <Modal
                    title={selectedUser !== null && selectedUser !== undefined ? "Edit User" : "Create User"}
                    open={showCreateUserModal}
                    onCancel={() => setShowCreateUserModal(false)}
                    footer={null}
                >
                    <CreateUserForm user={selectedUser || undefined}
                        onClose={() => setShowCreateUserModal(false)}
                    />
                </Modal>
            )}


            <CreateQuotationModal
                visible={showQuotationModal}
                onClose={handleQuotationModalClose}
            />
            <Typography variant="h4" gutterBottom>

                {showMainCards && 'Dashboard'}
            </Typography>

            {loading && <CircularProgress />}
            {showError && <Alert severity="error">Error loading data: {error}</Alert>}

            <Grid container spacing={2} >
                {/* Render Main Cards only when subcards are not visible */}
                {showMainCards && (
                    <>
                        {/* Tickets Main Card */}

                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    ...cardStyle,
                                    background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                                    position: 'relative',
                                }}
                                onClick={() => handleMainCardClick(setShowTicketDetails)}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}> Tickets</Typography>

                                <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                    <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                        <Typography variant="h6" sx={{ color: '' }}>Open: {open}</Typography>
                                        <Typography variant="h6" sx={{ color: '' }}>InProgress: {inProgress}</Typography>
                                        <Typography variant="h6" sx={{ color: '' }}>Total: {total}</Typography>
                                    </Grid>
                                </Grid>

                                <Button
                                    type="primary"
                                    className="Button"
                                    style={{
                                        ...ButtonStyle,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCreateTicketModal(true);
                                    }}
                                >
                                    Create Ticket
                                </Button>
                            </Card>
                        </Grid>


                        {/* Quotations Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', position: 'relative' }}
                                onClick={(e) => {
                                    if (e.target.tagName !== 'BUTTON') {
                                        handleMainCardClick(setShowQuotationDetails);
                                    }
                                }}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}> Quotations</Typography>

                                <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                    <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                        <Typography variant="h6" sx={{ color: '' }}>Pending :{pending}</Typography>
                                        <Typography variant="h6" sx={{ color: '' }}>Approved:{approved}</Typography>
                                        {/* <Typography variant="h6" sx={{ color: '' }}>test:{total}</Typography> */}
                                    </Grid>
                                </Grid>
                                <Button
                                    type="primary"
                                    className='Button'
                                    style={{
                                        ...ButtonStyle
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCreateQuotationClick();
                                    }}
                                >
                                    Create Quotation
                                </Button>
                            </Card>
                        </Grid>

                        {/* Invoices Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', position: 'relative' }}
                                onClick={() => navigate("/Invoices")}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}> Invoices</Typography>
                                <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                    <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                        <Typography variant="h6" sx={{ color: '' }}>Invoices</Typography>
                                        {/* <Typography variant="h6" sx={{ color: '' }}>test:{resolved}</Typography>
                                        <Typography variant="h6" sx={{ color: '' }}>test:{total}</Typography> */}
                                    </Grid>
                                </Grid>

                                <Button
                                    type="primary"
                                    className='Button'
                                    style={{
                                        ...ButtonStyle
                                    }}
                                    onClick={() => navigate("/Invoices")}
                                >
                                    Create Invoice
                                </Button>
                            </Card>
                        </Grid>


                        {(userRole === 'Admin' || userType === 'Admin_User') && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        ...cardStyle,
                                        background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                                        position: 'relative',
                                    }}
                                    onClick={() => navigate("/Products")}
                                >
                                    <Typography variant="h5" sx={{ color: '#000' }}> Products</Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            <Typography variant="h6" sx={{ color: '' }}>Total Products: {totalProduct}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="primary"
                                        className="Button"
                                        style={{ ...ButtonStyle }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCreateProductModal(true);
                                        }}
                                    >
                                        Create Product
                                    </Button>
                                </Card>
                            </Grid>
                        )}

                        {((userRole === 'Admin' || userType ==='Admin_User') &&
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', position: 'relative' }}
                                    onClick={() => navigate("/Customers")}
                                >
                                    <Typography variant="h5" sx={{ color: '#000' }}> Customers</Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            <Typography variant="h6" sx={{ color: '' }}>Total:{totalCustomers}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Button
                                        type="primary"
                                        className='Button'
                                        style={{
                                            ...ButtonStyle
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCustomerFormModal(true);
                                        }}
                                    >
                                        Create Customer
                                    </Button>
                                </Card>
                            </Grid>
                        )}


                        {(userRole === 'Admin' || userType === 'Admin_User') && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        ...cardStyle,
                                        background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                                        position: 'relative',
                                    }}
                                    onClick={() => navigate("/UserManagement")}
                                >
                                    <Typography variant="h5" sx={{ color: '#000' }}> Users</Typography>
                                    <Grid container spacing={1} sx={{ marginTop: '2px', marginRight: '-10px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            <Typography variant="h6" sx={{ color: '' }}>Total Users: {totalUser}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>Logistics Users: {logistics}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>Service Techs: {serviceTechnical}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>Sales Users: {sales}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Button
                                        type="primary"
                                        className="Button"
                                        style={{
                                            ...ButtonStyle,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCreateUserModal(true);
                                        }}
                                    >
                                        Create User
                                    </Button>
                                </Card>
                            </Grid>
                        )}



                    </>
                )}


                {/* Show Ticket Subcards */}
                {showTicketDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                            <IconButton onClick={handleBackButtonClick}>
                                <ArrowCircleLeft fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" gutterBottom style={{ marginTop: '12px' }}>Dashboard/Tickets:</Typography>
                            <Button
                                type="primary"
                                className='Button'
                                style={{
                                    position: 'absolute',
                                    right: '2%',

                                    // fontSize: '15px',
                                    padding: '4px 8px',
                                }}

                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCreateTicketModal(true);
                                }}
                            >
                                Create Ticket
                            </Button>
                        </div>
                        <Grid container spacing={2} style={{ marginLeft: '3px' }}>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('Closed')}
                                >
                                    <Typography variant="h5" sx={{ color: '#333' }}>Closed: {closed}</Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            {/* <Typography variant="h6" sx={{ color: '' }}>test:{open}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{resolved}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{total}</Typography> */}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('Open')}
                                >
                                    <Typography variant="h5" sx={{ color: 'orangered' }}>Open: {open}</Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            {/* <Typography variant="h6" sx={{ color: '' }}>test:{open}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{resolved}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{total}</Typography> */}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('InProgress')}
                                >
                                    {/* , textAlign: 'center'  */}
                                    <Typography variant="h5" sx={{ color: 'green' }}>In Progress: {inProgress}</Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            {/* <Typography variant="h6" sx={{ color: '' }}>test:{open}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{resolved}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{total}</Typography> */}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick()}
                                >
                                    <Typography variant="h5" sx={{ color: 'blue' }}>Total: {total}</Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                                        <Grid item xs={6} sm={6} md={6} marginBottom={1}>
                                            {/* <Typography variant="h6" sx={{ color: '' }}>test:{open}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{resolved}</Typography>
                                            <Typography variant="h6" sx={{ color: '' }}>test:{total}</Typography> */}
                                        </Grid>
                                    </Grid>

                                </Card>
                            </Grid>

                        </Grid>
                    </>
                )}

                {/* Show Quotation Subcards */}
                {showQuotationDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                            <IconButton onClick={handleBackButtonClick}>
                                <ArrowCircleLeft fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" gutterBottom style={{ marginTop: '12px' }}>Dashboard/Quotations:</Typography>
                            <Button
                                type="primary"
                                className='Button'
                                style={{
                                    position: 'absolute',
                                    right: '2%',
                                    padding: '4px 8px',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreateQuotationClick();
                                }}
                            >
                                Create Quotation
                            </Button>
                        </div>
                        <Grid container spacing={2} style={{ marginLeft: '10px' }}>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleQuotationSubCardClick()}
                                >
                                    <Typography variant="h5" sx={{ color: 'blue' }}>Total: { }</Typography>
                                    <Typography variant="h5" sx={{ color: 'blue' }}>{totalQuote}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleQuotationSubCardClick('Approved')}
                                >
                                    <Typography variant="h5" sx={{ color: 'green' }}>Approved: {quotations.delivered}</Typography>
                                    <Typography variant="h5" sx={{ color: 'blue' }}>{approved}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleQuotationSubCardClick('Pending')}
                                >
                                    <Typography variant="h5" sx={{ color: 'orangered' }}>Pending: {quotations.pending}</Typography>
                                    <Typography variant="h5" sx={{ color: 'orangered' }}>{pending}</Typography>

                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleQuotationSubCardClick('Rejected')}
                                >
                                    <Typography variant="h5" sx={{ color: 'red' }}>Rejected: {quotations.rejected}</Typography>
                                    <Typography variant="h5" sx={{ color: 'red' }}>{rejected}</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                {/* Show Invoice Subcards */}
                {showInvoiceDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                            <IconButton onClick={handleBackButtonClick}>
                                <ArrowCircleLeft fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" gutterBottom style={{ marginTop: '12px' }}>Dashboard / Invoices:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => navigate("/invoices")}
                                >
                                    <Typography sx={{ color: 'blue' }}>Total: {invoices.total}</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                {/* Show Customer Subcards */}
                {showCustomerDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                            <IconButton onClick={handleBackButtonClick}>
                                <ArrowCircleLeft fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" gutterBottom style={{ marginTop: '12px' }}>Dashboard / Tickets:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
                            {/* Add customer details here */}
                        </Grid>
                    </>
                )}

                {/* Show User Subcards */}
                {showUserDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                            <IconButton onClick={handleBackButtonClick}>
                                <ArrowCircleLeft fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" gutterBottom style={{ marginTop: '12px' }}>Dashboard / Users:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
                            {/* Add user details here */}
                        </Grid>
                    </>
                )}


                {showProductDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                            <IconButton onClick={handleBackButtonClick}>
                                <ArrowCircleLeft fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" gutterBottom style={{ marginTop: '12px' }}>Dashboard/Products:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginLeft: '10px' }}>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => navigate("/products")}
                                >
                                    <Typography sx={{ color: 'blue' }}>Total Products: </Typography>
                                </Card>
                            </Grid>
                            {/* Add more subcards for different product categories or statuses as needed */}
                        </Grid>
                    </>
                )}            </Grid>


        </div>
    );
};

export default Dashboard;
