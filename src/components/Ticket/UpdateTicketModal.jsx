import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Switch, message, Button } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { fetchUsersByRole } from "../../redux/slices/userSlice"; // Adjust the path to your slice
import { updateTicket } from "../../redux/slices/ticketSlice";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useState } from "react";

const { Option } = Select;

const UpdateTicketModal = ({ ticketData, isVisible, onCancel, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const serviceTechnicians = useRef();
  const navigate = useNavigate();
  // console.log(ticketData);
  const [loggedInUserId, setLoggedInUserId] = useState(null);



    // useEffect(() => {
    //     console.log(`defticket : ${defticketId}`);
    // }, [defticketId]);


    useEffect(() => {
        // Get user from local storage
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setLoggedInUserId(loggedInUser.userId);
            // console.log(`loggedInUser  ${loggedInUserId}`);
        }
    }, []); // Empty dependency array to run only once on mount

  // Fetch service technicians from the "Service_Technical" department
    useEffect(() => {
      const fetchTechnicians = async () => {
        if (isVisible) {
          const result = await dispatch(fetchUsersByRole('Service_Technical'));
          serviceTechnicians.current = result.payload; // assuming the data is in `payload`
    
          console.log(result); // full response from dispatch
          console.log(`by role ${JSON.stringify(serviceTechnicians.current, null, 2)}`);
    
          form.setFieldsValue({
            title: ticketData.title,
            customerId: ticketData.customerId,
            productId: ticketData.productId,
            priority: ticketData.Priority,
            isChargeable: ticketData.isChargeable,
            status: ticketData.status,
            createdById: ticketData.createdById,
            description: ticketData.description,
            assignedToId: ticketData.assignedTo || null,
          });
        } else {
          form.resetFields(); // Reset fields when modal is closed
        }
      };
    
      fetchTechnicians();
    }, [isVisible, dispatch, form, ticketData]);
    
  // Selectors to get service technicians from the Redux state
  // const serviceTechnicians = useSelector((state) =>
  //   state.users.users.filter((user) => user.role === "Service_Technical")
  // ); // Adjust according to your state shape
  // const loading = useSelector((state) => state.users.loading);

  // console.log(serviceTechnicians);

  const handleUpdate = (close = false) => {
    form

      .validateFields()
      .then((values) => {
        // Prepare updated ticket data by merging with existing ticket data
        const updatedTicketData = {
          ...ticketData, // Spread the existing ticket data
          ...values, // Then spread the new values from the form
          createdById: loggedInUserId, // Ensure createdById is set correctly
          status: close ? "InProgress" : "closed",
        };

        if (!close) {
          console.log("clicked close");
          updatedTicketData.assignedDate = moment().toISOString(); // Set new assignedDate for updates
        }

        // Dispatch the update action with the updated data
        dispatch(updateTicket({ ticketId: ticketData.ticketId, data: updatedTicketData })); // Assuming ticketData has an id field
        form.resetFields(); // Reset the form fields after update
        message.success("Ticket updated successfully!");
        onCancel(); // Close the modal after updating
        onClose();

        // Add console log for debugging

        navigate('/tickets');
        console.log("Navigating to /tickets...");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  console.log(`by role ${JSON.stringify(serviceTechnicians.current, null, 2)}`);

  const currentTechnician = ticketData && ticketData.assignedToID
    ? serviceTechnicians.find((tech) => tech.userId === ticketData.assignedToID)
    : null;



  return (
    <Modal
      title="Update Ticket"
      visible={isVisible}
      onCancel={() => {
        form.resetFields(); // Reset fields when modal is closed
        onCancel(); // Call the passed onCancel function
      }}
      onOk={handleUpdate}
      okText="Update"
      width={900}
      centered
      footer={[
        <Button key="close" type="primary" style={{ backgroundColor: "green", borderColor: "green" }} onClick={(e) => { e.preventDefault(); handleUpdate(); }}>
          Close Ticket
        </Button>,
        <Button key="cancel" onClick={(e) => { e.preventDefault(); onCancel(); }}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={(e) => { e.preventDefault(); handleUpdate(true); }}>
          Update
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="update_ticket_form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="customerId" label="Customer ID">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="createdById" label="Created By">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>


          <Form.Item
  name="assignedTo"
  label="Assign Service Technician"
  rules={[{ required: true, message: "Please assign a service technician" }]}
>
  <Select
    placeholder="Select Service Technician"
    showSearch
    optionFilterProp="label"
    filterOption={(input, option) => {
      const label = option.label.toLowerCase();
      return label.includes(input.toLowerCase());
    }}
  >
    {(Array.isArray(serviceTechnicians.current) ? serviceTechnicians.current : []).length > 0 ? (
      serviceTechnicians.current.map((tech) => (
        <Option
          key={tech.userId}
          value={tech.userId}
          label={`${tech.firstName} ${tech.lastName} [ID: ${tech.userId}]`}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{`${tech.firstName} ${tech.lastName}`}</span>
            <span style={{ marginLeft: "10px" }}>{`(ID: ${tech.userId})`}</span>
          </div>
        </Option>
      ))
    ) : (
      <Option disabled>No technicians available</Option>
    )}
  </Select>
</Form.Item>

          </Col>
          <Col>
            <Form.Item name="isChargeable" label="Chargeability" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="description/remark :">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateTicketModal;
