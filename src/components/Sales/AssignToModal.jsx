import React, { useEffect, useState } from 'react';
import { Modal, Select, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/slices/userSlice'; // Use fetchUsers instead of fetchUsersByDepartment
import { selectUserstatus } from '../../redux/slices/userSlice'; // Select the correct status
import axios from 'axios'; // Axios for making the API call

const AssignToModal = ({ visible, onClose, ticketId, onAssign }) => {
    const dispatch = useDispatch();
    const allUsers = useSelector((state) => state.users.users); // Select all users
    const status = useSelector(selectUserstatus); // Use the correct status selector
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [logisticsUsers, setLogisticsUsers] = useState([]); // State to store filtered logistics users

    // Fetch all users when the modal is visible
    useEffect(() => {
        if (visible) {
            dispatch(fetchUsers());
        }
    }, [visible, dispatch]);

    // Filter users by department (Logistics)
    useEffect(() => {
        if (allUsers && allUsers.length > 0) {
            const filteredUsers = allUsers.filter(user => user.department === 'Logistics');
            setLogisticsUsers(filteredUsers);
        }
    }, [allUsers]);

    const handleAssign = async () => {
        if (selectedUserId) {
            try {
                await onAssign(ticketId, selectedUserId); // Call the onAssign function passed as a prop
                message.success(`Ticket successfully assigned to user ID: ${selectedUserId}`);
                onClose(); // Close the modal
            } catch (error) {
                message.error('Error assigning the ticket. Please try again.');
            }
        } else {
            message.error('Please select a user to assign.');
        }
    };

    return (
        <Modal
            title="Assign Ticket"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {status === 'loading' ? (
                <Spin />
            ) : (
                <>
                    <Select
                        placeholder="Select a user"
                        onChange={setSelectedUserId}
                        style={{ width: '100%' }}
                    >
                        {logisticsUsers && logisticsUsers.length > 0 ? (
                            logisticsUsers.map(user => (
                                <Select.Option key={user.userid} value={user.userid}>
                                    {`${user.userid} ${user.first_name} ${user.last_name}`}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option disabled>No Users Available</Select.Option>
                        )}
                    </Select>
                    <Button
                        type="primary"
                        onClick={handleAssign}
                        style={{ marginTop: 16 }}
                    >
                        Assign
                    </Button>
                </>
            )}
        </Modal>
    );
};

export default AssignToModal;
