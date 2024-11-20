import { useMemo } from 'react';

const useProductCounts = (products) => {

    return useMemo(() => {
        // console.log(products);
        // Ensure quotations is an array
        if (!Array.isArray(products) || products.length === 0) {
            return { totalProduct: 0};
        }

        let totalProduct = products.length;
        // let logistics = products.filter(product => product.role === 'Logistics').length;
        // let serviceTechnical = products.filter(product => product.role === 'Sales').length;
        // let sales = products.filter(product => product.role === 'Service_Technical').length;

        return { totalProduct };
    }, [products]);
};

export default useProductCounts;