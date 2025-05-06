import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchReview } from "@/config/api";
import { IReview } from "@/types/backend";

interface IReviewState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IReview[];
}

export const fetchReviewByProductId = createAsyncThunk(
    "review/fetchReviewByProductId",
    async ({ id, query }: { id: string; query: string }) => {
        const res = await callFetchReview(id, query);
        return res;
    }
);

const initialState: IReviewState = {
    isFetching: false,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    },
    result: [],
};

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewByProductId.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchReviewByProductId.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.isFetching = false;
                    state.meta = action.payload.data.meta;
                    state.result = action.payload.data.result;
                }
            })
            .addCase(fetchReviewByProductId.rejected, (state) => {
                state.isFetching = false;
            });
    },
});

export default reviewSlice.reducer;
