import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTickets, fetchQuotations, fetchInvoices } from '../../redux/slices/adminDash';
import useTicketCounts from '../../hooks/useTicketCount';
import { Box } from '@mui/material';
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
import '../../styles/Pages/Admin/Dashboard.css';

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

const Dashboard = () => {
    const [showTicketDetails, setShowTicketDetails] = useState(false);
    const [showQuotationDetails, setShowQuotationDetails] = useState(false);
    const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tickets, quotations, invoices, loading, error } = useSelector(state => state.dashboard);
    const { total, inProgress, resolved, closed, open } = useTicketCounts(tickets);

    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchQuotations());
        dispatch(fetchInvoices());
    }, [dispatch]);

    const handleMainCardClick = (setShowDetails) => {
        setShowTicketDetails(false);
        setShowQuotationDetails(false);
        setShowInvoiceDetails(false);
        setShowCustomerDetails(false);
        setShowUserDetails(false);
        setShowDetails(true);
    };

    const handleSubCardClick = (status) => {
        navigate(`/tickets?status=${status}`);
    };

    const handleBackButtonClick = () => {
        setShowTicketDetails(false);
        setShowQuotationDetails(false);
        setShowInvoiceDetails(false);
        setShowCustomerDetails(false);
        setShowUserDetails(false);
    };

    const showMainCards = !(
        showTicketDetails || 
        showQuotationDetails || 
        showInvoiceDetails || 
        showCustomerDetails || 
        showUserDetails
    );

    return (
        <div className="dashboard-container" style={{ padding: '20px', backgroundColor: '#40d1ff2b' }}>
            <Typography variant="h4" gutterBottom>
   
    {showMainCards && 'Dashboard'}
</Typography>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">Error loading data: {error}</Alert>}

            <Grid container spacing={2} >
                {/* Render Main Cards only when subcards are not visible */}
                {showMainCards && (
                    <>
                        {/* Tickets Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}
                                onClick={() => handleMainCardClick(setShowTicketDetails)}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}>All Tickets</Typography>
                            </Card>
                        </Grid>

                        {/* Quotations Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}
                                onClick={() => handleMainCardClick(setShowQuotationDetails)}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}>All Quotations</Typography>
                            </Card>
                        </Grid>

                        {/* Invoices Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}
                                onClick={() => handleMainCardClick(setShowInvoiceDetails)}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}>All Invoices</Typography>
                            </Card>
                        </Grid>

                        {/* Customers Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}
                                onClick={() => handleMainCardClick(setShowCustomerDetails)}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}>All Customers</Typography>
                            </Card>
                        </Grid>

                        {/* Users Main Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}
                                onClick={() => handleMainCardClick(setShowUserDetails)}
                            >
                                <Typography variant="h5" sx={{ color: '#000' }}>All Users</Typography>
                            </Card>
                        </Grid>
                    </>
                )}

                {/* Show Ticket Subcards */}
                {showTicketDetails && (
                    <>
                        <div className='typo' style={{ display: 'flex', justifyContent: 'flex-start', color: 'black', width: '100%' }}>
                        <IconButton onClick={handleBackButtonClick}>
            <ArrowCircleLeft fontSize="large" />
        </IconButton>
                            <Typography variant="h4" gutterBottom style={{marginTop:'12px'}}>Dashboard/Tickets:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginLeft: '3px' }}>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('Resolved')}
                                >
                                    <Typography sx={{ color: 'blue', textAlign: 'center' }}>Resolved: {resolved}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('Open')}
                                >
                                    <Typography sx={{ color: 'orangered', textAlign: 'center' }}>Open: {open}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('In Progress')}
                                >
                                    <Typography sx={{ color: 'green', textAlign: 'center' }}>In Progress: {inProgress}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Card
                                    sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}
                                    onClick={() => handleSubCardClick('Closed')}
                                >
                                    <Typography sx={{ color: '#333', textAlign: 'center' }}>Closed: {closed}</Typography>
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
                            <Typography variant="h4" gutterBottom style={{marginTop:'12px'}}>Dashboard/Quotations:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginLeft: '10px' }}>
                            <Grid item xs={6} sm={3} md={4}>
                                <Link to="/quotations" style={{ textDecoration: 'none' }}>
                                    <Card sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}>
                                        <Typography sx={{ color: 'blue' }}>Delivered: {quotations.delivered}</Typography>
                                    </Card>
                                </Link>
                            </Grid>
                            <Grid item xs={6} sm={3} md={4}>
                                <Link to="/quotations" style={{ textDecoration: 'none' }}>
                                    <Card sx={{ ...cardStyle, background: 'linear-gradient(to right, #a1c4fd, #c2fbe7)' }}>
                                        <Typography sx={{ color: 'orangered' }}>Pending: {quotations.pending}</Typography>
                                    </Card>
                                </Link>
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
                            <Typography variant="h4" gutterBottom style={{marginTop:'12px'}}>Dashboard / Invoices:</Typography>
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
                            <Typography variant="h4" gutterBottom style={{marginTop:'12px'}}>Dashboard / Tickets:</Typography>
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
                            <Typography variant="h4" gutterBottom style={{marginTop:'12px'}}>Dashboard / Users:</Typography>
                        </div>
                        <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '10px' }}>
                            {/* Add user details here */}
                        </Grid>
                    </>
                )}
            </Grid>
        </div>
    );
};

export default Dashboard;
