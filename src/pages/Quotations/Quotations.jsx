import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations, getQuotationById } from '../../redux/slices/quotationSlice';
import { Layout, Table, Button, Empty, message, Spin, Typography, Input } from 'antd';
import CreateQuotationFormModal from '../../components/Quotation/CreateQuotation';
import QuotationDetailsModal from '../../components/Quotation/QuotationDetails';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Quotations = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error, quotationByIdLoading } = useSelector((state) => state.quotations);
    const { tickets = [] } = useSelector((state) => state.tickets); // Get tickets from Redux state

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [viewLoadingId, setViewLoadingId] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const statusFilter = queryParams.get('status');

    useEffect(() => {
      
        if (!quotations || quotations.length === 0) {
            dispatch(fetchQuotations());
            // console.log('Fetching quotations...');
        }
        // dispatch(fetchTickets()); // Fetch tickets
    }, [dispatch, location, quotations]);

    useEffect(() => {
        if (error) {
            message.error(`Failed to load quotations: ${error}. Please check backend connectivity.`);
        }
    }, [error]);

    const handleViewClick = async (record) => {
        setViewLoadingId(record.quotationId);
        try {
            const { payload } = await dispatch(getQuotationById(record.quotationId));
            setSelectedQuotation(payload);
            setIsDetailsModalVisible(true);
        } catch (error) {
            // console.error('Error fetching quotation:', error);
        } finally {
            setViewLoadingId(null);
        }
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
        // Remove the dispatch(fetchQuotations()) call to avoid reloading all quotations
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalVisible(false);
        setSelectedQuotation(null);
        // Remove the dispatch(fetchQuotations()) call to avoid reloading all quotations
    };

    const handleCreateQuotationSuccess = () => {
        dispatch(fetchQuotations());
        setIsCreateModalVisible(false); // Close the modal after successful creation
    };

    // Add a function to check for null prices in selected products
    const checkForNullPrices = (products) => {
        return products.some(product => product.price === null);
    };

    // Modify the function to handle quotation submission
    const handleCreateQuotation = (quotationData) => {
        if (checkForNullPrices(quotationData.products)) {
            message.error('Please fill in the price for all selected products before submitting the quotation.');
            return;
        }
        // Proceed with quotation submission
        dispatch(createQuotation(quotationData)).then(() => {
            handleCreateQuotationSuccess();
        });
    };

    // Search function
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // console.log(tickets);
    // Map tickets to quotations
    const quotationsWithTickets = Array.isArray(quotations) ? quotations.map((quotation) => {
        const matchedTicket = tickets.find((ticket) => ticket.ticketId === quotation.ticketId);
        return { ...quotation, ticket: matchedTicket }; // Add ticket details to quotation
    }) : [];


    // Filter quotations based on search text and status
    const filteredQuotations = quotationsWithTickets.filter((quotation) => {
        const c_companyName = quotation.c_companyName || 'N/A';
        const matchesSearchText = (
            quotation.comments.toLowerCase().includes(searchText.toLowerCase()) ||
            c_companyName.toLowerCase().includes(searchText.toLowerCase()) ||
            quotation.finalAmount.toString().includes(searchText) ||
            quotation.status.toLowerCase().includes(searchText.toLowerCase()) ||
            moment(quotation.quotationDate).format('DD-MM-YYYY').includes(searchText) ||
            quotation.quot_ID.toLowerCase().includes(searchText.toLowerCase())
        );
        const matchesStatus = statusFilter ? quotation.status === statusFilter : true;
        return matchesSearchText && matchesStatus;
    });

    const columns = [
        {
            title: 'Quotation ID',
            dataIndex: 'quot_ID',
            key: 'quot_ID',
        },
        {
            title: 'Company name',
            dataIndex: 'c_companyName',
            key: 'c_companyName',
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: 'Final Amount',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: 'Created Date',
            dataIndex: 'quotationDate',
            key: 'quotationDate',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleViewClick(record)}
                    loading={viewLoadingId === record.quotationId}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="quotation-list-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Quotation List</Title>
                        <Button type="primary" style={{ padding: '0 20px' }} onClick={() => setIsCreateModalVisible(true)}>
                            Create Quotation
                        </Button>
                    </div>
                    <Input
                        placeholder="Search Quotations"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: '16px', width: '300px' }}
                        prefix={<SearchOutlined />}
                    />
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                            <Spin tip="Loading..." />
                        </div>
                    ) : filteredQuotations.length === 0 ? (
                        <Empty description="No Quotations Available" />
                    ) : (
                        <Table
                            dataSource={filteredQuotations}
                            columns={columns}
                            rowKey="quotationId"
                            pagination={false}
                        />
                    )}

                    {/* Quotation Details Modal */}
                    <QuotationDetailsModal
                        visible={isDetailsModalVisible}
                        onClose={handleDetailsModalClose}
                        quotation={selectedQuotation}
                        loading={quotationByIdLoading} // Use separate loading state
                    />

                    {/* Create Quotation Form Modal */}
                    <CreateQuotationFormModal
                        visible={isCreateModalVisible}
                        onClose={handleCreateModalClose}
                        onSuccess={handleCreateQuotation}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Quotations;
