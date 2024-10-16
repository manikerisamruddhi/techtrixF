import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber } from 'antd';

const EditModal = ({ visible, product, onCancel, onSave }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        // Set the form values when the modal opens
        if (product) {
            form.setFieldsValue(product);
        }
    }, [product, form]);

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                onSave(values);  // Send updated values to parent component
                form.resetFields();  // Reset form after saving
            })
            .catch(info => {
                //console.log('Validation Failed:', info);
            });
    };

    return (
        <Modal
            visible={visible}
            title="Edit Product"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save
                </Button>
            ]}
        >
            <Form form={form} layout="vertical" name="editProductForm">
                <Form.Item name="brand" label="Brand" rules={[{ required: true, message: 'Please input the brand!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="modelNo" label="Model No" rules={[{ required: true, message: 'Please input the model number!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="hsnCode" label="hsnCode" rules={[{ required: true, message: 'Please input the hsnCode!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
                <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
                <Form.Item name="warrantyMonths" label="warrantyMonths" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
                
            </Form>
        </Modal>
    );
};

export default EditModal;
