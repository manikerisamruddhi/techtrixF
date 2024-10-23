import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations } from '../../redux/slices/quotationSlice';
import { Link } from 'react-router-dom';
import { Layout, Table, Button, Empty, message, Spin, Typography, Modal } from 'antd'; // Import Ant Design components

const { Header, Content } = Layout;
const { Title } = Typography;

const SalesQuotations = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error } = useSelector((state) => state.quotations); // Default to empty array

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null); // Store the selected quotation details

    useEffect(() => {
        dispatch(fetchQuotations());
    }, [dispatch]);

    // Handle backend error
    useEffect(() => {
        if (error) {
            message.error(`Failed to load quotations: ${error}. Please check backend connectivity.`);
        }
    }, [error]);

    const handleViewClick = (record) => {
        setSelectedQuotation(record);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedQuotation(null);
    };

    const columns = [
        {
            title: 'Quotation ID',
            dataIndex: 'QuotationID',
            key: 'QuotationID',
            render: (text) => <Link to={`/quotation/${text}`}>Quotation #{text}</Link>,
        },
        // {
        //     title: 'Ticket ID',
        //     dataIndex: 'TicketID',
        //     key: 'TicketID',
        //     render: (ticketId) => <span>{ticketId}</span>,
        // },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span>{status}</span>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'FinalAmount',
            key: 'TotalAmount',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleViewClick(record)}>
                        View
                    </Button>
                    {/* <Link to={`/proceed-quotation/${record.QuotationID}`}>
                        <Button type="default">Proceed</Button>
                    </Link> */}
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
                            marginBottom: '16px',
                        }}
                    >
                        <Title level={4} style={{ margin: 0 }}>Quotation List</Title>
                        <Link to="/create-quotation">
                            <Button type="primary" style={{ padding: '0 20px' }}>Create Quotation</Button>
                        </Link>
                    </div>

                    {loading === 'loading' ? (
                        <Spin tip="Loading..." />
                    ) : quotations.length === 0 ? (
                        <Empty description="No Quotations Available" />
                    ) : (
                        <Table
                            dataSource={quotations}
                            columns={columns}
                            rowKey="QuotationID"
                            pagination={false}
                        />
                    )}

                    {/* Quotation Details Modal */}
                    <Modal
                        title="Quotation Details"
                        visible={isModalVisible}
                        onCancel={handleModalClose}
                        footer={[
                            <Button key="close" onClick={handleModalClose}>
                                Close
                            </Button>,
                        ]}
                    >
                        {selectedQuotation ? (
                            <div>
                                <p><strong>Quotation ID:</strong> {selectedQuotation.QuotationID}</p>
                                <p><strong>Ticket ID:</strong> {selectedQuotation.TicketID}</p>
                                <p><strong>status:</strong> {selectedQuotation.status}</p>
                                <p><strong>Total amount:</strong> ₹{selectedQuotation.TotalAmount}</p>
                                <p><strong>Final amount after discount:</strong> ₹{selectedQuotation.FinalAmount}</p>
                                <p><strong>status:</strong> {selectedQuotation.status}</p>
                                <p><strong>Comments:</strong> {selectedQuotation.Comments}</p>
                                <p><strong>Created date:</strong> {selectedQuotation.createdDate}</p>
                                {/* Add other fields as needed */}
                            </div>
                        ) : (
                            <Spin tip="Loading details..." />
                        )}
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
};

export default SalesQuotations;
