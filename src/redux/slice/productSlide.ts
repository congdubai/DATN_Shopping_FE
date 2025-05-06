import { callFetchProduct, callFetchProductsByCategory, callFetchProductsByGender } from "@/config/api";
import { IProduct } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    }
    result: IProduct[];
}

export const fetchProduct = createAsyncThunk(
    'product/fetchProduct',
    async ({ query }: { query: string }) => {
        const res = await callFetchProduct(query);
        return res;
    }
)

export const fetchProductByCategory = createAsyncThunk(
    'product/fetchProductByCategory',
    async ({ categoryId, query }: { categoryId: string; query: string }) => {
        const res = await callFetchProductsByCategory(categoryId, query);
        return res;
    }
)
export const fetchProductByGender = createAsyncThunk(
    'product/fetchProductByGender',
    async ({ gender, query }: { gender: string; query: string }) => {
        const res = await callFetchProductsByGender(gender, query);
        return res;
    }
);

const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: [],
};

export const productSlide = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProduct.pending, (state) => {
            state.isFetching = true;
        })

        builder.addCase(fetchProduct.rejected, (state) => {
            state.isFetching = false;
        })

        builder.addCase(fetchProduct.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })

        builder.addCase(fetchProductByCategory.pending, (state) => {
            state.isFetching = true;
        })

        builder.addCase(fetchProductByCategory.rejected, (state) => {
            state.isFetching = false;
        })

        builder.addCase(fetchProductByCategory.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
        builder.addCase(fetchProductByGender.pending, (state) => {
            state.isFetching = true;
        });

        builder.addCase(fetchProductByGender.rejected, (state) => {
            state.isFetching = false;
        });

        builder.addCase(fetchProductByGender.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

    },
});

export default productSlide.reducer;
