import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, notification, Checkbox } from 'antd';
import axios from 'axios';
// import './QuotationFormModal.css'; // Assuming you have a CSS file for styling

const { Option } = Select;

const QuotationFormModal = ({ visible, onClose, ticketId, onSubmit }) => {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountType, setDiscountType] = useState('fixed');
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    
    // State for new product fields
    const [newProduct, setNewProduct] = useState({
        brand: '',
        model_no: '',
        description: '',
        hsn_code: '',
        is_negotiable: false,
        part_code: '',
        price: 0,
        quantity: 1,
        warranty_months: 0,
        warranty_start_date: '',
    });

    // State to show/hide new product form
    const [showNewProductForm, setShowNewProductForm] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (visible) {
            fetchProducts();
        }
    }, [visible]);

    useEffect(() => {
        form.setFieldsValue({ TotalAmount: totalAmount });
    }, [totalAmount, form]);

    const handleProductSelection = (values) => {
        setSelectedProducts(values);
        const calculatedTotalAmount = values.reduce((acc, productId) => {
            const product = products.find(p => p.id === productId);
            return acc + (product ? product.price : 0);
        }, 0);
        setTotalAmount(calculatedTotalAmount);
        //console.log('Total Amount:', calculatedTotalAmount);
    };

    useEffect(() => {
        const calculatedFinalAmount = discountType === 'percentage'
            ? totalAmount - (totalAmount * (discount / 100))
            : totalAmount - discount;
        
        const finalAmountValue = calculatedFinalAmount < 0 ? 0 : calculatedFinalAmount;
        setFinalAmount(finalAmountValue);
    
        // Update the form field value for FinalAmount
        form.setFieldsValue({ FinalAmount: finalAmountValue });
    }, [totalAmount, discount, discountType, form]);

    const handleFinish = async (values) => {
        const quotationData = {
            ...values,
            TicketID: ticketId,
            QuotationDate: new Date().toISOString(),
            TotalAmount: totalAmount,
            Discount: discount,
            FinalAmount: finalAmount,
        };

        // Save quotation to the database
        await onSubmit(quotationData);
        form.resetFields();
        setSelectedProducts([]);
        setTotalAmount(0);
        setDiscount(0);
        setFinalAmount(0);
        // notification.success({ message: 'Quotation submitted successfully!' });
    };

    const handleAddProduct = async () => {
        if (!newProduct.brand || !newProduct.model_no || newProduct.price <= 0 || newProduct.quantity <= 0) {
            notification.error({ message: 'Please fill in all product fields correctly!' });
            return;
        }

        try {
            // Save the new product to the database
            await axios.post('http://localhost:4000/products', newProduct);
            // Fetch the updated list of products
            const response = await axios.get('http://localhost:4000/products');
            setProducts(response.data);
            notification.success({ message: 'Product added successfully!' });
            // Reset new product fields and hide the form
            setNewProduct({
                brand: '',
                model_no: '',
                description: '',
                hsn_code: '',
                is_negotiable: false,
                part_code: '',
                price: 0,
                quantity: 1,
                warranty_months: 0,
                warranty_start_date: '',
            });
            setShowNewProductForm(false); // Hide the product form after adding
        } catch (error) {
            console.error('Error adding product:', error);
            notification.error({ message: 'Failed to add product!' });
        }
    };

    return (
        <Modal
            title="Create Quotation"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800} // Set a custom width for the modal
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    name="Product"
                    label="Products available in product list"
                >
                    <Select
                        mode="multiple"
                        placeholder="Select products"
                        onChange={handleProductSelection}
                    >
                        {products.map(product => (
                            <Option key={product.id} value={product.id}>
                                {product.brand} : {product.model_no} = ₹{product.price}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Button
                    type="primary"
                    onClick={() => setShowNewProductForm(!showNewProductForm)}
                    style={{ marginBottom: '10px' }}
                >
                    {showNewProductForm ? 'close product form' : 'Add New Product'}
                </Button>

                {/* Show product form when the button is clicked */}
                {showNewProductForm && (
                    <div className="product-form-border"> {/* Apply border styling */}
                        <Form.Item label="Brand">
                            <Input
                                placeholder="Brand"
                                value={newProduct.brand}
                                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Model No">
                            <Input
                                value={newProduct.model_no}
                                onChange={(e) => setNewProduct({ ...newProduct, model_no: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="HSN Code">
                            <Input
                                value={newProduct.hsn_code}
                                onChange={(e) => setNewProduct({ ...newProduct, hsn_code: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Is Negotiable">
                            <Checkbox
                                checked={newProduct.is_negotiable}
                                onChange={(e) => setNewProduct({ ...newProduct, is_negotiable: e.target.checked })}
                            >
                                Is Negotiable
                            </Checkbox>
                        </Form.Item>
                        <Form.Item label="Part Code">
                            <Input
                                value={newProduct.part_code}
                                onChange={(e) => setNewProduct({ ...newProduct, part_code: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Price">
                            <Input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            />
                        </Form.Item>
                        <Form.Item label="Quantity">
                            <Input
                                type="number"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                            />
                        </Form.Item>
                        <Form.Item label="Warranty Months">
                            <Input
                                type="number"
                                value={newProduct.warranty_months}
                                onChange={(e) => setNewProduct({ ...newProduct, warranty_months: Number(e.target.value) })}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                onClick={handleAddProduct}
                            >
                                Add Product
                            </Button>
                        </Form.Item>
                    </div>
                )}

                <Form.Item
                    name="TotalAmount"
                    label="Total Amount"
                >
                    <Input type="number" value={totalAmount} disabled />
                </Form.Item>

                <Form.Item
                    name="DiscountType"
                    label="Discount Type"
                    rules={[{ required: true, message: 'Please select a discount type' }]}
                >
                    <Select defaultValue="fixed" onChange={setDiscountType}>
                        <Option value="fixed">Fixed Amount</Option>
                        <Option value="percentage">Percentage</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="Discount"
                    label="Discount"
                    rules={[{ required: true, message: 'Please enter the discount' }]}
                >
                    <Input
                        type="number"
                        placeholder="Enter discount"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </Form.Item>

                <Form.Item
                    name="FinalAmount"
                    label="Final Amount"
                >
                    <Input type="number" value={finalAmount} disabled />
                </Form.Item>

                <Form.Item
                    name="Comments"
                    label="Comments"
                >
                    <Input.TextArea placeholder="Add any comments here" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Quotation
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuotationFormModal;
