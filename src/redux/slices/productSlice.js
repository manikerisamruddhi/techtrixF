import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance'; // Ensure this is configured to point to your JSON server
import { toast } from 'react-toastify';

// Async Thunks for handling API requests
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:4000/products'); // Updated URL for fetching products
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:4000/products', newProduct); // Updated URL for adding product
    toast.success('Product added successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to add product');
    return rejectWithValue(error.response.data);
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ productId, updatedProduct }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`http://localhost:4000/products/${productId}`, updatedProduct); // Updated URL for updating product
    toast.success('Product updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update product');
    return rejectWithValue(error.response.data);
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:4000/products/${productId}`); // Updated URL for deleting product
    toast.success('Product deleted successfully!');
    return productId;
  } catch (error) {
    toast.error('Failed to delete product');
    return rejectWithValue(error.response.data);
  }
});

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
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

export default productSlice.reducer;
