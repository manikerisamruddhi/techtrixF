import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Button, Row, Col, message, Select, AutoComplete } from 'antd';
import { addProduct, fetchNonCustProducts, updateProduct } from '../../redux/slices/productSlice'; // Redux action
import { useDispatch, useSelector } from 'react-redux';
import { addQuotaionProduct, getQuotationById } from '../../redux/slices/quotationSlice';

const { Option } = Select;

const ProductFormModal = ({ visible, onCancel, product, customerId, quotation, viaTicketForm, onAddProduct, onUpdatedQuotaion }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [productType, setProductType] = useState('Hardware');
    const [isSerialNoAllowed, setIsSerialNoAllowed] = useState(true);
    const [loading, setLoading] = useState(false);
    const [brandsList, setBrandsList] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [modalList, setModalList] = useState([]);
    const [filteredModals, setFilteredModals] = useState([]);

    // Fetch brands from the state (assuming brands are available in productSlice or other slice)
    const { nonCustomerProducts: products } = useSelector((state) => state.products);

    useEffect(() => {
        if (Array.isArray(products)) {
            // Fetch unique brands
            const brands = Array.from(new Set(products.map(product => product.brand)));
            // console.log(brands);
            setBrandsList(brands);
            setFilteredBrands(brands); // Initially show all brands
// console.log(products);
            // Fetch unique modal numbers (assuming modalNo is available in the product)
            const models = Array.from(new Set(products.map(product => product.modelNo)));
            // console.log(models);
            setModalList(models);
            setFilteredModals(models); // Initially show all models
        }
    }, [products]);


    // Set initial values when the modal is opened
    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                ...product,
                isSerialNoAllowed: product.isSerialNoAllowed !== undefined ? product.isSerialNoAllowed : true,
                quantity: product.quantity || 1,
            });
            setProductType(product.productType || 'Hardware');
            setIsSerialNoAllowed(product.isSerialNoAllowed !== undefined ? product.isSerialNoAllowed : true);
        } else {
            form.resetFields();
            setProductType('Hardware');
            setIsSerialNoAllowed(true);
        }
    }, [product, form]);

    const handleFinish = (values) => {
        setLoading(true);
        const createdDate = new Date().toISOString();
        const productData = {
            ...values,
            createdDate: createdDate,
            productType: productType,
        };

        if (customerId) {
            productData.customerId = customerId;
        }

        if (product) {
            // Update product
            dispatch(updateProduct({ productId: product.productId, updatedProduct: productData }))
                .then((resultAction) => {
                    setLoading(false);
                    if (updateProduct.fulfilled.match(resultAction)) {
                        onCancel();
                        form.resetFields();
                        message.success("Product updated successfully!");
                    } else {
                        message.error('Failed to update product.');
                    }
                });
        } else {
            // Add new product
            dispatch(addProduct(productData))
                .then((resultAction) => {
                    setLoading(false);
                    if (addProduct.fulfilled.match(resultAction)) {
                        const addedProduct = resultAction.payload;
                        onAddProduct(addedProduct);
                        if (quotation) {
                            const quotationProductsData = {
                                quotationId: quotation.quotationId,
                                productId: addedProduct.productId,
                            };

                            dispatch(addQuotaionProduct(quotationProductsData)).unwrap().then(() => {
                                dispatch(getQuotationById(quotation.quotationId)).unwrap().then((response) => {
                                    onUpdatedQuotaion(response);
                                });
                            });
                        }

                        onCancel();
                        dispatch(fetchNonCustProducts());
                        form.resetFields();
                    } else {
                        message.error(resultAction.payload.data || 'Failed to add product.');
                    }
                });
        }
    };

    // Updated handleSearch function
    const handleSearch = (value) => {
        // Filter brands with a check to ensure it's a valid string before calling toLowerCase
        const filtered = brandsList.filter(brand =>
            typeof brand === 'string' && brand.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBrands(filtered);
    };

    const handleSearchModal = (value) => {
        // Filter modal numbers with a check to ensure it's a valid string before calling toLowerCase
        const filtered = modalList.filter(modalNo =>
            typeof modalNo === 'string' && modalNo.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredModals(filtered);
    };



    return (
        <Modal
            title={product ? "Edit Product" : "Create Product"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            centered
        >
            <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
                <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ product, isSerialNoAllowed: true, quantity: 1 }}>
                    {/* Product Type Selection */}
                    <Form.Item label="Product Type">
                        <Radio.Group value={productType} onChange={e => setProductType(e.target.value)}>
                            <Radio value="Hardware">Hardware</Radio>
                            <Radio value="Service">Service</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {productType === 'Hardware' && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="brand" label="Brand :">
                                    <AutoComplete
                                        options={filteredBrands.map(brand => ({ value: brand }))} // Use filteredBrands
                                        onSearch={handleSearch}
                                        placeholder="Type or select brand"
                                    >
                                        <Input />
                                    </AutoComplete>
                                    {/* {filteredBrands.length === 0 && <div>No results found</div>} */}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="modelNo" label="Model No :">
                                    <AutoComplete
                                        options={filteredModals.map(modalNo => ({ value: modalNo }))} // Use filteredModals
                                        onSearch={handleSearchModal}
                                        placeholder="Type or select modal"
                                    >
                                        <Input />
                                    </AutoComplete>
                                    {/* {filteredBrands.length === 0 && <div>No results found</div>} */}
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* Other form items remain the same */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Product description :"
                                rules={[{ required: true, message: 'Please input the description!' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Additional fields depending on product type */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="hsnCode" label="HSN Code :">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="unitOfMeasurement" label="Unit of measurement :">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="gst" label="GST :" rules={[{ required: true, message: 'Please select GST!' }]}>
                                <Select placeholder="Select GST">
                                    <Option value="18">18%</Option>
                                    <Option value="28">28%</Option>
                                    <Option value="0">None</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {product ? "Update Product" : "Add Product"}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
};

export default ProductFormModal;
