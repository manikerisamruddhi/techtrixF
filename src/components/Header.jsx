// src/components/Header.jsx

import React, { useState } from 'react';
import { Dropdown, Button } from 'antd';
import NotificationBell from './NotificationBell';
import NotificationList from './NotificationList';

const Header = () => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const notificationMenu = (
    <div style={{ width: 300 }}>
      <NotificationList />
    </div>
  );

  return (
    <div className="header">
      <Dropdown
        overlay={notificationMenu}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger={['click']}
      >
        <NotificationBell />
      </Dropdown>
    </div>
  );
};

export default Header;
