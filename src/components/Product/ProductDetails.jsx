import React from 'react';
import { Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ProductDetailModal = ({ visible, product, onClose }) => {
    // Check if the product is defined
    if (!product) {
        return null; // or you can return a loading spinner or a message
    }

    const formattedDate = product.createdDate ? new Date(product.createdDate).toLocaleDateString() : 'N/A';


    return (
        <Modal
            title="Product Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Title level={2}>{product.brand} - {product.modelNo}</Title>
            <Paragraph><strong>Product ID:</strong> {product.productId}</Paragraph>
            <Paragraph><strong>Brand:</strong> {product.brand}</Paragraph>
            <Paragraph><strong>Description:</strong> {product.description || 'N/A'}</Paragraph>
            <Paragraph><strong>Price:</strong> ₹ {product.price?.toFixed(2) || 'N/A'}</Paragraph>
            <Paragraph><strong>Quantity:</strong> {product.quantity || 'N/A'}</Paragraph>
            <Paragraph><strong>Warranty (Months):</strong> {product.warrantyMonths || 'N/A'}</Paragraph>
            <Paragraph><strong>Model No:</strong> {product.modelNo || 'N/A'}</Paragraph>
            <Paragraph><strong>HSN Code:</strong> {product.hsnCode || 'N/A'}</Paragraph>
            <Paragraph><strong>Part Code:</strong> {product.partCode || 'N/A'}</Paragraph>
            <Paragraph><strong>Created Date:</strong> {formattedDate}</Paragraph>
            {/* Add additional fields as necessary */}
        </Modal>
    );
};

export default ProductDetailModal;