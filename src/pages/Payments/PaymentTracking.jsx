import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchPayments } from '../../redux/slices/paymentSlice'; payment slice needs to build

const PaymentTracking = () => {
    const dispatch = useDispatch();
    const { payments, loading, error } = useSelector((state) => state.payments);

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    if (loading) return <div>Loading payments...</div>;
    if (error) return <div>Error loading payments</div>;

    return (
        <div className="payment-tracking-container">
            <h1>Payment Tracking</h1>
            <ul>
                {payments.map(payment => (
                    <li key={payment.id}>
                        Invoice #{payment.invoiceNumber} - {payment.paymentstatus}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentTracking;
