import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import { fetchTickets, fetchQuotations, fetchInvoices } from '../../redux/slices/adminDash';
import useTicketCounts from '../../hooks/useTicketCount';
import { setStatus } from '../../redux/slices/statusSlice';

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
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    padding: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
};

const subCardStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    background: 'linear-gradient(to right, #abe4ff, #c2fbe7)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
};

const Dashboard = () => {

    // const status = useSelector((state) => state.status);



    const dispatch = useDispatch();
    const { tickets, quotations, invoices, loading, error } = useSelector(state => state.dashboard);

    const { total, inProgress, resolved, closed, open } = useTicketCounts(tickets);

    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchQuotations());
        dispatch(fetchInvoices());
    }, [dispatch]);

    return (
        <div className="dashboard-container" style={{ padding: '20px' , backgroundColor: '#40d1ff2b', }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">Error loading data: {error}</Alert>}

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {/* Parent Card for All Tickets */}
                <Grid item xs={12} sm={6} md={4}>
                    <div style={{ textDecoration: 'none' }}>
                        <Card
                            sx={{
                                ...cardStyle,
                                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            }}
                        >
                            <Typography variant="h5" sx={{ color: '#000' }}>All Tickets</Typography>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Card sx={subCardStyle} onClick={() => handleTicketCardClick('Total')}>
                                            <Typography sx={{ color: '#333' }}>Total: {total}</Typography>
                                        </Card>
                                    </Grid>
                                    
                                    <Grid item xs={6}>
                                        <Card sx={subCardStyle} onClick={() => handleTicketCardClick('Open')}>
                                            <Typography sx={{ color: '#333' }}>Open: {open}</Typography>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Card sx={subCardStyle} onClick={() => handleTicketCardClick('in-progress')}>
                                            <Typography sx={{ color: '#333' }}>Progress: {inProgress}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card sx={subCardStyle} onClick={() => handleTicketCardClick('Resolved')}>
                                            <Typography sx={{ color: '#333' }}>Resolved: {resolved}</Typography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                </Grid>

                {/* Parent Card for Quotations */}
                <Grid item xs={12} sm={6} md={4}>
                    <Link to="/quotations" style={{ textDecoration: 'none' }}>
                        <Card
                            sx={{
                                ...cardStyle,
                                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            }}
                        >
                            <Typography variant="h5" sx={{ color: '#000' }}>Quotations</Typography>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: 1.5  }}>
                                
                                <Card sx={subCardStyle}>
                                    <Typography sx={{ color: '#000' }}>Delivered: {quotations.delivered}</Typography>
                                </Card>
                                <Card sx={subCardStyle}>
                                    <Typography sx={{ color: '#000' }}>Remaining: {quotations.remaining}</Typography>
                                </Card>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>

                {/* Parent Card for All Invoices */}
                <Grid item xs={12} sm={6} md={4}>
                    <Link to="/invoices" style={{ textDecoration: 'none' }}>
                        <Card
                            sx={{
                                ...cardStyle,
                                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            }}
                        >
                            <Typography variant="h5" sx={{ color: '#000' }}>All Invoices</Typography>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: 1.5 }}>
                                <Card sx={subCardStyle}>
                                    <Typography  sx={{ color: '#000' }}>In Warranty: {invoices.inWarranty}</Typography>
                                </Card>
                                <Card sx={subCardStyle}>
                                    <Typography sx={{ color: '#000' }}>Out of Warranty: {invoices.outOfWarranty}</Typography>
                                </Card>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>

                {/* New Card 1 - Customers */}
                <Grid item xs={12} sm={6} md={4}>
                    <Link to="/customers" style={{ textDecoration: 'none' }}>
                        <Card
                            sx={{
                                ...cardStyle,
                                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            }}
                        >
                            <Typography variant="h5" sx={{ color: '#000' }}>Customers</Typography>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left',gap: 1.5 }}>
                                <Card sx={subCardStyle}>
                                    <Typography sx={{ color: '#000' }}>Total: 150</Typography>
                                </Card>
                                <Card sx={subCardStyle}>
                                    <Typography sx={{ color: '#000' }}>Total Products: 788</Typography>
                                </Card>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>

                {/* New Card 2 - Users */}
                <Grid item xs={12} sm={6} md={4}>
                    <Link to="/users" style={{ textDecoration: 'none' }}>
                        <Card
                            sx={{
                                ...cardStyle,
                                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                            }}
                        >
                            <Typography sx={{ color: '#000' }}>Users</Typography>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' , gap: 1.5}}>
                                <Card sx={subCardStyle}>
                                    <Typography  sx={{ color: '#000' }}>Sales: 9</Typography>
                                </Card>
                                <Card sx={subCardStyle}>
                                    <Typography sx={{ color: '#000' }}>Logistics: 7</Typography>
                                </Card>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
