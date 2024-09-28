import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations } from '../../redux/slices/quotationSlice';
import { Link } from 'react-router-dom';
import { Layout, Table, Button, Empty, message, Spin, Typography } from 'antd'; // Import Ant Design components

const { Header, Content } = Layout;
const { Title } = Typography;

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
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="quotation-list-container">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px', // Space between title and table
                        }}
                    >
                        <Title level={4} style={{ margin: 0 }}>Quotation List</Title>
                        <Link to="/create-quotation">
                            <Button type="primary" style={{ padding: '0 20px' }}>Create Quotation</Button>
                        </Link>
                    </div>

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
            </Content>
        </Layout>
    );
};

export default QuotationList;
