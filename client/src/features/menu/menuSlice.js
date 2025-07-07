import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "menu",
    initialState: {
        content: undefined
    },
    reducers: {
        setContent: (state, action) => {
            state.content = action.payload;
        }
    },
});

export const { setContent } = menuSlice.actions;
export default menuSlice.reducer;