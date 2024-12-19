import React, { useState } from 'react';
import { Card, Button, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useUser from '../../hooks/Profile/useUser';
import UpdateProfile from '../../components/Profile/UpdateProfile';
import ChangePassword from '../../components/Profile/ChangePass';

const ProfilePage = () => {
    const { user, updateUser, logoutUser } = useUser();
    const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
    const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

    const handleLogout = () => {
        logoutUser();
        message.success('Logged out successfully!');
        window.location.reload();
    };

    const userName = user ? `${user.firstName} ${user.lastName}` : 'User not available';

    return (
        <div style={{
            maxWidth: '900px',
            margin: '50px auto',
            borderRadius: '20px',
            padding: '20px'
        }}>
            <Card
                title="My Profile"
                bordered
                style={{
                    maxWidth: '900px',
                    margin: '50px auto',
                    background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                    borderRadius: '8px',
                    padding: '20px',
                }}
            >
                {user && (
                    <div style={{
                        maxWidth: '700px',
                        margin: 'auto',
                        background: 'linear-gradient(to right, #c2e9fb, #a1c4fd)',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 60px',
                            }}
                        >
                            <section>
                                <p><strong>Name:</strong> {userName}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>User type:</strong> {user.userType}</p>
                                <p><strong>Contact:</strong> {user.phoneNumber}</p>
                                {/* <p><strong>Address:</strong> {user.address}</p> */}
                                {/* <p><strong>Pin Code:</strong> {user.zipCode || 'N/A'}</p> */}
                            </section>
                            <section
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                {/* Example image or icon */}
                                <Avatar
                                    size={200}

                                    // src="https://via.placeholder.com/100" // Replace with a valid image URL or use user's profile image URL
                                    icon={<UserOutlined />}
                                />
                            </section>
                        </div>
                        <div style={{
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Button
                                type="primary"
                                onClick={() => setIsEditProfileModalVisible(true)}
                                style={{ marginRight: '10px' }}
                            >
                                Update Profile
                            </Button>
                            <Button
                                type="default"
                                onClick={() => setIsChangePasswordModalVisible(true)}
                                style={{ marginRight: '10px' }}
                            >
                                Change Password
                            </Button>
                            <Button

                                style={{
                                    color: 'black', // Default color
                                    borderColor: 'black',
                                }}
                                onClick={handleLogout}
                                onMouseEnter={(e) => {
                                    e.target.style.color = 'red'; // Change text color to red on hover
                                    e.target.style.borderColor = 'red'; // Change border to red
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = 'black'; // Revert to default color
                                    e.target.style.borderColor = 'black'; // Revert to default border
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Modals */}
            <UpdateProfile
                visible={isEditProfileModalVisible}
                onClose={() => setIsEditProfileModalVisible(false)}
                user={user}
                onUpdate={updateUser}
            />
            <ChangePassword
                visible={isChangePasswordModalVisible}
                onClose={() => setIsChangePasswordModalVisible(false)}
                user={user}
            />
        </div>
    );
};

export default ProfilePage;
