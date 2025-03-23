import { callFetchSize, callFetchSizeById } from "@/config/api";
import { ISize } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: ISize[];
    isFetchSingle: boolean;
    singleSize: ISize
}

export const fetchSize = createAsyncThunk(
    'size/fetchSize',
    async ({ query }: { query: string }) => {
        const res = await callFetchSize(query);
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
    singleSize: {
        id: "",
        name: "",
        description: "",
    }
};
export const sizeSlide = createSlice({
    name: 'size',
    initialState,
    reducers: {
        resetSingleSize: (state, action) => {
            state.singleSize = {
                id: "",
                name: "",
                description: "",
            }
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchSize.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchSize.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchSize.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
    },
});
export const {
    resetSingleSize
} = sizeSlide.actions;

export default sizeSlide.reducer;