import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import List from '../list/List'

const Profile = () => {
    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()
    return (
        <div>
            <div className=' w-full  pb-5'>

                <div className=' h-28 w-full bg-slate-400 dark:bg-black'></div>

                <div className=' w-full bg-white dark:bg-slate-900  pb-10'>
                    <button onClick={() => navigate('/settings')} className=' absolute right-2 rounded-md text-white px-4 py-1 bg-indigo-500 hover:bg-indigo-600 mt-5'>Edit</button>

                    <img src={user.image} className='w-[150px] h-[150px] rounded-full mx-auto border-8  dark:border-slate-900 border-white relative bottom-20 mb-[-60px]' alt="user img" />

                    <h1 className=' text-2xl dark:text-slate-50 mb-10'>{user.name}</h1>
                    <h1 className=' text-md dark:text-slate-50 mb-10'>{user.bio}</h1>
                    {/* <h1 className=' text-sm dark:text-slate-50 mb-10'>{auth&&auth.currentUser.metadata.creationTime.join('')}</h1> */}

                    <div className=' w-[90%] mx-auto h-[200px] border-t-[.5px] border-slate-600/50 flex flex-row justify-around items-center'>

                        <h1 className='  dark:text-white mx-10 text-xl'>{user.followers.length} followers</h1>
                        <h1 className='  dark:text-white mx-10 text-xl'>{user.following.length} following</h1>


                    </div>
                    <List mode={'myProfile'} />
                </div>


            </div>
        </div>
    )
}

export default Profile;