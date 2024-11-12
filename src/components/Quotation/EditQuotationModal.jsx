import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Table, notification, Row, Col, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuotation } from '../../redux/slices/quotationSlice';
import { Description } from '@mui/icons-material';

const { Option } = Select;

const EditQuotationModal = ({ visible, quotation, onClose, products, onSave }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [editingProduct, setEditingProduct] = useState(null);

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
                // Add other fields as necessary
            });
        }
    }, [quotation, form]);

    const handleFinish = async (values) => {
        try {
            const updatedQuotationData = {
                ...quotation,
                ...values,
            };
    
            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));
            notification.success({ message: 'Quotation updated successfully!' });
            onSave(updatedQuotationData); // Pass the updated quotation back
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating quotation:', error);
            notification.error({ message: 'Failed to update quotation.' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    const handleProductUpdate = (updatedProduct) => {
        // Logic to update the product in the products array or call API if needed
        setEditingProduct(updatedProduct); // Close the edit product modal
    };

    const productColumns = [
        {
            title: 'brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'modelNo',
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
            title: 'Actions',
            key: 'actions',
            render: (_, product) => (
                <Button type="link" onClick={() => handleEditProduct(product)}>
                    Edit
                </Button>
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
                    dataSource={products}
                    rowKey="productId"
                    pagination={false}
                    bordered
                    size="small"
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
                    onOk={() => handleProductUpdate(editingProduct)}
                    width={700}
                >
                    <Form
                        layout="vertical"
                        initialValues={{
                            productName: editingProduct.productName,
                            quantity: editingProduct.quantity,
                            price: editingProduct.price,
                            brand: editingProduct.brand,
                            modelNo: editingProduct.modelNo,
                            description: editingProduct.description,
                            hsnCode: editingProduct.hsnCode,
                            unitOfMeasurement: editingProduct.unitOfMeasurement,
                            partCode: editingProduct.partCode,
                            isSerialNoAllowed: editingProduct.isSerialNoAllowed,
                            gst: editingProduct.gst

                        }}
                    >
                       <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="brand"
                                label="Brand :"
                                // rules={[{ required: true, message: 'Please input the brand!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                            <Form.Item
                                name="modelNo"
                                label="Model No :"
                                // rules={[{ required: true, message: 'Please input the model number!' }]}
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
                                label="Product description :"

                                rules={[{ required: true, message: 'Please input the description!' }]}
                            >
                                <Input.TextArea
                                    Rows={3}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>

                        
                        <Col span={8}>
                            <Form.Item
                                name="hsnCode"
                                label="HSN Code :"
                                // rules={[{ required: true, message: 'Please input the HSN code!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                       
                        <Col span={8}>
                            <Form.Item
                                name="unitOfMeasurement"
                                label="Unit of measurement :"
                                // rules={[{ required: true, message: 'Please input the HSN code!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col span={8}>
                            <Form.Item
                                name="partCode"
                                label="Part Code :"
                                // rules={[{ required: true, message: 'Please input the part code!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>

                       
                    <Col span={8}>
                            <Form.Item
                                name="isSerialNoAllowed"
                                label="Is Serial No Allowed :"
                                rules={[{ required: true, message: 'Please select is serial no allowed' }]}
                            >
                                <Radio.Group>
                                    <Radio value={true}>Yes</Radio>
                                    <Radio value={false}>No</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="price"
                                label="Price :"
                                // rules={[{ required: true, message: 'Please input the price!' }]}
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
                    </Row>

                    <Row gutter={16}>
                       
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="quantity"
                                label="Quantity :"
                                // rules={[{ required: true, message: 'Please input the quantity!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="warrantyMonths"
                                label="Warranty Months :"
                                // rules={[{ required: true, message: 'Please input the warranty months!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row >
   
                    </Form>
                </Modal>
            )}
        </Modal>
    );
};

export default EditQuotationModal;
