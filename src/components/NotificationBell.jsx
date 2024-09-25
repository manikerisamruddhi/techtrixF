// src/components/NotificationBell.jsx

import React, { useEffect } from 'react';
import { Badge, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotifications } from '../redux/slices/notificationSlice';

const NotificationBell = ({ onClick }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Button type="link" icon={
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: '24px' }} />
      </Badge>
    } onClick={onClick} />
  );
};

export default NotificationBell;
