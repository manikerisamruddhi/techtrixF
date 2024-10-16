// hooks/useQuotationForm.js
import { useEffect, useState } from 'react';
import { notification, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations, addQuotation, resetError } from '../redux/slices/quotationSlice';
import { fetchCustomers } from '../redux/slices/customerSlice';

const useQuotationForm = (visible, ticketId) => {
    const dispatch = useDispatch();
    const { error, customers } = useSelector(state => ({
        error: state.quotations.error,
        customers: state.customers.customers,
    }));

    const [newProduct, setNewProduct] = useState({
        brand: '',
        modelNo: '',
        price: 0,
        quantity: 1,
        description: '',
        hasSerialNumber: 'no',
    });
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [addedProducts, setAddedProducts] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [customerType, setCustomerType] = useState('new');
    const [existingCustomer, setExistingCustomer] = useState(undefined);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
    const [finalAmount, setFinalAmount] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (visible) {
            dispatch(fetchQuotations());
            dispatch(fetchCustomers());
        }
    }, [dispatch, visible]);

    useEffect(() => {
        if (error) {
            notification.error({ message: error });
            dispatch(resetError());
        }
    }, [error, dispatch]);

    const handleAddOrEditProduct = () => {
        if (!newProduct.brand || !newProduct.modelNo || newProduct.price <= 0 || newProduct.quantity <= 0) {
            notification.error({ message: 'Please fill in all product fields correctly!' });
            return;
        }

        if (editIndex !== null) {
            const updatedProducts = addedProducts.map((product, index) =>
                index === editIndex ? { ...newProduct, key: product.key } : product
            );
            setAddedProducts(updatedProducts);
            notification.success({ message: 'Product updated successfully!' });
            setEditIndex(null);
        } else {
            const productWithKey = { ...newProduct, key: Date.now() };
            setAddedProducts(prev => [...prev, productWithKey]);
            notification.success({ message: 'Product added successfully!' });
        }

        setNewProduct({ brand: '', modelNo: '', price: 0, quantity: 1, description: '', hasSerialNumber: 'no' });
        setShowNewProductForm(false);
    };

    const handleEditProduct = (index) => {
        setNewProduct(addedProducts[index]);
        setEditIndex(index);
        setShowNewProductForm(true);
    };

    const handleDeleteProduct = (index) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: () => {
                const updatedProducts = addedProducts.filter((_, i) => i !== index);
                setAddedProducts(updatedProducts);
                notification.success({ message: 'Product deleted successfully!' });
            },
        });
    };

    const handleFinish = async () => {
        const quotationData = {
            ticketId,
            customer: customerType === 'existing' ? existingCustomer : newCustomer,
            products: addedProducts,
            totalAmount: addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0),
            finalAmount,
            comment,
        };

        await dispatch(addQuotation(quotationData));
        notification.success({ message: 'Quotation added successfully!' });
        resetForm();
    };

    const resetForm = () => {
        setAddedProducts([]);
        setCustomerType('new');
        setNewCustomer({ name: '', email: '', phone: '' });
        setFinalAmount(0);
        setComment('');
    };

    const calculateTotalAmount = () => {
        return addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0);
    };

    const handleExistingCustomerChange = value => {
        setExistingCustomer(customers.find(cust => cust.id === value));
    };

    return {
        newProduct,
        setNewProduct,
        showNewProductForm,
        setShowNewProductForm,
        addedProducts,
        handleAddOrEditProduct,
        handleEditProduct,
        handleDeleteProduct,
        handleFinish,
        resetForm,
        customerType,
        setCustomerType,
        existingCustomer,
        handleExistingCustomerChange,
        newCustomer,
        setNewCustomer,
        finalAmount,
        setFinalAmount,
        comment,
        setComment,
        calculateTotalAmount,
        customers,
    };
};

export default useQuotationForm;
