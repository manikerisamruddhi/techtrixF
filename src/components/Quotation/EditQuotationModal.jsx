import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Table, notification, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuotation} from '../../redux/slices/quotationSlice';
import { updateQuotationProduct, deleteQuotationProduct } from '../../redux/slices/productSlice';

const EditQuotationModal = ({ visible, quotation, onClose, products, customer }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [quotationProducts, setQuotationProducts] = useState();
    useEffect(() => {
        if (quotation) {
            form.setFieldsValue({
                customerId: quotation.customerId,
                status: quotation.status,
                delivery: quotation.delivery,
                payment: quotation.payment,
                warrantyOrSupport: quotation.warrantyOrSupport,
                transport: quotation.transport,
                comments: quotation.comments,
            });
            setProductList(products);
            setQuotationProducts(quotation.quotationProducts);
        }
    }, [quotation, form, products]);

    const handleFinish = async (values) => {
        try {
            // Update quotation details
            const updatedQuotationData = {
                ...quotation,
                ...values,
            };

            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));

            // Update all edited products
            for (const product of productList) {
                await dispatch(updateQuotationProduct({
                    quotationId: quotation.quotationId,
                    productId: product.productId,
                    updatedProduct: product,
                }));
            }

            notification.success({ message: 'Quotation and products updated successfully!' });
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating quotation or products:', error);
            notification.error({ message: 'Failed to update quotation or products.' });
        }
    };

    const handleProductChange = (productId, key, value) => {
        setProductList((prevProducts) =>
            prevProducts.map((product) =>
                product.productId === productId ? { ...product, [key]: value } : product
            )
        );
    };

    const handleDeleteProduct = (productId) => {
        const foundProduct = quotationProducts.find(item => item.productId === productId);
        const quotationProductId = foundProduct.quotationProductId;

        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await dispatch(deleteQuotationProduct(quotationProductId));
                    setProductList((prevProducts) => prevProducts.filter(prod => prod.productId !== productId));
                    notification.success({ message: 'Product deleted successfully!' });
                } catch (error) {
                    console.error('Error deleting product:', error);
                    notification.error({ message: 'Failed to delete product.' });
                }
            },
        });
    };

    const calculateTotalAmount = () => {
        return productList.reduce((total, product) => {
            const quantity = product.quantity || 1;
            const gstAmount = (product.price * quantity * (product.gst / 100));
            const totalAmount = (product.price * quantity) + gstAmount;
            return total + totalAmount;
        }, 0).toFixed(2);
    };

    const productColumns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (text, record) => (
                <Input
                    value={record.brand}
                    onChange={(e) => handleProductChange(record.productId, 'brand', e.target.value)}
                />
            ),
        },
        {
            title: 'Model No',
            dataIndex: 'modelNo',
            key: 'modelNo',
            render: (text, record) => (
                <Input
                    value={record.modelNo}
                    onChange={(e) => handleProductChange(record.productId, 'modelNo', e.target.value)}
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.quantity}
                    onChange={(e) => handleProductChange(record.productId, 'quantity', parseInt(e.target.value))}
                />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 80,
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.price}
                    onChange={(e) => handleProductChange(record.productId, 'price', parseFloat(e.target.value))}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    onClick={() => handleDeleteProduct(record.productId)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <Modal
            title="Update Quotation"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    Update Quotation
                </Button>,
            ]}
            centered
            width={900}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Delivery" name="delivery">
                            <Input placeholder="Enter delivery details" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Payment" name="payment">
                            <Input placeholder="Enter payment details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Warranty/Support" name="warrantyOrSupport">
                            <Input placeholder="Enter warranty/support details" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Transport" name="transport">
                            <Input placeholder="Enter transport details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="Comment" name="comments">
                            <Input.TextArea placeholder="Enter comment" rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
                <h3>Products</h3>
                <Table
                    columns={productColumns}
                    dataSource={productList}
                    rowKey="productId"
                    pagination={false}
                    bordered
                    size="small"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={4} align="right">
                                <strong>Total Amount:</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <strong>{calculateTotalAmount()}</strong>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Form>
        </Modal>
    );
};

export default EditQuotationModal;
