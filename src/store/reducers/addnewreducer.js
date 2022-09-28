import { createSlice } from '@reduxjs/toolkit'

const initstate = {addnew:''}

const addlice = createSlice({
    name: "addnew",
    initialState: initstate,
    reducers: {
        show: (state, action) => {

            state.addnew = 'show'

        },
        hide: (state, action) => {

            state.addnew = ''

        }


        
}})


export default addlice.reducer
export const addaction = addlice.actions