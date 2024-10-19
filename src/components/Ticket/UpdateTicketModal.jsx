import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Switch, message, Button } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByDepartment } from "../../redux/slices/userSlice"; // Adjust the path to your slice
import { updateTicket } from "../../redux/slices/ticketSlice";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const UpdateTicketModal = ({ ticketData, isVisible, onCancel, onClose  }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const navigate = useNavigate();
// console.log(ticketData);

  // Fetch service technicians from the "Service_Technical" department
  useEffect(() => {
    if (isVisible) {
      dispatch(fetchUsersByDepartment("Service_Technical"));
      // Populate form with existing ticket data
      form.setFieldsValue({
        title: ticketData.title,
        customerID: ticketData.customerID,
        productID: ticketData.ProductID,
        priority: ticketData.Priority,
        isChargeable: ticketData.isChargeable,
        status: ticketData.status,
        createdBy: ticketData.createdBy,
        description: ticketData.description,
        assignedTo: ticketData.assignedTo || null,
      });
    } else {
      form.resetFields(); // Reset fields when modal is closed
    }
  }, [isVisible, dispatch, form, ticketData]);

  // Selectors to get service technicians from the Redux state
  const serviceTechnicians = useSelector((state) => state.users.users); // Adjust according to your state shape
  const loading = useSelector((state) => state.users.loading);

  const handleUpdate = (close = false) => {
    form
    
      .validateFields()
      .then((values) => {
        // Prepare updated ticket data by merging with existing ticket data
        const updatedTicketData = {
          ...ticketData, // Spread the existing ticket data
          ...values, // Then spread the new values from the form
          createdBy: "admin", // Ensure createdBy is set correctly
          status: close ? "in-progress" : "closed",
           };

           if (!close) {
            console.log("clicked close");
            updatedTicketData.assignedDate = moment().toISOString(); // Set new assignedDate for updates
          }

        // Dispatch the update action with the updated data
        dispatch(updateTicket({ id: ticketData.id, data: updatedTicketData })); // Assuming ticketData has an id field
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


  const currentTechnician = ticketData && ticketData.assignedToID 
  ? serviceTechnicians.find((tech) => tech.id === ticketData.assignedToID)
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
            <Form.Item name="customerID" label="Customer ID">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="createdBy" label="Created By">
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
    placeholder={
      loading
        ? "Loading..."
        : currentTechnician
        ? `${currentTechnician.first_name} ${currentTechnician.last_name} (ID: ${currentTechnician.id})`
        : "Select Service Technician"
    }
    loading={loading}
    showSearch
    optionFilterProp="label"
    filterOption={(input, option) => {
      const label = option.label.toLowerCase();
      return label.includes(input.toLowerCase());
    }}
  >
    {serviceTechnicians.map((tech) => (
      <Option
        key={tech.id}
        value={tech.id}
        label={`${tech.first_name} ${tech.last_name} [ID: ${tech.id}]`}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{`${tech.first_name} ${tech.last_name}`}</span>
          <span style={{ marginLeft: "10px" }}>{`(ID: ${tech.id})`}</span>
        </div>
      </Option>
    ))}
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
            <Form.Item name="description" label="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateTicketModal;
