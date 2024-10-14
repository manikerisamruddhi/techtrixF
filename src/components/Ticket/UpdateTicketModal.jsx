import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByDepartment } from "../../redux/slices/userSlice"; // Adjust the path to your slice
import { updateTicket } from "../../redux/slices/ticketSlice";

const { Option } = Select;

const UpdateTicketModal = ({ ticketData, isVisible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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
        isChargeble: ticketData.isChargeble,
        status: ticketData.status,
        createdBy: ticketData.createdBy,
        remark: ticketData.remark,
        assignedTo: ticketData.assignedToID || null,
      });
    } else {
      form.resetFields(); // Reset fields when modal is closed
    }
  }, [isVisible, dispatch, form, ticketData]);

  // Selectors to get service technicians from the Redux state
  const serviceTechnicians = useSelector((state) => state.users.users); // Adjust according to your state shape
  const loading = useSelector((state) => state.users.loading);

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        // Prepare updated ticket data by merging with existing ticket data
        const updatedTicketData = {
          ...ticketData, // Spread the existing ticket data
          ...values, // Then spread the new values from the form
          createdBy: "admin", // Ensure createdBy is set correctly
          status: "in-progress", // Set status to "in-progress"
          assignedDate: moment().toISOString(), // Get the current date for assignedDate when updating
        };

        // Dispatch the update action with the updated data
        dispatch(updateTicket({ id: ticketData.id, data: updatedTicketData })); // Assuming ticketData has an id field
        form.resetFields(); // Reset the form fields after update
        onCancel(); // Close the modal after updating
        onClose();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };


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
                placeholder={loading ? "Loading..." : "Select Service Technician"}
                loading={loading}
                showSearch
                optionFilterProp="label"  // Change this to filter based on the label
                filterOption={(input, option) => {
                  const label = option.label.toLowerCase(); // Using the label defined in the Option
                  return label.includes(input.toLowerCase());
                }}
              >
                {serviceTechnicians.map((tech) => (
                  <Option
                    key={tech.id}
                    value={tech.id}
                    label={`${tech.first_name} ${tech.last_name} [ID: ${tech.id}]`} // Set the label for filtering
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{`${tech.first_name} ${tech.last_name}`}</span>
                      <span style={{ marginLeft: '10px' }}>{`(ID: ${tech.id})`}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="remark" label="remark">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateTicketModal;
