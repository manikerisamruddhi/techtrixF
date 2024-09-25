import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice';
import { useHistory } from 'react-router-dom';

const CreateTicket = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'Low'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createTicket(formData));
        history.push('/tickets');
    };

    return (
        <div className="create-ticket-container">
            <h1>Create New Ticket</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <button type="submit">Create Ticket</button>
            </form>
        </div>
    );
};

export default CreateTicket;
