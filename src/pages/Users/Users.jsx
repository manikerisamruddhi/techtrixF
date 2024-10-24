// src/pages/Users.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../redux/slices/userSlice';
import { Button, Table, Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editUser, setEditUser] = React.useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddOrEditUser = (values) => {
    if (editUser) {
      dispatch(updateUser({ userId: editUser.userId, updatedUser: values })).then(() => {
        toast.success('User updated successfully!');
        setEditUser(null);
      });
    } else {
      dispatch(addUser(values)).then(() => {
        toast.success('User added successfully!');
      });
    }
    setIsModalVisible(false);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId)).then(() => {
      toast.success('User deleted successfully!');
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
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
      <h1>User Management</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editUser ? 'Edit User' : 'Add User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editUser}
          onFinish={handleAddOrEditUser}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editUser ? 'Update' : 'Add'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
