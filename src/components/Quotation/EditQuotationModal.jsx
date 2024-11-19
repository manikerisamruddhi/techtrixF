import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Table, notification, Row, Col, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuotation } from '../../redux/slices/quotationSlice';
import { updateProduct, deleteProduct } from '../../redux/slices/productSlice';

const { Option } = Select;

const EditQuotationModal = ({ visible, quotation, onClose, products }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Initialize as null

    useEffect(() => {
        if (quotation) {
            form.setFieldsValue({
                customerId: quotation.customerId,
                status: quotation.status,
                delivery: quotation.delivery,
                payment: quotation.payment,
                warrantyOrSupport: quotation.warrantyOrSupport,
                transport: quotation.transport,
                comments: quotation.comments
            });
            setProductList(products); // Initialize product list from quotation
        }
    }, [quotation, form]);

    const handleFinish = async (values) => {
        try {
            const updatedQuotationData = {
                ...quotation,
                ...values,
                products: productList // Include updated products array in quotation
            };

            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));
            notification.success({ message: 'Quotation updated successfully!' });

            // Dispatch the updateProducts action to update the products
            for (const product of productList) {
                await dispatch(updateProduct({ productId: product.productId, updatedProduct: product }));
            }
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating quotation:', error);
            notification.error({ message: 'Failed to update quotation.' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    const handleProductUpdate = () => {
        setProductList((prevProducts) =>
            prevProducts.map((prod) =>
                prod.productId === editingProduct.productId ? { ...editingProduct } : prod
            )
        );
        setEditingProduct(null); // Close the edit product modal
        notification.success({ message: 'Product updated successfully!' });
    };

    const handleDeleteProduct = (productId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    // Make API call to delete the product
                    await dispatch(deleteProduct(productId)); // Assuming deleteProduct is an action that handles the API call
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
            const gstAmount = (product.price * product.quantity * (product.gst / 100));
            const totalAmount = (product.price * product.quantity) + gstAmount;
            return total + totalAmount;
        }, 0).toFixed(2); // Return as a string with two decimal places
    };

    const productColumns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Model No',
            dataIndex: 'modelNo',
            key: 'modelNo',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'GST (%)',
            dataIndex: 'gst',
            key: 'gst',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, product) => (
                <>
                    <Button type="link" onClick={() => handleEditProduct(product)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteProduct(product.productId)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Modal
            title="Update Quotation"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
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
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Quotation
                    </Button>
                </Form.Item>
            </Form>

            {editingProduct && (
                <Modal
                    title="Edit Product"
                    visible={!!editingProduct}
                    onCancel={() => setEditingProduct(null)}
                    onOk={handleProductUpdate}
                    width={700}
                >
                    <Form
                        layout="vertical"
                        initialValues={editingProduct}
                        onValuesChange={(changedValues) => {
                            setEditingProduct((prev) => ({ ...prev, ...changedValues }));
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="brand" label="Brand">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="modelNo" label="Model No">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item name="description" label="Product description" rules={[{ required: true, message: 'Please input the description!' }]}>
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="hsnCode" label="HSN Code">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="unitOfMeasurement" label="Unit of Measurement">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="partCode" label="Part Code">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="isSerialNoAllowed" label="Is Serial No Allowed">
                                    <Radio.Group>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="price" label="Price">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="gst" label="GST" rules={[{ required: true, message: 'Please select GST!' }]}>
                                    <Select placeholder="Select GST">
                                        <Option value="18">18%</Option>
                                        <Option value="28">28%</Option>
                                        <Option value="0">None</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="quantity" label="Quantity">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="warrantyMonths" label="Warranty Months">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            )}
        </Modal>
    );
};

export default EditQuotationModal;