import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addQuotation } from '../../redux/slices/quotationSlice';
import { addProduct } from '../../redux/slices/productSlice';

const { Option } = Select;

const CreateTicketModalForm = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isChargeable, setIsChargeable] = useState(false);
    const [isPremiumCustomer, setIsPremiumCustomer] = useState(false);

    const { customers } = useSelector((state) => state.customers);
    const { items } = useSelector((state) => state.products);

    useEffect(() => {
        if (visible) {
            dispatch(fetchCustomers());
            dispatch(fetchProducts());
        }
    }, [dispatch, visible]);

    const handleCustomerChange = (value) => {
        const selectedCust = customers.find(customer => customer.id === value);
        setSelectedCustomer(selectedCust);

        setIsPremiumCustomer(selectedCust?.isPremium || false);

        form.setFieldsValue({ ProductID: null });
        setSelectedProduct(null);
    };

    const handleProductChange = (value) => {
        const product = items.find((item) => item.id === value);
        setSelectedProduct(product);
        
        if (product) {
            form.setFieldsValue({ Description: product.description });
        } else {
            form.setFieldsValue({ Description: '' });
        }
    };

    // const handleisChargebleChange = (e) => {
    //     setIsChargeable(e.target.value === 'Chargeable');
    // };

    const onFinish = async (values) => {
        const currentDate = new Date().toISOString();

        //console.log(values);
        const ticketData = {
            title: values.title,
            customerID: values.customerID,
            ProductID: values.ProductID,
            Priority: values.Priority,
            isChargeble: values.isChargeble,
            status: 'Open',
            createdBy: 'Admin',
            CreatedDate: currentDate,
            remark: values.remark,
        };
        

        try {
            const resultAction = await dispatch(createTicket(ticketData));

            if (createTicket.fulfilled.match(resultAction)) {
                const newTicketID = resultAction.payload.id;

                message.success('Ticket created successfully!');

                if (isChargeable) {
                    const quotationValues = {
                        TicketID: newTicketID,
                        FinalAmount: values.FinalAmount,
                        CreatedDate: currentDate,
                        status: "Pending",
                    };
                    await dispatch(addQuotation(quotationValues));

                    message.success('Quotation created successfully!');

                    const productValues = {
                        TicketID: newTicketID,
                        customerID: values.customerID,
                        description: values.NewProdDescription,
                        brand: 'Service-',
                        model_no: 'Service-',
                        price: values.FinalAmount
                    };
                    await dispatch(addProduct(productValues));

                    message.success('Product updated successfully!');
                }

                form.resetFields();
                onClose();
            } else {
                message.error('Failed to create ticket.');
            }
        } catch (error) {
            message.error(`Failed to create ticket: ${error.message}`);
        }
    };

    const filteredProducts = items.filter((product) => product.customerID === selectedCustomer?.id);

    return (
        <Modal
            visible={visible}
            title="Create Ticket"
            onCancel={onClose}
            footer={null}
            width={800} 
            centered // Center the modal vertically
        >
            <div style={{ 
                maxHeight: '500px', 
                overflowY: 'auto',
                padding: '20px',  
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',  
                borderRadius: '8px',  
                backgroundColor: '#fff', 
            }}>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    form={form}
                    className="create-ticket-form"
                >
                    

                    <Form.Item
                        name="customerID"
                        label="Customer"
                        rules={[{ required: true, message: 'Please select a customer' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a customer"
                            optionFilterProp="label"
                            onChange={handleCustomerChange}
                        >
                            {customers && customers.length > 0 ? (
                                customers.map(customer => (
                                    <Option key={customer.id} value={customer.id} label={`${customer.FirstName} ${customer.LastName} ${customer.Email}`}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{`${customer.FirstName} ${customer.LastName}`}</span>
                                            <span style={{ marginLeft: '10px', color: 'gray' }}>{customer.Email}</span>
                                        </div>
                                    </Option>
                                ))
                            ) : (
                                <Option value="">No customers found</Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ProductID"
                        label="Product"
                        rules={[{ required: true, message: 'Please select a product' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a product"
                            optionFilterProp="label"
                            onChange={handleProductChange}
                        >
                            {filteredProducts && filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <Option key={product.id} value={product.id} label={`${product.brand} ${product.model_no}`}>
                                        <div>
                                            <span style={{ marginRight: '10px' }}>Brand: {product.brand}</span>
                                            <span>Model No: {product.model_no}</span>
                                        </div>
                                    </Option>
                                ))
                            ) : (
                                <Option value="">No products found for this customer</Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="title"
                        rules={[{ required: true, message: 'Please enter the ticket title' }]}
                    >
                        <Input placeholder="Enter ticket title" />
                    </Form.Item>

                    {selectedProduct && ( // Only show if a product is selected
                        <>
                            <Form.Item
                                name="Description"
                                label="Product Description"
                                rules={[{ required: true, message: 'Please enter the description' }]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Product description will appear here"
                                    readOnly
                                />
                            </Form.Item>

                            <Form.Item>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px' }}>
                                        Warranty status :
                                    </span>
                                    <span style={{ color: new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date() ? 'green' : 'red' }}>
                                        {new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date()
                                            ? "In Warranty"
                                            : "Out of Warranty"}
                                    </span>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <div>
                                    <span>Warranty End Date : </span>
                                    <span>
                                        {new Date(selectedProduct.warranty_end_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </Form.Item>

                            {isPremiumCustomer && (
                                <div style={{ marginBottom: '10px', color: 'green', fontWeight: 'bold' }}>
                                    This customer is a Premium customer.
                                </div>
                            )}

                            <Form.Item
                                name="isChargeble"
                                label="isChargeble : "
                                rules={[{ required: true, message: 'Please select isChargeble' }]}
                            >
                                {/* <Radio.Group onChange={handleisChargebleChange}> */}
                                <Radio.Group >
                                    <Radio value={true}>Chargeable</Radio>
                                    <Radio value={false}>Non-chargeable</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    )}

                    {isChargeable && (
                        <>
                            <h3>Quotation Details</h3>
                            <Form.Item
                                name="FinalAmount"
                                label="Quotation Amount"
                                rules={[{ required: true, message: 'Please enter quotation amount' }]}
                            >
                                <Input placeholder="Enter quotation amount" />
                            </Form.Item>
                            <Form.Item
                                name="NewProdDescription"
                                label="Quotation Description (new product description)"
                                rules={[{ required: true, message: 'Please enter quotation description' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Enter quotation description" />
                            </Form.Item>
                        </>
                    )}

                    {/* <Form.Item
                        name="Priority"
                        label="Priority"
                        rules={[{ required: true, message: 'Please select priority' }]}
                    >
                        <Select placeholder="Select priority">
                            <Option value="Low">Low</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="High">High</Option>
                        </Select>
                    </Form.Item> */}
                    

                    <Form.Item
                        name="remark"
                        label="remark"
                        rules={[{ required: true, message: 'Add a remark' }]}
                    >
                        <Input.TextArea
                            rows={2}
                            placeholder="Enter a remark" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Ticket
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default CreateTicketModalForm;
