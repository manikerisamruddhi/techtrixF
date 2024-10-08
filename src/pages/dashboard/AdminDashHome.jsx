import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, fetchQuotations, fetchInvoices } from '../../redux/slices/adminDash'; // Adjust according to your structure
import useTicketCounts from '../../hooks/useTicketCount'; // Import the custom hook
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import '../../styles/Pages/Admin/Dashboard.css';

// Card Styles
const cardStyle = {
    height: '200px', // Set a uniform height for all cards
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Space out content
    alignItems: 'flex-start', // Align content to the left
    borderRadius: '15px', // Rounded corners
    padding: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effect
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const { tickets, quotations, invoices, loading, error } = useSelector(state => state.dashboard); // Adjust according to your structure

    // Count the tickets using the custom hook
    const { total, inProgress, resolved, closed, open } = useTicketCounts(tickets);

    // Fetch data when component mounts
    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchQuotations());
        dispatch(fetchInvoices());
    }, [dispatch]);

    return (
        <div className="dashboard-container" style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {loading && <CircularProgress />}

            {error && <Alert severity="error">Error loading data: {error}</Alert>}

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {/* Parent Card for All Tickets */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            ...cardStyle,
                            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ color: '#000' }}>All Tickets</Typography>
                            <Typography variant="h6" sx={{ color: '#000' }}>Total: {total}</Typography>
                            <Typography sx={{ color: '#000' }}>Open: {open}</Typography>
                            <Typography sx={{ color: '#000' }}>In Progress: {inProgress}</Typography>
                            <Typography sx={{ color: '#000' }}>Resolved: {resolved}</Typography>
                            <Typography sx={{ color: '#000' }}>Closed: {closed}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Parent Card for Quotations */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            ...cardStyle,
                            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ color: '#000' }}>Quotations</Typography>
                            <Typography variant="h6" sx={{ color: '#000' }}>Delivered: {quotations.delivered}</Typography>
                            <Typography sx={{ color: '#000' }}>Remaining: {quotations.remaining}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Parent Card for All Invoices */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            ...cardStyle,
                            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ color: '#000' }}>All Invoices</Typography>
                            <Typography variant="h6" sx={{ color: '#000' }}>In Warranty: {invoices.inWarranty}</Typography>
                            <Typography sx={{ color: '#000' }}>Out of Warranty: {invoices.outOfWarranty}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* New Card 1 - Customers */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            ...cardStyle,
                            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ color: '#000' }}>Customers</Typography>
                            <Typography variant="h6" sx={{ color: '#000' }}>Total: 150</Typography>
                            <Typography sx={{ color: '#000' }}>Total Products: 788</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* New Card 2 - Users */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            ...cardStyle,
                            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ color: '#000' }}>Users</Typography>
                            <Typography variant="h6" sx={{ color: '#000' }}>Sales: 9</Typography>
                            <Typography sx={{ color: '#000' }}>Logistics: 7</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
