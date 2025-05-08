import { callFetchColor, callFetchOrders, callFetchOrdersById } from "@/config/api";
import { IColor, IOrder } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IOrder[];
}

export const fetchOrder = createAsyncThunk(
    'order/fetchColor',
    async () => {
        const res = await callFetchOrders();
        return res;
    }
)
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
export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchOrder.pending, (state, action) => {
            state.isFetching = true;

        })

        builder.addCase(fetchOrder.rejected, (state, action) => {
            state.isFetching = false;

        })

        builder.addCase(fetchOrder.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    },
});

export default orderSlide.reducer;