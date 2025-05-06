import { callFetchColor, callFetchOrderHistory } from "@/config/api";
import { IColor, IHistory } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IHistory[];
    isFetchSingle: boolean;
}

export const fetchHistory = createAsyncThunk(
    'history/fetchHistory',
    async ({ query }: { query: string }) => {
        const res = await callFetchOrderHistory(query);
        return res;
    }
)

const initialState: IState = {
    isFetching: true,
    isFetchSingle: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: [],
};
export const updateHistory = (updatedHistories: IHistory[]) => ({
    type: 'history/updateHistory',
    payload: updatedHistories,
});

export const historySlide = createSlice({
    name: 'history',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHistory.pending, (state, action) => {
            state.isFetching = true;
        })

        builder.addCase(fetchHistory.rejected, (state, action) => {
            state.isFetching = false;

        })

        builder.addCase(fetchHistory.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
    },
});

export default historySlide.reducer;