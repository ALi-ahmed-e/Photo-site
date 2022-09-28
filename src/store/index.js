import {configureStore} from '@reduxjs/toolkit'
import addnewreducer from './reducers/addnewreducer'
import authreducer from './reducers/authreducer'



const store = configureStore({reducer:{auth:authreducer,addnew:addnewreducer}})

export default store






