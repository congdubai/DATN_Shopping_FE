import { callFetchColor } from "@/config/api";
import { IColor } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IColor[];
    isFetchSingle: boolean;
    singleColor: IColor
}

export const fetchColor = createAsyncThunk(
    'color/fetchColor',
    async ({ query }: { query: string }) => {
        const res = await callFetchColor(query);
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
    singleColor: {
        id: "",
        name: "",
        description: "",
    }
};
export const colorSlide = createSlice({
    name: 'color',
    initialState,
    reducers: {
        resetSingleColor: (state, action) => {
            state.singleColor = {
                id: "",
                name: "",
                description: "",
            }
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchColor.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchColor.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchColor.fulfilled, (state, action) => {
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
    resetSingleColor
} = colorSlide.actions;

export default colorSlide.reducer;