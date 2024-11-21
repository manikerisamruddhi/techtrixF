import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Table, notification, Row, Col, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuotation } from '../../redux/slices/quotationSlice';
import { updateQuotationProduct, deleteProduct, addProduct } from '../../redux/slices/productSlice';
import { addQuotaionProduct } from '../../redux/slices/quotationSlice';

const { Option } = Select;

const EditQuotationModal = ({ visible, quotation, onClose, products }) => {
    const dispatch = useDispatch();
    const [productForm] = Form.useForm(); // Form for editing product
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Initialize as null
    const [isAddingProduct, setIsAddingProduct] = useState(false); // State to check if adding a new product
    const [nextProductId, setNextProductId] = useState(1); // Initialize a counter for product IDs
    const [productType, setProductType] = useState('Hardware'); // State for product type
    const [newProduct, setNewProduct] = useState({}); // State for new product details

    useEffect(() => {
        if (quotation) {
            form.setFieldsValue({
                customerId: quotation.customerId,
                status: quotation.status,
                delivery: quotation.delivery,
                payment: quotation.payment,
                warrantyOrSupport: quotation.warrantyOrSupport,
                transport: quotation.transport,
                comments: quotation.comments
            });
        }
    }, [quotation, form]);

    useEffect(() => {
        if (products) {
            setProductList(products); // Initialize product list from quotation
        }
    }, [visible]);

    const handleFinish = async (values) => {
        try {
            const updatedQuotationData = {
                ...quotation,
                ...values,
            };

            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));
            notification.success({ message: 'Quotation updated successfully!' });

            // Dispatch the updateProducts action to update the products
            for (const product of productList) {
                await dispatch(updateQuotationProduct({ quotationId: quotation.quotationId, productId: product.productId, updatedProduct: product }));
            }

            setProductList(productList);
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating quotation:', error);
            notification.error({ message: 'Failed to update quotation.' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsAddingProduct(false); // Set to false since we are editing
        setNewProduct(product); // Set the new product state to the editing product
        setProductType(product.productType || 'Hardware'); // Set product type based on editing product
        productForm.setFieldsValue(product); // Set form values for editing
    };

    const handleAddProduct = () => {
        setEditingProduct(null); // Reset editing product
        setIsAddingProduct(true); // Set to true since we are adding
        setNewProduct({}); // Reset the new product state
        setProductType('Hardware'); // Default to Hardware
        productForm.resetFields(); // Reset the form fields for a new product
    };

    const handleProductUpdate = async () => {
        try {
            const values = await productForm.validateFields(); // Validate the product form fields const productData = { ...values, productType }; // Include productType in the values

            // Check if quantity and price are valid
            if (values.quantity < 1) {
                notification.error({ message: 'Quantity must be at least 1!' });
                return;
            }

            if (values.price < 1) {
                notification.error({ message: 'Price must be at least 1!' });
                return;
            }

            if (isAddingProduct) {
                // If adding a new product, generate a new product object
                const newProductData = { ...values, productId: nextProductId }; // Use the next available ID

                // Dispatch the addProduct action to add the new product to the store
                const newAddedProduct = await dispatch(addProduct(newProductData)).unwrap(); // Call the API to add the product

                // Update the productList to include the new product
                setProductList((prevProducts) => {
                    const existingProductIndex = prevProducts.findIndex(prod => prod.productId === newAddedProduct.productId);
                    if (existingProductIndex === -1) {
                        return [...prevProducts, newAddedProduct];
                    } else {
                        return prevProducts.map(prod =>
                            prod.productId === newAddedProduct.productId ? newAddedProduct : prod
                        );
                    }
                });
                setNextProductId(prevId => prevId + 1); // Increment the ID for the next product

                const quotationProductsData = {
                    quotationId: quotation.quotationId,
                    productId: newAddedProduct.productId,
                };

                await dispatch(addQuotaionProduct(quotationProductsData)).unwrap();

                notification.success({ message: 'Product added successfully!' });
            } else {
                // Update the existing product
                setProductList((prevProducts) =>
                    prevProducts.map((prod) =>
                        prod.productId === editingProduct.productId ? { ...prod, ...productData } : prod
                    )
                );
                notification.success({ message: 'Product updated successfully!' });
            }

            // Reset states and form fields
            setEditingProduct(null); // Close the edit product modal
            setIsAddingProduct(false); // Reset adding state
            productForm.resetFields(); // Reset the product form fields
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleDeleteProduct = (productId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await dispatch(deleteProduct(productId)); // Assuming deleteProduct is an action that handles the API call
                    setProductList((prevProducts) => prevProducts.filter(prod => prod.productId !== productId));
                    notification.success({ message: 'Product deleted successfully!' });
                } catch (error) {
                    console.error('Error deleting product:', error);
                    notification.error({ message: 'Failed to delete product.' });
                }
            },
        });
    };

    const calculateTotalAmount = () => {
        return productList.reduce((total, product) => {
            const quantity = product.quantity ? product.quantity : 1;
            const gstAmount = (product.price * quantity * (product.gst / 100));
            const totalAmount = (product.price * quantity) + gstAmount;
            return total + totalAmount;
        }, 0).toFixed(2); // Return as a string with two decimal places
    };

    const productColumns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Model No',
            dataIndex: 'modelNo',
            key: 'modelNo',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'GST (%)',
            dataIndex: 'gst',
            key: 'gst',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, product) => (
                <>
                    <Button type="link" onClick={() => handleEditProduct(product)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteProduct(product.productId)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Modal
            title="Update Quotation"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Row gutter={ 16}>
                    <Col span={12}>
                        <Form.Item label="Delivery" name="delivery">
                            <Input placeholder="Enter delivery details" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Payment" name="payment">
                            <Input placeholder="Enter payment details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Warranty/Support" name="warrantyOrSupport">
                            <Input placeholder="Enter warranty/support details" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Transport" name="transport">
                            <Input placeholder="Enter transport details" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="Comment" name="comments">
                            <Input.TextArea placeholder="Enter comment" rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
                <h3>Products</h3>
                <Button type="primary" onClick={handleAddProduct} style={{ marginBottom: 16 }}>
                    Add New Product
                </Button>
                <Table
                    columns={productColumns}
                    dataSource={productList}
                    rowKey="productId"
                    pagination={false}
                    bordered
                    size="small"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={4} align="right">
                                <strong>Total Amount:</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <strong>{calculateTotalAmount()}</strong>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Quotation
                    </Button>
                </Form.Item>
            </Form>

            {(editingProduct || isAddingProduct) && (
                <Modal
                    title={isAddingProduct ? "Add New Product" : "Edit Product"}
                    visible={!!(editingProduct || isAddingProduct)}
                    onCancel={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(false);
                    }}
                    onOk={handleProductUpdate}
                    width={700}
                >
                    <Form
                        form={productForm}
                        layout="vertical"
                        initialValues={newProduct}
                        onValuesChange={(changedValues) => {
                            setNewProduct((prev) => ({ ...prev, ...changedValues }));
                        }}
                    >
                        {/* Product Type Selection */}
                        <Form.Item label="Product Type">
                            <Radio.Group value={productType} onChange={e => {
                                setProductType(e.target.value);
                                setNewProduct(prev => ({ ...prev, productType: e.target.value })); // Update newProduct with selected productType
                            }}>
                                <Radio value="Hardware">Hardware</Radio>
                                <Radio value="Service">Service</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Brand" name="brand" rules={[{ required: true }]}>
                                        <Input onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Model No" name="modelNo" rules={[{ required: true }]}>
                                        <Input onChange={e => setNewProduct({ ...newProduct, modelNo: e.target.value })} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col span={24}>
                                <Form.Item label="Description" name="description">
                                    <Input.TextArea
                                        rows={3}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="HSN Code" name="hsnCode">
                                        <Input
                                            onChange={e => setNewProduct({ ...newProduct, hsnCode: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Unit of Measurement" name="unitOfMeasurement">
                                        <Input
                                            onChange={e => setNewProduct({ ...newProduct, unitOfMeasurement: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Part Code" name="partCode">
                                        <Input
                                            onChange={e => setNewProduct({ ...newProduct, partCode: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                                    <Input
                                        type="number"
                                        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="GST" name="gst" rules={[{ required: true, message: 'Please select GST!' }]}>
                                    <Select
                                        placeholder="Select GST"
                                        onChange={value => setNewProduct({ ...newProduct, gst: value })}
                                    >
                                        <Option value="18">18%</Option>
                                        <Option value="28">28%</Option>
                                        <Option value="0">None</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
                                    <Input
                                        type="number"
                                        onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Is Serial No Allowed" name="isSerialNoAllowed">
                                        <Radio.Group
                                            onChange={e => setNewProduct({ ...newProduct, isSerialNoAllowed: e.target.value })}
                                            style={{ display: 'inline-block' }}
                                        >
                                            <Radio value={true}>Yes</Radio>
                                            <Radio value={false}>No</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Warranty Months" name="warrantyMonths" rules={[{ required: true }]}>
                                        <Input
                                            type="number"
                                            onChange={e => setNewProduct({ ...newProduct, warrantyMonths: parseInt(e.target.value) })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Form>
                </Modal>
            )}
        </Modal>
    );
};

export default EditQuotationModal;