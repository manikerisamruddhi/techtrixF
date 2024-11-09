import React, { useState } from 'react';
import { Modal, Row, Input, Col, Table } from 'antd';

const EditQuotationModal = ({ visible, products, terms, onSave, onClose }) => {
    const [editableProducts, setEditableProducts] = useState(products);
    const [editableTerms, setEditableTerms] = useState(terms);

    const handleProductChange = (index, key, value) => {
        const updatedProducts = [...editableProducts];
        updatedProducts[index][key] = value;
        setEditableProducts(updatedProducts);
    };

    const handleTermsChange = (key, value) => {
        setEditableTerms({ ...editableTerms, [key]: value });
    };

    const handleSave = () => {
        onSave(editableProducts, editableTerms);
    };

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record, index) => (
                <Input
                    type="number"
                    value={text}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (text, record, index) => (
                <Input
                    type="number"
                    value={text}
                    onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)}
                />
            ),
        },
        {
            title: 'GST Amount',
            dataIndex: 'gstAmount',
            key: 'gstAmount',
            render: (text, record, index) => (
                <Input
                    type="number"
                    value={text}
                    onChange={(e) => handleProductChange(index, 'gstAmount', e.target.value)}
                />
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'TotalAmount',
            key: 'TotalAmount',
            render: (text, record, index) => (
                <Input
                    type="number"
                    value={text}
                    onChange={(e) => handleProductChange(index, 'TotalAmount', e.target.value)}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Edit Quotation"
            visible={visible}
            onCancel={onClose}
            onOk={handleSave}
            width={900}
            centered
            bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }} // Set fixed height and enable scrolling
        >
            <h3>Edit Products</h3>
            <Table
                dataSource={editableProducts}
                columns={columns}
                pagination={false}
                rowKey="description"
                scroll={{ x: 'max-content' }} // Enable horizontal scrolling for the table
        
            />

            <h3 style={{ marginTop: '20px' }}>Edit Quotation Terms</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
           
            <Row gutter={16}>
                <Col span={12}>
                    <strong>Customer will be billed:</strong>
                    <Input
                        // value={editableTerms.billing}
                        onChange={(e) => handleTermsChange('billing', e.target.value)}
                    />
                </Col>
                <Col span={12}>
                    <strong>Taxes:</strong>
                    <Input
                        // value={editableTerms.taxes}
                        onChange={(e) => handleTermsChange('taxes', e.target.value)}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <strong>Delivery:</strong>
                    <Input
                        // value={editableTerms.delivery}
                        onChange={(e) => handleTermsChange('delivery', e.target.value)}
                    />
                </Col>
                <Col span={12}>
                    <strong>Payment:</strong>
                    <Input
                        // value={editableTerms.payment}
                        onChange={(e) => handleTermsChange('payment', e.target.value)}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <strong>Warranty / Support:</strong>
                    <Input
                        // value={editableTerms.warranty}
                        onChange={(e) => handleTermsChange('warranty', e.target.value)}
                    />
                </Col>
                <Col span={12}>
                    <strong>Transport:</strong>
                    <Input
                        // value={editableTerms.transport}
                        onChange={(e) => handleTermsChange('transport', e.target.value)}
                    />
                </Col>
            </Row>
        </div>
       
        </Modal>
    );
};

export default EditQuotationModal;
