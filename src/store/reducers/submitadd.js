import { createSlice } from '@reduxjs/toolkit'

const initstate = {subadd:''}

const subaddlice = createSlice({
    name: "subadd",
    initialState: initstate,
    reducers: {
        subadd: (state, action) => {

            state.subadd = action.payload

        }


        
}})


export default subaddlice.reducer
export const subaddaction = subaddlice.actions