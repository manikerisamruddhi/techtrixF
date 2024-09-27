import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations } from '../../redux/slices/quotationSlice';
import { Link } from 'react-router-dom';
import { Table, Button, Empty, message, Spin } from 'antd'; // Import Ant Design components
import Navbar from '../../components/Navbar/AdminNav'; // Adjust path if necessary

const QuotationList = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error } = useSelector((state) => state.quotations); // Default to empty array

    useEffect(() => {
        dispatch(fetchQuotations());
    }, [dispatch]);

    // Handle backend error
    useEffect(() => {
        if (error) {
            message.error(`Failed to load quotations: ${error}. Please check backend connectivity.`);
        }
    }, [error]);

    const columns = [
        {
            title: 'Quotation ID',
            dataIndex: 'QuotationID', // Adjusted to match your data structure
            key: 'QuotationID',
            render: (text) => <Link to={`/quotation/${text}`}>Quotation #{text}</Link>,
        },
        {
            title: 'Ticket ID',
            dataIndex: 'TicketID', // Added TicketID field
            key: 'TicketID',
            render: (ticketId) => <span>{ticketId}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'Status', // Adjusted to match your data structure
            key: 'Status',
            render: (status) => <span>{status}</span>, // Display the status
        },
        {
            title: 'Total Amount',
            dataIndex: 'TotalAmount', // Added TotalAmount field
            key: 'TotalAmount',
            render: (amount) => <span>₹{amount.toFixed(2)}</span>, // Formatting amount as currency
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Link to={`/quotation/${record.QuotationID}`}>
                        <Button type="primary" style={{ marginRight: 8 }}>View</Button>
                    </Link>
                    <Link to={`/proceed-quotation/${record.QuotationID}`}>
                        <Button type="default">Proceed</Button>
                    </Link>
                </>
            ),
        },
    ];

    return (
        <div className="quotation-list-container">
            <Navbar />
            <div className="content-container">
                <h1>Quotation List</h1>

                {/* Create Quotation button */}
                <Link to="/create-quotation">
                    <Button type="primary" className="create-quotation-btn">Create Quotation</Button>
                </Link>

                {/* Display loading spinner when fetching data */}
                {loading === 'loading' ? (
                    <Spin tip="Loading..." /> // Using Ant Design's Spin component for loading state
                ) : quotations.length === 0 ? (
                    // Show Empty component when no quotations are available
                    <Empty description="No Quotations Available" />
                ) : (
                    <Table
                        dataSource={quotations}
                        columns={columns}
                        rowKey="QuotationID" // Use QuotationID as the unique key
                        pagination={false}
                    />
                )}
            </div>
        </div>
    );
};

export default QuotationList;
