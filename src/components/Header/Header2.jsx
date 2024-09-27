// src/components/Header.jsx

import React, { useState } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import NotificationBell from '../NotificationBell';
import NotificationList from '../NotificationList';

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  const notificationMenu = (
    <Menu style={{ width: 300 }}>
      {/* Add your NotificationList component or list items here */}
      <Menu.Item>
        <NotificationList />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <Dropdown
        // menu={notificationMenu}
        open={open}
        onOpenChange={handleOpenChange}
        trigger={['click']}
      >
        {/* <Button type="link" icon={<NotificationBell />} /> */}
      </Dropdown>
    </div>
  );
};

export default Header;
