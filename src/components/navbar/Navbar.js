import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { NavLink, useNavigate } from 'react-router-dom'
import Addpost from '../Addnew/Addpost'
import { addaction } from '../../store/reducers/addnewreducer'
const Navbar = ({ updatethestate }) => {
    const user = useSelector(state => state.auth.user)
    const addnew = useSelector(state => state.addnew.addnew)
    const dispatch = useDispatch()
    const [addpost, setaddpost] = useState();
    const navigate = useNavigate()
    const { show } = addaction


    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ')
    }


    const signout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('user')
            localStorage.removeItem('Credential')
            localStorage.removeItem('theme')
            
            window.location.reload()
        }).catch((error) => {
            console.log(error)
        });
    }

    const updates = (v)=>{
        updatethestate('update')
    }

    useEffect(() => {
        if (addnew == 'show') {
            setaddpost(<Addpost updates={updates} />)
            document.body.style.overflow = 'hidden'
        } else {
            setaddpost('')
            document.body.style.overflow = 'auto'
        }

    }, [addnew]);


    return (
        <>
            <header className=' h-12 w-full bg-white shadow-md dark:bg-slate-800 dark:shadow-black flex items-center justify-between' style={{ 'direction': 'rtl' }}>
                <div className=' w-32 h-full  flex items-center justify-center'>

                    <Menu as="div" className="relative inline-block text-left w-fit h-fit">
                        <div>
                            <Menu.Button className='flex items-center '>
                                <img src={user.image} alt=""
                                    className=' w-10 h-10 rounded-full mx-2 '

                                />


                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md dark:divide-black dark:bg-slate-800 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <p

                                                onClick={() => { navigate('/profile') }}
                                                className={classNames(
                                                    active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900' : 'text-gray-700 dark:text-slate-100',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Profile
                                            </p>
                                        )}
                                    </Menu.Item>

                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <p
                                                onClick={() => { navigate('/settings') }}
                                                className={classNames(
                                                    active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900' : 'text-gray-700 dark:text-slate-100',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Settings
                                            </p>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => signout()}>
                                        {({ active }) => (

                                            <p

                                                className={classNames(
                                                    active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900' : 'text-gray-700 dark:text-slate-100',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Logout
                                            </p>

                                        )}
                                    </Menu.Item>
                                </div>


                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <p className='font-semibold dark:text-white'>
                        {user.name.length < 8 ? user.name : '...' + user.name.slice(0, 6)}


                    </p>

                </div>
                {/* <div className='  sm:hidden' onClick={() => { navbar == 'hide' ? setnavbar('show') : setnavbar('hide') }}>
                    <Bars3Icon className=' h-8 w-8 ml-3 cursor-pointer  dark:text-white' />
                </div> */}

                <div className={' sm:w-4/12 w-6/12 h-full   flex-row justify-around items-center flex'} style={{ 'direction': 'ltr' }}>
                    <NavLink end to='/' className=' font-bold text-xl cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'><i className="fa-solid fa-house"></i></NavLink>
                    <NavLink to='/explore' className=' font-bold text-xl cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'><i className="fa-solid fa-compass "></i></NavLink>

                    <div onClick={() => {

                        const action = show()
                        dispatch(action)


                    }} className='font-bold text-xl cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'><i className="fa-solid fa-square-plus"></i></div>
                    <NavLink to='/search' className=' font-bold text-xl cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'><i className="fa-solid fa-magnifying-glass"></i></NavLink>
                </div>
                <div onClick={() => navigate('/')} className=' ml-2 hidden sm:flex items-center justify-center w-[10%] h-full cursor-pointer'>
                    <h1 className=' text-blue-500 inline font-bold'>To</h1>
                    <h1 className=' text-sky-500 inline font-bold mx-[2px]'><i className="fa-solid fa-camera-retro"></i></h1>
                    <h1 className=' text-blue-500 inline font-bold'>Ph</h1>


                </div>

            </header>
            <div>
                {addpost}
            </div>

            {/* <div className={` z-50 transition-all  ${navbar} w-full h-44 bg-white dark:bg-slate-800 absolute  `}>
                <div className=' w-full h-full flex items-center  justify-around flex-col'>
                    <NavLink end to='/' className=' w-[90%]  font-bold text-md cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'>HOME <i className="fa-solid fa-house"></i></NavLink>
                    <NavLink to='/explore' className=' w-[90%]  font-bold text-md cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'>explore <i className="fa-solid fa-compass"></i></NavLink>
                    <NavLink to='/addpost' className=' w-[90%]  font-bold text-md cursor-pointer hover:bg-slate-200 py-1 px-2 rounded-md transition-colors dark:text-white dark:hover:bg-slate-900'>Add <i className="fa-solid fa-square-plus"></i></NavLink>
                </div>
            </div> */}
        </>
    )
}

export default Navbar;