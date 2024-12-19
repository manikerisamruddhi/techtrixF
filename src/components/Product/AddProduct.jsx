import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Button, Row, Col, message, Select } from 'antd';
import { addProduct, updateProduct } from '../../redux/slices/productSlice'; // Redux action
import { useDispatch } from 'react-redux';
import { addQuotaionProduct } from '../../redux/slices/quotationSlice';

const { Option } = Select;

const ProductFormModal = ({ visible, onCancel, product, customerId, onAddProduct, quotation }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [productType, setProductType] = useState('Hardware'); // Default selection is Hardware

    // Set initial values when the modal is opened
    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                ...product,
                isSerialNoAllowed: product.isSerialNoAllowed !== undefined ? product.isSerialNoAllowed : true,
                quantity: product.quantity || 1,
            });
            setProductType(product.productType || 'Hardware');
        } else {
            form.resetFields(); // Reset the form if no product is selected
            setProductType('Hardware'); // Reset to default product type
        }
    }, [product, form]);

    const handleFinish = (values) => {
        const createdDate = new Date().toISOString(); // Adjust format as necessary
        const productData = {
            ...values,
            createdDate: createdDate,
            productType: productType,
        };

        // Only add customerId if it's defined
        if (customerId) {
            productData.customerId = customerId;
        }

        // Check if we are updating an existing product or adding a new one
        if (product) {
            // Update product
            dispatch(updateProduct({ productId: product.productId, updatedProduct: productData }))
                .then((resultAction) => {
                    if (updateProduct.fulfilled.match(resultAction)) {
                        onAddProduct(productData);
                        onCancel();  // Close modal
                        // refresh();
                        // Reset the form fields
                        form.resetFields();
                        // Show success message
                        message.success("Product updated successfully!");
                    } else {
                        message.error('Failed to update product.');
                    }
                });
        } else {
            // Add new product
            dispatch(addProduct(productData))
                .then((resultAction) => {
                    if (addProduct.fulfilled.match(resultAction)) {
                        const addedProduct = resultAction.payload;
                        onAddProduct(addedProduct);
                        if (quotation) {
                            const quotationProductsData = {
                                quotationId: quotation.quotationId,
                                productId: addedProduct.productId,
                            }

                            dispatch(addQuotaionProduct(quotationProductsData)).unwrap();
                        }

                        onCancel();  // Close modal
                        // refresh();
                        // Reset the form fields
                        form.resetFields();
                        // Show success message
                        message.success("Product added successfully!");
                    } else {
                        message.error('Failed to add product.');
                    }
                });
        }
    };

    return (
        <Modal
            title={product ? "Edit Product" : "Create Product"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            centered
        >
            <div style={{
                maxHeight: '600px',
                overflowY: 'auto',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: '#fff',
            }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        product,
                        isSerialNoAllowed: true, // Set the default value for isSerialNoAllowed to true
                        quantity: 1
                    }}
                >
                    {/* Product Type Selection */}
                    <Form.Item label="Product Type">
                        <Radio.Group value={productType} onChange={e => setProductType(e.target.value)}>
                            <Radio value="Hardware">Hardware</Radio>
                            <Radio value="Service">Service</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <>
                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="brand"
                                        label="Brand :"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="modelNo"
                                        label="Model No :"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Product description :"
                                    rules={[{ required: true, message: 'Please input the description!' }]}
                                >
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="hsnCode"
                                        label="HSN Code :"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="unitOfMeasurement"
                                        label="Unit of measurement :"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="partCode"
                                        label="Part Code :"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="price"
                                    label="Price :"
                                    rules={[{ required: true, message: 'Please enter the price' }]}
                                >
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="gst"
                                    label="GST :"
                                    rules={[{ required: true, message: 'Please select GST!' }]}
                                >
                                    <Select placeholder="Select GST">
                                        <Option value="18">18%</Option>
                                        <Option value="28">28%</Option>
                                        <Option value="0">None</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="quantity"
                                    label="Quantity :"
                                >
                                    <Input type="number" />
                                </Form.Item>
                            </Col>




                        </Row>

                        {productType === 'Hardware' && (
                            <Row gutter={16}>

                                <Col span={12}>
                                    <Form.Item
                                        name="isSerialNoAllowed"
                                        label="Is Serial No Allowed :"
                                        rules={[{ required: true, message: 'Please select if serial no is allowed' }]}
                                    >
                                        <Radio.Group
                                        >
                                            <Radio value={true}>Yes</Radio>
                                            <Radio value={false}>No</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="warrantyMonths"
                                        label="Warranty Months :"
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">
                                    {product ? "Update Product" : "Add Product"}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
};

export default ProductFormModal;