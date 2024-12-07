import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Table, notification, Row, Col, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuotation } from '../../redux/slices/quotationSlice';
import { updateQuotationProduct, deleteQuotationProduct } from '../../redux/slices/productSlice';
import ProductFormModal from '../Product/AddProduct';
import { addQuotaionProduct } from '../../redux/slices/quotationSlice';

const { Option } = Select;

const EditQuotationModal = ({ visible, quotation, onClose, products, customer }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [tempProduct, setTempProduct] = useState({}); // State for the product being edited
    const [addProductVisible, setAddProductVisible] = useState(false); // State for ProductFormModal visibility

    const [quotationProducts, setQuotationProducts] = useState();

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
            setProductList(products);
            setQuotationProducts(quotation.quotationProducts);
        }
    }, [quotation, form]);

    const handleFinish = async (values) => {
        try {
            const updatedQuotationData = {
                ...quotation,
                ...values,
            };

            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));
            notification.success({ message: 'Quotation updated successfully!' });

            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating quotation:', error);
            notification.error({ message: 'Failed to update quotation.' });
        }
    };

    const handleSaveProduct = async (product) => {
        try {
            // Validate the product data
            if (product.quantity < 1) {
                notification.error({ message: 'Quantity must be at least 1!' });
                return;
            }

            if (product.price < 1) {
                notification.error({ message: 'Price must be at least 1!' });
                return;
            }

            // Update the product in the list
            setProductList(prevProducts =>
                prevProducts.map(prod =>
                    prod.productId === product.productId ? { ...product } : prod
                )
            );

            // Dispatch the update action
            await dispatch(updateQuotationProduct({ quotationId: quotation.quotationId, productId: product.productId, updatedProduct: product }));
            notification.success({ message: 'Product updated successfully!' });
        } catch (error) {
            console.error('Error updating product:', error);
            notification.error({ message: 'Failed to update product.' });
        }
    };

    const handleDeleteProduct = (productId) => {
        const foundProduct = quotationProducts.find(item => item.productId === productId);
        const quotationProductId = foundProduct.quotationProductId;

        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await dispatch(deleteQuotationProduct(quotationProductId));
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
        }, 0).toFixed(2);
    };

    const productColumns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (text, record) => (
                <Input
                    value={record.brand}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, brand: e.target.value } : prod))}
                />
            ),
        },
        {
            title: 'Model No',
            dataIndex: 'modelNo',
            key: 'modelNo',
            render: (text, record) => (
                <Input
                    value={record.modelNo}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, modelNo: e.target.value } : prod))}
                />
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80, // Adjust the width
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.quantity}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, quantity: parseInt(e.target.value) } : prod))}
                />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 80, // Adjust the widht
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.price}
                    onChange={(e) => setProductList(prevProducts => prevProducts.map(prod => prod.productId === record.productId ? { ...prod, price: parseFloat(e.target.value) } : prod))}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, product) => (
                <>
                    <Button type="link" onClick={() => handleSaveProduct(product)}>
                        Save
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteProduct(product.productId)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const handleAddProduct = () => {
        setAddProductVisible(true);
    };

    return (
        <Modal
            title="Update Quotation"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={900}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Row gutter={16}>
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
                <Button
                    type="primary"
                    style={{ backgroundColor: '#08ba00', borderColor: 'blue', marginTop: '20px' }}
                    onClick={handleAddProduct} // Ensure you have this function defined
                >
                    Add New Product
                </Button>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                        Update Quotation
                    </Button>
                </Form.Item>
            </Form>
            <ProductFormModal
                visible={addProductVisible}
                onCancel={() => setAddProductVisible(false)}
                product={null} // No pre-filled product for new product
                customerId={customer ? customer.customerId : null}
                onAddProduct={(product) => {
                    setProductList((prevProducts) => [...prevProducts, product]);
                    setAddProductVisible(false);
                }}
                quotation={quotation}
            />
        </Modal>
    );
};

export default EditQuotationModal;
