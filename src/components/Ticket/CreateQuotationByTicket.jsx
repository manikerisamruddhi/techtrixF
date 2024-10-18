import React, { useState } from 'react';
import { Modal, Button, Form, Input, Table, Space, notification } from 'antd';
import { addQuotation } from '../../redux/slices/quotationSlice';
import { addProduct } from '../../redux/slices/productSlice';
import { useDispatch } from 'react-redux';

const CreateQuotationModal = ({ ticketId, visible, onCancel }) => {
  const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [productForm] = Form.useForm(); // Separate form for product inputs
    const [products, setProducts] = useState([]); // Initial state for products
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(true);

    const handleCancel = () => {
        form.resetFields(); // Reset form fields when modal is closed
        setProducts([]); // Reset products
        onCancel(); // Call the onCancel prop
        setShowForm(false); // Hide product form
    };

    const handleOk = () => {
      form.validateFields()
          .then(() => {
            
              // Dispatch the action to add the quotation to the database
              dispatch(addQuotation({ ticketId, products }))
                  .then(() => {
                      // Dispatch the action to add each product to the product table with default data
                      const defaultData = {
                          brand: 'Default Brand',
                          modelNo: 'Default Model No',
                      };
                      const productsWithDefaultData = products.map((product) => ({ ...product, ...defaultData }));
                      Promise.all(productsWithDefaultData.map((product) => dispatch(addProduct(product))))
                          .then(() => {
                              notification.success({
                                  message: 'Quotation Created',
                                  description: 'Your quotation has been successfully created.'
                              });
                              handleCancel();
                          })
                          .catch((error) => {
                              console.error('Error adding products:', error);
                              notification.error({
                                  message: 'Error Adding Products',
                                  description: 'An error occurred while adding the products.'
                              });
                          });
                  })
                  .catch((error) => {
                      console.error('Error creating quotation:', error);
                      notification.error({
                          message: 'Error Creating Quotation',
                          description: 'An error occurred while creating the quotation.'
                      });
                  });
          })
          .catch((info) => {
              console.log('Validation Failed:', info);
          });
  };
 

    const addProductf = () => {
        setEditingProduct(null);
        setShowForm(true);
        productForm.resetFields(); // Reset the product form when adding a new product
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
        productForm.setFieldsValue(product); // Populate the form with existing product data
    };

    const saveProduct = () => {
        productForm.validateFields()
            .then((values) => {
                if (editingProduct) {
                    // Editing product scenario
                    const newProducts = products.map((product) =>
                        product === editingProduct ? values : product
                    );
                    setProducts(newProducts);
                    notification.success({
                        message: 'Service Updated',
                        description: 'The Service has been updated successfully.'
                    });
                } else {
                    // Adding new product scenario
                    setProducts([...products, { ...values, key: Date.now() }]);
                    notification.success({
                        message: 'Product Service',
                        description: 'The service has been added successfully.'
                    });
                }
                setEditingProduct(null);
                setShowForm(false); // Hide the form after saving
                productForm.resetFields(); // Reset product form after saving
            })
            .catch((info) => {
                console.log('Validation Failed:', info);
            });
    };

    const removeProduct = (product) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this service?',
            onOk: () => {
                const newProducts = products.filter((p) => p !== product);
                setProducts(newProducts);
                notification.success({
                    message: 'Service Deleted',
                    description: 'The service has been deleted successfully.'
                });
            },
        });
    };

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `₹${price}`, // Adding price formatting
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => editProduct(record)}>Edit</Button>
                    <Button type="danger" style={{color:'red'}} onClick={() => removeProduct(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    // Calculate total price
    const totalPrice = products.reduce((total, product) => total + parseFloat(product.price || 0), 0);

    return (
        <Modal
            title="Create Quotation"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            width={800}
            footer={null} // Disable default modal footer
        >
            <Form form={form} layout="vertical" name="quotationForm">
                {products.length > 0 && (
                    <>
                        <Table
                            columns={columns}
                            dataSource={products}
                            pagination={false}
                            rowKey="key"
                        />
                        <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                            Total: ₹{totalPrice}
                        </div>
                    </>
                )}

                {/* Conditionally render the form */}
                {(products.length === 0 || showForm) && (
                    <Form
                        form={productForm}
                        layout="vertical"
                        name="product Form"
                        style={{ marginTop: 16 }}
                    >
                        <Form.Item
                            name="description"
                            label="Service Description"
                            rules={[{ required: true, message: 'Please enter the product description' }]}
                        >
                            <Input placeholder="Enter product description" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                { required: true, message: 'Please enter the price' },
                                // { type: 'number', min: 0, message: 'Price must be a positive number' },
                            ]}
                        >
                            <Input type="number" placeholder="Enter price" />
                        </Form.Item>
                        <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => { setShowForm(false); productForm.resetFields(); }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={saveProduct}>
                                Save
                            </Button>
                        </Space>
                    </Form>
                )}

                {/* Conditionally render the "Add Service" button */}
                {!showForm && (
                    <Button type="dashed" onClick={addProductf} style={{ width: '100%', marginTop: 16 }}>
                        Add Service
                    </Button>
                )}

<Form.Item
                            name="Comments"
                            label="Comment"
                            rules={[{ required: true, message: 'Please enter the product comment' }]}
                        >
                            <Input.TextArea
                            rows={2}
                            placeholder="Enter Comment" />
                        </Form.Item>

                {/* Conditionally render OK/Cancel buttons based on showForm */}
                {!showForm && products.length > 0 && (
                    <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={handleOk}>
                            Submit Quotation
                        </Button>
                    </Space>
                )} 
               
            </Form>
        </Modal>
    );
};

export default CreateQuotationModal;