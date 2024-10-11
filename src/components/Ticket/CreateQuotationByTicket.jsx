import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const CreateQuotationModal = ({ ticketId, visible, onCancel }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields when modal is closed
    onCancel(); // Call the onCancel prop
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        console.log('Quotation Data: ', values); // Submit the form data
        setIsModalVisible(false);
        form.resetFields(); // Reset form fields after submission
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <div>
      <Modal 
        title="Create Quotation" 
        visible={visible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          name="quotationForm"
        >
          <Form.Item
            name="description"
            label="Quotation Description"
            rules={[
              { required: true, message: 'Please enter the quotation description' },
            ]}
          >
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter the price' },
              { type: 'number', min: 0, message: 'Price must be a positive number' },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter price"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateQuotationModal;