import { callFetchDiscount } from "@/config/api";
import { IDiscount } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IDiscount[];
    discountCode: string;
}

export const fetchDiscount = createAsyncThunk(
    'discount/fetchDiscount',
    async ({ query }: { query: string }) => {
        const res = await callFetchDiscount(query);
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
    discountCode: '',
};

export const discountSlide = createSlice({
    name: 'discount',
    initialState,
    reducers: {
        setDiscountCode: (state, action) => {
            state.discountCode = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDiscount.pending, (state) => {
            state.isFetching = true;
        });

        builder.addCase(fetchDiscount.rejected, (state) => {
            state.isFetching = false;
        });

        builder.addCase(fetchDiscount.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });
    },
});

export const { setDiscountCode } = discountSlide.actions;
export default discountSlide.reducer;
