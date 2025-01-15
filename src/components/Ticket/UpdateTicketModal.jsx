import React, { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Switch, message, Button, Spin } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { fetchUsersByRole } from "../../redux/slices/userSlice";
import { updateTicket } from "../../redux/slices/ticketSlice";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const UpdateTicketModal = ({ ticketData, isVisible, onCancel, onClose, customer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const serviceTechnicians = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin


  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (loggedInUser ) {
      setLoggedInUserId(loggedInUser.userId);
      setIsAdmin(loggedInUser.role === "Admin" || loggedInUser.role === "Service_Technical" ); // Check if the user is admin
    }
  }, []);


  useEffect(() => {
    const fetchTechnicians = async () => {
      if (isVisible) {
        setLoading(true); // Start loading
        try {
          const result = await dispatch(fetchUsersByRole("Service_Technical"));
          serviceTechnicians.current = result.payload; // assuming the data is in `payload`
          form.setFieldsValue({
            title: ticketData.title,
            customerId: ticketData.customerId,
            productId: ticketData.productId,
            priority: ticketData.Priority,
            isChargeable: ticketData.isChargeable,
            status: ticketData.status,
            createdById: ticketData.createdById,
            description: ticketData.description,
            assignedTo: ticketData.assignedTo || null,
          });
        } catch (error) {
          message.error("Failed to fetch technicians.");
        } finally {
          setLoading(false); // Stop loading
        }
      } else {
        form.resetFields(); // Reset fields when modal is closed
      }
    };

    fetchTechnicians();
  }, [isVisible, dispatch, form, ticketData]);

  const handleUpdate = (close = false) => {
    form
      .validateFields()
      .then((values) => {
        const updatedTicketData = {
          ...ticketData,
          ...values,
          createdById: loggedInUserId,
          status: close ? "InProgress" : "Closed",
        };

        if (!close) {
          updatedTicketData.assignedDate = moment().toISOString();
        }

        dispatch(updateTicket({ ticketId: ticketData.ticketId, data: updatedTicketData }));
        form.resetFields();
        message.success("Ticket updated successfully!");
        onCancel();
        onClose();
        navigate("/tickets");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Update Ticket"
      open={isVisible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={900}
      centered
      footer={[
        <Button
          key="close"
          type="primary"
          style={{ backgroundColor: "green", borderColor: "green" }}
          onClick={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          Close Ticket
        </Button>,
        <Button
          key="cancel"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            handleUpdate(true);
          }}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="update_ticket_form">
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
              // rules={[{ required: true, message: "Please assign a service technician" }]}
            >
              <Select
                placeholder={loading ? "Loading technicians..." : "Select Service Technician"}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => {
                  const label = option.label.toLowerCase();
                  return label.includes(input.toLowerCase());
                }}
                notFoundContent={loading ? <Spin size="small" /> : "No technicians available"}
                disabled={loading || !isAdmin} // Disable if loading or not admin
              >
                {(Array.isArray(serviceTechnicians.current) ? serviceTechnicians.current : []).map(
                  (tech) => (
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
                  )
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
