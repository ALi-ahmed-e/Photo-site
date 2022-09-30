import {configureStore} from '@reduxjs/toolkit'
import addnewreducer from './reducers/addnewreducer'
import authreducer from './reducers/authreducer'
import submitadd from './reducers/submitadd'


const store = configureStore({reducer:{auth:authreducer,addnew:addnewreducer,subadd:submitadd}})

export default store






