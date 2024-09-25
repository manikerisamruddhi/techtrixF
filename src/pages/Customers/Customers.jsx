// src/pages/Customers.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../redux/slices/customerSlice';
import { Button, Table, Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editCustomer, setEditCustomer] = React.useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAddOrEditCustomer = (values) => {
    if (editCustomer) {
      dispatch(updateCustomer({ customerId: editCustomer.id, updatedCustomer: values })).then(() => {
        toast.success('Customer updated successfully!');
        setEditCustomer(null);
      });
    } else {
      dispatch(addCustomer(values)).then(() => {
        toast.success('Customer added successfully!');
      });
    }
    setIsModalVisible(false);
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setIsModalVisible(true);
  };

  const handleDelete = (customerId) => {
    dispatch(deleteCustomer(customerId)).then(() => {
      toast.success('Customer deleted successfully!');
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Customer Management</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Customer
      </Button>
      <Table dataSource={customers} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editCustomer ? 'Edit Customer' : 'Add Customer'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editCustomer}
          onFinish={handleAddOrEditCustomer}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editCustomer ? 'Update' : 'Add'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
