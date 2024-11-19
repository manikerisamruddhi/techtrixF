import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations, getQuotationById } from '../../redux/slices/quotationSlice';
import { Layout, Table, Button, Empty, message, Spin, Typography, Input, Space } from 'antd';
import CreateQuotationFormModal from '../../components/Quotation/CreateQuotation';
import QuotationDetailsModal from '../../components/Quotation/QuotationDetails';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Quotations = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error } = useSelector((state) => state.quotations);

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    useEffect(() => {
        dispatch(fetchQuotations());
    }, [dispatch, useLocation()]);

    useEffect(() => {
        if (error) {
            message.error(`Failed to load quotations: ${error}. Please check backend connectivity.`);
        }
    }, [error]);

    const handleViewClick = async (record) => {
        try {
            // Wait for the action to complete and unwrap the result
            const { payload } = await dispatch(getQuotationById(record.quotationId));

            // console.log(payload); // Log the payload (the data you need)
            setSelectedQuotation(payload); // Set selected quotation data
            setIsDetailsModalVisible(true); // Show the details modal
        } catch (error) {
            console.error('Error fetching quotation:', error); // Handle any errors
        }
    };


    useEffect(() => {
        if (selectedQuotation) {
            // When the quotation state changes, update the selectedQuotation state
            setSelectedQuotation(selectedQuotation);
        }
    }, [selectedQuotation]);

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
        dispatch(fetchQuotations()); // Fetch quotations again to refresh the list
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalVisible(false);
        setSelectedQuotation(null); // Clear the selected quotation
        dispatch(fetchQuotations()); // Fetch quotations again to refresh the list
    };

    const handleCreateQuotationSuccess = () => {
        dispatch(fetchQuotations()); // Fetch quotations again to refresh the list
    };


    // Search filter functions for columns
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            return record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '';
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                // setTimeout to wait for Input to be focused
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'Quotation ID',
            dataIndex: 'quotationId',
            key: 'quotationId',
            // render: (text) => <Link to={`/quotation/${text}`}>Quotation #{text}</Link>,
            // ...getColumnSearchProps('id'), // Search filter for Quotation ID
        },

        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            ...getColumnSearchProps('Comments'), // Search filter for Final Amount
        },

        {
            title: 'Final Amount',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
            // ...getColumnSearchProps('FinalAmount'), // Search filter for Final Amount
        },
        {
            title: 'status',
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
            title: 'createdDate',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleViewClick(record)}>
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

                    {loading === 'loading' ? (
                        <Spin tip="Loading..." />
                    ) : !quotations || quotations.length === 0 ? (
                        <Empty description="No Quotations Available" />
                    ) : (
                        <Table
                            dataSource= {Array.isArray(quotations) ? quotations : []}
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
                    />

                    {/* Create Quotation Form Modal */}
                    <CreateQuotationFormModal
                        visible={isCreateModalVisible}
                        onClose={handleCreateModalClose}
                        onSuccess={handleCreateQuotationSuccess} // Pass success handler
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Quotations;
