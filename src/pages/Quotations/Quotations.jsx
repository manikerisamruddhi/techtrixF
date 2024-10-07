import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations } from '../../redux/slices/quotationSlice';
import { Link } from 'react-router-dom';
import { Layout, Table, Button, Empty, message, Spin, Typography, Modal } from 'antd';
import CreateQuotationFormModal from '../../components/Quotation/CreateQuotation'; // Import the new modal component

const { Header, Content } = Layout;
const { Title } = Typography;

const QuotationList = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error } = useSelector((state) => state.quotations);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    useEffect(() => {
        dispatch(fetchQuotations());
    }, [dispatch]);

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

    const handleCreateQuotation = (quotationData) => {
        // Dispatch action to create a quotation
        // dispatch(createQuotation(quotationData)); // Uncomment this when the action is created
        message.success('Quotation created successfully!');
        setIsModalVisible(false); // Close the modal after creation
    };

    const columns = [
        {
            title: 'Quotation ID',
            dataIndex: 'id',
            key: 'QuotationID',
            render: (text) => <Link to={`/quotation/${text}`}>Quotation #{text}</Link>,
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (status) => <span>{status}</span>,
        },
        {
            title: 'Final Amount',
            dataIndex: 'FinalAmount',
            key: 'FinalAmount',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleViewClick(record)}>
                        View
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="quotation-list-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Quotation List</Title>
                        <Button type="primary" style={{ padding: '0 20px' }} onClick={() => setIsModalVisible(true)}>
                            Create Quotation
                        </Button>
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
                                <p><strong>Quotation ID:</strong> {selectedQuotation.id}</p>
                                <p><strong>Ticket ID:</strong> {selectedQuotation.TicketID}</p>
                                <p><strong>Status:</strong> {selectedQuotation.Status}</p>
                                <p><strong>Total amount:</strong> ₹{selectedQuotation.TotalAmount}</p>
                                <p><strong>Final amount after discount:</strong> ₹{selectedQuotation.FinalAmount}</p>
                                <p><strong>Comments:</strong> {selectedQuotation.Comments}</p>
                                <p><strong>Created date:</strong> {selectedQuotation.CreatedDate}</p>
                            </div>
                        ) : (
                            <Spin tip="Loading details..." />
                        )}
                    </Modal>

                    {/* Create Quotation Form Modal */}
                    <CreateQuotationFormModal
                        visible={isModalVisible}
                        onCreate={handleCreateQuotation}
                        onClose={handleModalClose} //
                        onCancel={() => setIsModalVisible(false)}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default QuotationList;
