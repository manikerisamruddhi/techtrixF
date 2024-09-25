// src/components/NotificationList.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotifications, markAsRead } from '../redux/slices/notificationSlice';
import { List, Button, Spin, Typography } from 'antd';

const { Text } = Typography;

const NotificationList = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item
          actions={[
            !item.read && (
              <Button type="link" onClick={() => handleMarkAsRead(item.id)}>
                Mark as Read
              </Button>
            ),
          ]}
        >
          <List.Item.Meta
            title={<Text>{item.title}</Text>}
            description={<Text type={item.read ? 'secondary' : 'danger'}>{item.message}</Text>}
          />
        </List.Item>
      )}
    />
  );
};

export default NotificationList;
