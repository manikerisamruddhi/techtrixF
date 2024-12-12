import { useState, useEffect } from 'react';
import { notification, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuotation, addQuotaionProduct } from '../../redux/slices/quotationSlice';
import { updateQuotationProduct, deleteQuotationProduct, addProduct } from '../../redux/slices/productSlice';

const useEditQuotation = ({ quotation, products, onClose }) => {
    const dispatch = useDispatch();
    const [productList, setProductList] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [nextProductId, setNextProductId] = useState(1);
    const [productType, setProductType] = useState('Hardware');
    const [newProduct, setNewProduct] = useState({});
    const [quotationProducts, setQuotationProducts] = useState([]);

    useEffect(() => {
        if (quotation) {
            setQuotationProducts(quotation.quotationProducts);
        }
    }, [quotation]);

    useEffect(() => {
        if (products) {
            setProductList(products);
        }
    }, [products]);

    const handleFinish = async (values) => {
        try {
            const updatedQuotationData = {
                ...quotation,
                ...values,
            };
            await dispatch(updateQuotation({ quotationId: quotation.quotationId, data: updatedQuotationData }));
            notification.success({ message: 'Quotation updated successfully!' });

            for (const product of productList) {
                await dispatch(updateQuotationProduct({ quotationId: quotation.quotationId, productId: product.productId, updatedProduct: product }));
            }

            onClose(); // Close the modal
        } catch (error) {
            // console.error('Error updating quotation:', error);
            notification.error({ message: 'Failed to update quotation.' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsAddingProduct(false);
        setNewProduct(product);
        setProductType(product.productType || 'Hardware');
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsAddingProduct(true);
        setNewProduct({});
        setProductType('Hardware');
    };

    const handleProductUpdate = async (productForm, isAddingProduct, productType, setProductList, nextProductId, setNextProductId) => {
        try {
            const values = await productForm.validateFields();
            const productData = { ...values, productType };

            if (values.quantity < 1) {
                notification.error({ message: 'Quantity must be at least 1!' });
                return;
            }

            if (values.price < 1) {
                notification.error({ message: 'Price must be at least 1!' });
                return;
            }

            if (isAddingProduct) {
                const newProductData = { ...productData, productId: nextProductId };
                const newAddedProduct = await dispatch(addProduct(newProductData)).unwrap();
                setProductList(prevProducts => [...prevProducts, newAddedProduct]);
                setNextProductId(prevId => prevId + 1);

                const quotationProductsData = {
                    quotationId: quotation.quotationId,
                    productId: newAddedProduct.productId,
                };
                await dispatch(addQuotaionProduct(quotationProductsData)).unwrap();

                notification.success({ message: 'Product added successfully!' });
            } else {
                setProductList(prevProducts =>
                    prevProducts.map(prod => (prod.productId === editingProduct.productId ? { ...prod, ...productData } : prod))
                );
                notification.success({ message: 'Product updated successfully!' });
            }
        } catch (error) {
            // console.error('Validation failed:', error);
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
                    setProductList(prevProducts => prevProducts.filter(prod => prod.productId !== productId));
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
            const quantity = product.quantity || 1;
            const gstAmount = (product.price * quantity * (product.gst / 100));
            const totalAmount = (product.price * quantity) + gstAmount;
            return total + totalAmount;
        }, 0).toFixed(2);
    };

    return {
        
        setProductList,
        productList,
        editingProduct,
        isAddingProduct,
        productType,
        newProduct,
        quotationProducts,
        nextProductId,
        handleFinish,
        handleEditProduct,
        handleAddProduct,
        handleProductUpdate,
        handleDeleteProduct,
        calculateTotalAmount,
    };
};

export default useEditQuotation;
