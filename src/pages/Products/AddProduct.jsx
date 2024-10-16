import React from 'react';
import { Modal, Form, Input, Radio, Button, Row, Col, message } from 'antd';
import { addProduct } from '../../redux/slices/productSlice'; // Redux action

const ProductFormModal = ({ visible, onCancel, onCreate, product }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        // Set the created date to the current date and time
        const createdDate = new Date().toISOString(); // Adjust format as necessary
        const productData = product ? { ...product, ...values, created_date: createdDate } : { ...values, created_date: createdDate };

        // Call onCreate to handle the product addition
        onCreate(productData);
        
        // Show success message
        message.success(product ? "Product updated successfully!" : "Product added successfully!");

        // Reset the form fields
        form.resetFields();

        // Close the modal
        onCancel();
    };

    return (
        <Modal
            title={product ? "Edit Product" : "Create Product"}
            visible={visible}
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
                    initialValues={product}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="brand"
                                label="Brand"
                                rules={[{ required: true, message: 'Please input the brand!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                            <Form.Item
                                name="modelNo"
                                label="Model No"
                                rules={[{ required: true, message: 'Please input the model number!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>


                        



                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"

                                rules={[{ required: true, message: 'Please input the description!' }]}
                            >
                                <Input.TextArea
                                    Rows={3}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>

                        <Col span={12}>
                            <Form.Item
                                name="isSerialNoAllowed"
                                label="Is Serial No Allowed"
                                rules={[{ required: true, message: 'Please select is serial no allowed' }]}
                            >
                                <Radio.Group>
                                    <Radio value={true}>Yes</Radio>
                                    <Radio value={false}>No</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="partCode"
                                label="Part Code"
                                rules={[{ required: true, message: 'Please input the part code!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        {/* <Col  span={12}>
    <Form.Item
    name="serialNo"
    label="Serial No"
    rules={[{ required: true, message: 'Please enter the serial no' }]}
>
    <Input placeholder="Enter serial no" />
</Form.Item>
    </Col> */}
                    </Row>

                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                name="hsnCode"
                                label="HSN Code"
                                rules={[{ required: true, message: 'Please input the HSN code!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: 'Please input the price!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="quantity"
                                label="Quantity"
                                rules={[{ required: true, message: 'Please input the quantity!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="warrantyMonths"
                                label="Warranty Months"
                                rules={[{ required: true, message: 'Please input the warranty months!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row >
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