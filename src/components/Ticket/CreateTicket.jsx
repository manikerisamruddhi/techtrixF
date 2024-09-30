import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice'; // Adjust the path as necessary
import { fetchUsers, fetchDepartments } from '../../redux/slices/userSlice'; // Adjust the path as necessary

const CreateTicket = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const { departments } = useSelector((state) => state.departments);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [assignedUser, setAssignedUser] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketPriority, setTicketPriority] = useState('');

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        if (selectedDepartment) {
            // Filter users based on selected department
            const filteredUsers = users.filter(user => user.departmentId === Number(selectedDepartment));
            setAvailableUsers(filteredUsers);
            setAssignedUser(''); // Reset assigned user when department changes
        }
    }, [selectedDepartment, users]);

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const handleUserChange = (event) => {
        setAssignedUser(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setTicketDescription(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setTicketPriority(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (ticketDescription && assignedUser) {
            const newTicket = {
                description: ticketDescription,
                priority: ticketPriority,
                assignedUserId: assignedUser, // Include the assigned user ID
            };
            dispatch(createTicket(newTicket)); // Dispatch the createTicket action
            // Reset fields after submission
            setTicketDescription('');
            setTicketPriority('');
            setAssignedUser('');
            setSelectedDepartment('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Ticket</h2>

            <label>
                Select Department:
                <select value={selectedDepartment} onChange={handleDepartmentChange}>
                    <option value="">Select a department</option>
                    {departments.map(department => (
    <Option key={department.id || department.name} value={department.id}>
        {department.name}
    </Option>
))}
                </select>
            </label>

            {availableUsers.length > 0 && (
                <div>
                    <label>
                        Select User:
                        <select value={assignedUser} onChange={handleUserChange}>
                            <option value="">Select a user</option>
                            {availableUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            <label>
                Ticket Description:
                <textarea value={ticketDescription} onChange={handleDescriptionChange} required />
            </label>

            <label>
                Ticket Priority:
                <select value={ticketPriority} onChange={handlePriorityChange}>
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>

            <button type="submit">Create Ticket</button>
        </form>
    );
};

export default CreateTicket;
