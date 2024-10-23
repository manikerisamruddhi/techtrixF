// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import productApi from '../../api/productApi';
import axios from 'axios';


// Async thunks for handling Product API requests
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:8080/api/products/all');
    console.log(response);
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

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct, { rejectWithValue }) => {
  try {
    const response = await productApi.createProduct(newProduct);
    toast.success('Product added successfully!');
    //console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error('Failed to add product');
    return rejectWithValue(error.response.data);
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

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    await productApi.deleteProduct(productId);
    toast.success('Product deleted successfully!');
    return productId;
  } catch (error) {
    toast.error('Failed to delete product');
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching products by customer ID
export const fetchProductsByCustomer = createAsyncThunk(
  'products/fetchByCustomer',
  async (customerID) => {
    //console.log(`${customerID}`);
    const response = await productApi.getProductByCustomer(customerID); // Adjust API endpoint as needed
    return response.data;
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    products: [],
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
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
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
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
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
      });
  },
});

export const selectProducts = (state) => state.products.items; // For all products
export const selectProductsByCustomer = (state) => state.products.products; // For products by customer
export const selectProductsLoading = (state) => state.products.loading;

export default productSlice.reducer;
