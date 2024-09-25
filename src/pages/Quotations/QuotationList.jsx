import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations, deleteQuotation } from '../../redux/slices/quotationSlice';
import { Link } from 'react-router-dom';

const QuotationList = () => {
    const dispatch = useDispatch();
    const { quotations = [], loading, error } = useSelector((state) => state.quotations); // Default to empty array

    useEffect(() => {
        dispatch(fetchQuotations());
    }, [dispatch]);

    const handleDelete = (quotationId) => {
        dispatch(deleteQuotation(quotationId));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading quotations</div>;

    return (
        <div className="quotation-list-container">
            <h1>Quotation List</h1>
            <Link to="/create-quotation" className="create-quotation-btn">Create Quotation</Link>
            <ul>
                {Array.isArray(quotations) && quotations.length > 0 ? (
                    quotations.map(quotation => (
                        <li key={quotation.id}>
                            <Link to={`/quotation/${quotation.id}`}>
                                Quotation #{quotation.id} - {quotation.status}
                            </Link>
                            <button onClick={() => handleDelete(quotation.id)}>Delete</button>
                            <Link to={`/edit-quotation/${quotation.id}`}>Edit</Link>
                        </li>
                    ))
                ) : (
                    <li>No quotations available.</li> // Handle empty quotations
                )}
            </ul>
        </div>
    );
};

export default QuotationList;
