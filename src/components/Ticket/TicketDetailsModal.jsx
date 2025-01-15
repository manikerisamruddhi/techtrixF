import React, { useState } from 'react';
import { Modal, Descriptions, Badge, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import UpdateTicketModal from './UpdateTicketModal'; // Importing the update ticket modal
import { fetchCustomerByID } from '../../redux/slices/customerSlice';
import QuotationFormModal from '../Quotation/CreateQuotation';
import { useEffect } from 'react';
import { updateTicket } from '../../redux/slices/ticketSlice';
import { getQuotationByTicketId, getQuotationById, fetchQuotations } from '../../redux/slices/quotationSlice';
import QuotationDetailsModal from '../Quotation/QuotationDetails';

const TicketDetailsModal = ({ visible, ticket, onClose, onCreateQuotation, users }) => {
    const dispatch = useDispatch();
    const [isQuotationModalVisible, setQuotationModalVisible] = useState(false); // State to manage quotation modal visibility
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false); // State to manage update ticket modal visibility
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);


    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createdById, setCreatedBy] = useState(''); // State variable to store createdById
    const [assighnedToId, setAssighnedToId] = useState(''); // State variable to store createdById
    const [customer, setCustomer] = useState(''); // State variable to store createdById
    const [quotation, setQuotation] = useState();

    // Effect to run when the ticket is available
    useEffect(() => {
        if (ticket) {
            dispatch(fetchCustomerByID(ticket.customerId))
                .unwrap() // Unwrap the promise to get the resolved response
                .then((response) => {
                    setCustomer(response); // Set the customer data from the response
                    // console.log(response); // Log the resolved response
                })
                .catch((error) => {
                    console.error("Error fetching customer:", error); // Handle error if the API call fails
                });


            setCreatedBy(ticket.createdById); // Set createdById from ticket
            setAssighnedToId(ticket.assignedTo); // Set assignedToId from ticket
        }
    }, [ticket, dispatch]);



    useEffect(() => {
        if (ticket) {
            const ticketId = ticket.ticketId;
            if (ticket.isQuotationCreated === true) {
                dispatch(getQuotationByTicketId(ticketId))
                    .unwrap() // Unwrap the promise to get the resolved response
                    .then((response) => {
                        const quotationId = response.quotationId;
                        dispatch(getQuotationById(quotationId))
                            .unwrap() // Unwrap the promise to get the resolved response
                            .then((response) => {
                                setQuotation(response); // Set the customer data from the response
                                //  console.log(response); // Log the resolved response
                            })
                    })
                    .catch((error) => {
                        console.error("Error fetching quotation by ticket:", error); // Handle error if the API call fails
                    });
            }
        }
    }, [visible, dispatch, isDetailsModalVisible]);

    const handleDetailsModalClose = () => {
        setIsDetailsModalVisible(false);
        // setSelectedQuotation(null); // Clear the selected quotation
        dispatch(fetchQuotations()); // Fetch quotations again to refresh the list
    };

    // console.log(users);
    const user = users.find((user) => user.userId === createdById); // Adjust based on your user object structure
    const createdByName = user ? `${user.firstName} ${user.lastName}` : createdById; // Display user name or fallback text
    const assighnedUser = users.find((assighnedUser) => assighnedUser.userId === assighnedToId); // Adjust based on your user object structure
    const assighnedByName = assighnedUser ? `${assighnedUser.firstName} ${assighnedUser.lastName}` : 'Not Assigned'; // Display user name or fallback text


    // Function to open the create quotation modal
    const handleCreateQuotationClick = () => {
        setQuotationModalVisible(true); // Open the create quotation modal
    };

    const onUpdateTicket = async (updatedTicket) => {
        try {
            // Dispatch the update action and wait for it to complete (if it's asynchronous)
            const response = dispatch(updateTicket(updatedTicket));
            // If update is successful, show success message
            message.success('Ticket updated successfully!');
            // Close the modal after the dispatch completes
            if(response) {
                onClose();
            }
        } catch (error) {
            // Handle any errors here if needed
            message.error('Failed to update ticket. Please try again.');
        }
    };

    // Function to close the create quotation modal
    const handleQuotationModalClose = () => {
        setQuotationModalVisible(false); // Close the create quotation modal
    };

    // Function to open the update ticket modal and pass the ticket data
    const handleUpdateTicketClick = () => {
        setUpdateModalVisible(true); // Open the update ticket modal
    };

    // Function to close the update ticket modal
    const handleUpdateModalClose = () => {
        setUpdateModalVisible(false); // Close the update ticket modal
    };

    const handleCreateQuotation = (quotationData) => {
        message.success('Quotation created successfully!');
        setIsCreateModalVisible(false); // Close the modal after creation
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
    };

    return (
        <>
            {/* Main Ticket Details Modal */}
            <Modal
                title="Ticket Details"
                open={visible}
                onCancel={onClose}
                footer={null}
                centered
                width={900}
            >
                {ticket ? (
                    <>
                        <Descriptions
                            bordered
                            size="middle"
                            title="Detailed Information"
                            column={2}
                            labelStyle={{ padding: '10px 24px' }}
                            contentStyle={{ padding: '10px 24px' }}
                        >
                            <Descriptions.Item label="Ticket ID" span={1}>{ticket.ticketId}</Descriptions.Item>
                            <Descriptions.Item label="title" span={1}>{ticket.title}</Descriptions.Item>
                            {ticket.customerId && (
                                <Descriptions.Item label="Customer" span={1}>{customer.firstName + ' ' + customer.lastName}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Created By" span={1}>{createdByName}</Descriptions.Item>
                            <Descriptions.Item label="Remark" span={2}>{ticket.description}</Descriptions.Item>
                            <Descriptions.Item label="status" span={1}>
                                <Badge status={ticket.status === 'Resolved' ? 'success' : 'processing'} text={ticket.status} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Created Date" span={1}>
  {new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(new Date(ticket.createdDate).getTime() + 5.5 * 60 * 60 * 1000))}
</Descriptions.Item>

                            <Descriptions.Item label="Resolved" span={1}>{ticket.isResolved ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Is Chargeable" span={1}>{ticket.isChargeable ? 'Yes' : 'No'}</Descriptions.Item>
                            {/* <Descriptions.Item label="Isqqq" span={1}>{ticket.isQuotationCreated ? 'Yes' : 'No'}</Descriptions.Item> */}
                            <Descriptions.Item label="Assigned To" span={1}>{assighnedByName ? assighnedByName : 'Not Assigned'}</Descriptions.Item>

                            {ticket.isChargeable && (
                                <Descriptions.Item label="is Quoatation Created" span={1}>{ticket.isQuotationCreated ? 'Created' : 'Not created'}</Descriptions.Item>
                            )}

                        </Descriptions>
                        {ticket.status !== 'closed' && (
                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                {/* Update Ticket Button */}

                                <Button
                                    type="primary"
                                    onClick={handleUpdateTicketClick}
                                    style={{ marginRight: '10px' }}
                                    icon={<ReloadOutlined />}
                                >
                                    Update Ticket
                                </Button>
                                {/* Render the Create Quotation button if isChargeable is true */}
                                {!ticket.isQuotationCreated && ticket.isChargeable && (
                                    <Button
                                        type="primary"
                                        onClick={() => setIsCreateModalVisible(true)}  // Open the Create Quotation modal
                                        icon={<DollarOutlined />}
                                    >
                                        Create Quotation
                                    </Button>
                                )}
                                {ticket.isQuotationCreated && ticket.isChargeable && (
                                    <Button
                                        type="primary"
                                        onClick={() => setIsDetailsModalVisible(true)}  // Open the Create Quotation modal
                                        icon={<DollarOutlined />}
                                    >
                                        view Quotation
                                    </Button>
                                )}

                            </div>


                        )}


                    </>
                ) : (
                    <p>No ticket details available</p>
                )}
            </Modal>

            {/* Create Quotation Modal */}
            <QuotationFormModal
                defticketId={ticket && ticket.ticketId}
                defaultCustomer={ticket && ticket.customerId}
                title="Create Quotation"
                visible={isCreateModalVisible}
                onCreate={handleCreateQuotation}
                onClose={handleCreateModalClose}
                footer={null}
                centered
            />

            {/* Update Ticket Modal */}
            <UpdateTicketModal
                ticketData={ticket} // Pass the current ticket data for updating
                customer
                isVisible={isUpdateModalVisible}
                onUpdate={async (updatedTicket) => {
                    onUpdateTicket(updatedTicket); // Wait for the update operation to complete
                    handleUpdateModalClose();           // Close the update modal
                                             // Close the TicketDetailsModal
                }}
                onCancel={handleUpdateModalClose}
                onClose={onClose}
            />

            {/* Quotation Details Modal */}
            <QuotationDetailsModal
                visible={isDetailsModalVisible}
                onClose={handleDetailsModalClose}
                quotation={quotation}
            />
        </>
    );
};

export default TicketDetailsModal;
