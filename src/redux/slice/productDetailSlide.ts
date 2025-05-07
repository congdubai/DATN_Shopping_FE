import { callFetchProductDetail, callFetchProductDetailById, callFetchProductDetailByProductId } from "@/config/api";
import { IProductDetail } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IProductDetail[];

}

export const fetchProductDetail = createAsyncThunk(
    'productDetail/fetchProductDetail',
    async ({ query }: { query: string }) => {
        const res = await callFetchProductDetail(query);
        return res;
    }
)
export const fetchProductDetailByProductId = createAsyncThunk(
    'productDetail/fetchProductDetailByProductId',
    async ({ productId }: { productId: string }) => {
        const res = await callFetchProductDetailByProductId(productId);
        return res;
    }
);
export const fetchProductDetailById = createAsyncThunk(
    'productDetail/fetchProductDetailById',
    async (Id: string) => {
        const res = await callFetchProductDetailById(Id);
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
export const productDetailSlide = createSlice({
    name: 'productDetail',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchProductDetail.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchProductDetail.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchProductDetail.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
        builder.addCase(fetchProductDetailByProductId.pending, (state) => {
            state.isFetching = true;
        });

        builder.addCase(fetchProductDetailByProductId.fulfilled, (state, action) => {
            state.isFetching = false;
            if (action.payload && Array.isArray(action.payload.data)) {
                state.result = action.payload.data;
            } else if (action.payload && action.payload.data) {
                state.result = [action.payload.data];
            }
        });


        builder.addCase(fetchProductDetailById.rejected, (state) => {
            state.isFetching = false;
        });

        builder.addCase(fetchProductDetailById.pending, (state) => {
            state.isFetching = true;
        });

        builder.addCase(fetchProductDetailById.fulfilled, (state, action) => {
            state.isFetching = false;
            if (action.payload && Array.isArray(action.payload.data)) {
                state.result = action.payload.data;
            } else if (action.payload && action.payload.data) {
                state.result = [action.payload.data];
            }
        });


        builder.addCase(fetchProductDetailByProductId.rejected, (state) => {
            state.isFetching = false;
        });
    },
});

export default productDetailSlide.reducer;