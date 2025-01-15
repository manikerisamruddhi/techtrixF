// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { toast } from 'react-toastify';
import productApi from '../../api/productApi';

// Async thunks for handling Product API requests
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await productApi.getAllProducts();
    // console.log(response);
    return response.data;

  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchHardwareProducts = createAsyncThunk('products/HardwareProducts', async (_, {rejectWithValue }) => {
  try {
    const response = await productApi.getAllProductsHardware();
    return response.data;
  }catch (error){
    return rejectWithValue(error.response.data);
  }
});

export const fetchNonCustProducts = createAsyncThunk('products/fetchNonCustProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await productApi.getNonCustomerProducts();
    // console.log(response);
    return response.data;

  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (productId, { rejectWithValue }) => {
  try {
    const response = await productApi.getProductById(productId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct, { dispatch, rejectWithValue }) => {
  try {
    const response = await productApi.createProduct(newProduct);
    toast.success('Product added successfully!');
    dispatch(fetchNonCustProducts()); // Refresh non-customer products
    return response.data;
  } catch (error) {
    toast.error('Failed to add product');
    return rejectWithValue(error.response);
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ productId, updatedProduct }, { rejectWithValue }) => {
  try {
    const response = await productApi.updateProduct(productId, updatedProduct);
    toast.success('Product updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update product');
    return rejectWithValue(error.response.data);
  }
});

export const updateQuotationProduct = createAsyncThunk('products/updateQuotationProduct', async ({ quotationId, productId, updatedProduct }, { dispatch, rejectWithValue }) => {
  try {
    const response = await productApi.updateQuotationProduct(quotationId, productId, updatedProduct);
    toast.success('Product updated successfully!');
    dispatch(fetchProducts()); // Dispatch fetchProducts to refresh the product list
    return response.data;
  } catch (error) {
    toast.error('Failed to update product');
    return rejectWithValue(error.response.data);
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { dispatch, rejectWithValue }) => {
  try {
    await productApi.deleteProduct(productId);
    toast.success('Product deleted successfully!');

    // Dispatch the fetchProducts action to refresh the product list
    dispatch(fetchNonCustProducts());

    return productId; // Return the productId for the fulfilled case
  } catch (error) {
    toast.error('Failed to delete product');
    return rejectWithValue(error.response.data);
  }
});

export const deleteQuotationProduct = createAsyncThunk('products/deleteQuotationProduct', async (quotationProductId, { dispatch, rejectWithValue }) => {
  try {
    await productApi.deleteQuotationProduct(quotationProductId);
    toast.success('Product deleted successfully!');

    // Dispatch the fetchProducts action to refresh the product list
    // dispatch(fetchProducts());

    return quotationId; // Return the productId for the fulfilled case
  } catch (error) {
    toast.error('Failed to delete product');
    return rejectWithValue(error.response.data);
  }
});


// Async thunk for fetching products by customer ID
export const fetchProductsByCustomer = createAsyncThunk(
  'products/fetchByCustomer',
  async (customerId, { getState, dispatch }) => {
    const state = getState();
    if (!state.products.products || state.products.products.length === 0) {
      const response = await productApi.getProductByCustomer(customerId); // Adjust API endpoint as needed
      return response.data;
    }
    return state.products.products;
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    products: [],
    nonCustomerProducts: [], // Add state for non-customer products
    product: null, // Add this for fetched product by ID
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      // Fetch Non cust Products
      .addCase(fetchNonCustProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNonCustProducts.fulfilled, (state, action) => {
        state.nonCustomerProducts = action.payload; // Update non-customer products state
        state.loading = false;
      })
      .addCase(fetchNonCustProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      // Fetch Products by Customer
      .addCase(fetchProductsByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Store fetched products in state
      })
      .addCase(fetchProductsByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle errors
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.product = action.payload; // Update the state of the product
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add product';
      })

      // Fetch Single Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product details';
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.items = state.items.map(item => item.productId === action.payload.productId ? action.payload : item);
        state.products = state.products.map(product => product.productId === action.payload.productId ? action.payload : product);
        state.product = action.payload; // Update the state of the product
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      })
      .addCase(deleteQuotationProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuotationProduct.fulfilled, (state, action) => {
        // Remove the deleted product from the items array
        state.items = state.items.filter(
          (item) => item.id !== action.payload // Use appropriate ID field returned
        );
        state.loading = false;
      })
      .addCase(deleteQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete quotation product';
      })

      // Update Quotation Product
      .addCase(updateQuotationProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotationProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Dispatch fetchProducts to refresh the product list
        // fetchProducts();
      })
      .addCase(updateQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update quotation product';
      });
  },
});

export const selectProducts = (state) => state.products.items; // For all products
export const selectProductsByCustomer = (state) => state.products.products; // For products by customer
export const selectProductsLoading = (state) => state.products.loading;

// Memoized selector for fetching products by their IDs
export const selectProductsByIds = createSelector(
  (state) => state.products.items, // Input selector: get all products from state
  (_, arrayOfProductIds) => arrayOfProductIds, // Input selector: get the array of product IDs (note the underscore)
  (products, arrayOfProductIds) => {
    // Output selector: filter products based on the provided IDs
    return products.filter(product => arrayOfProductIds.includes(product.productId));
  }
);

export default productSlice.reducer;