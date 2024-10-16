import React from 'react';
import { Modal, Form, Input, Checkbox, Button, Row, Col } from 'antd';
import { addProduct } from '../../redux/slices/productSlice'; // Redux action

const AddProductModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        // Set the created date to the current date and time
        const createdDate = new Date().toISOString(); // Adjust format as necessary
        onCreate({ ...values, created_date: createdDate });
        form.resetFields();
    };

    return (
        <Modal
            title="Create Product"
            visible={ visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="productid"
                            label="Product ID"
                            rules={[{ required: true, message: 'Please input the product ID!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="brand"
                            label="Brand"
                            rules={[{ required: true, message: 'Please input the brand!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    
                    <Col span={12}>
                        <Form.Item
                            name="hsn_code"
                            label="HSN Code"
                            rules={[{ required: true, message: 'Please input the HSN code!' }]}
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
                <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Description"
                            
                            rules={[{ required: true, message: 'Please input the description!' }]}
                        >
                            <Input.TextArea
                            Row={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="part_code"
                            label="Part Code"
                            rules={[{ required: true, message: 'Please input the part code!' }]}
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
                            name="warranty_months"
                            label="Warranty Months"
                            rules={[{ required: true, message: 'Please input the warranty months!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Add Product</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AddProductModal;