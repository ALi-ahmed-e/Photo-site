import { createSlice } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, Gitprovider, provider } from '../../firebase';


const initstate = { user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '' }

const authlice = createSlice({
    name: "auth",
    initialState: initstate,
    reducers: {
        signin: (state, action) => {

            state.user = JSON.parse(action.payload.user)

        },
        logout: (state, action) => {
            state.user = ''
        }
    }
})


export default authlice.reducer
export const authaction = authlice.actions