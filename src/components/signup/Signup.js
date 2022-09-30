import React from 'react'
import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authaction } from '../../store/reducers/authreducer';
import { auth, db, Gitprovider, provider } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Loading from '../loading/Loading';

const Signup = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const { signin } = authaction
    const navigate = useNavigate()
    const [lengthh, setlength] = useState();

    const [loading, setloading] = useState();




    //create firestore user & dispatch

    const createfirrestoreuser = async (user, provider) => {
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName ? user.displayName : 'user',
            image: user.photoURL ? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            email: user.email,
            uid: user.uid,
            following: [],
            followers: [],
            theme: 'system',
            bio: '',
            Provider: provider,
            verfied: false,
            favourites:[]
        })
        const data = {
            name: user.displayName ? user.displayName : 'user',
            image: user.photoURL ? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            email: user.email,
            uid: user.uid,
            following: [],
            followers: [],
            theme: 'system',
            bio: '',
            Provider: provider,
            verfied: false,
            favourites:[]
        }

        localStorage.setItem('user', JSON.stringify(data))
        const action = signin({ user: JSON.stringify(data) })
        dispatch(action)
        setloading()
        navigate('/')


    }







    const signemaipass = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const name = e.target.name.value




        if (email && password && name) {
            if (password.length > 7) {
                setlength('')
                setloading(<Loading />)
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        user.displayName = name
                        createfirrestoreuser(user, 'password')
                    })
                    .catch((error) => {
                        setlength(<p className='text-red-600'>email-already-in-use</p>)
                        setloading()
                    });
            } else {
                setlength(<p className='text-red-600'>password must be 7 caracters or more</p>)
            }
        } else {
            setlength(<p className='text-red-600'>All fields must be filled in</p>)

        }



    }








    //sign up with github

    const signinWithithub = () => {
        setloading(<Loading />)
        signInWithPopup(auth, Gitprovider)
            .then((result) => {
                const user = result.user;
                createfirrestoreuser(user, 'github')

            }).catch((error) => {
                console.log(error)
                setloading()
            });
    }

    //sign up with google

    const signinWithgoogle = () => {
        setloading(<Loading />)
        signInWithPopup(auth, provider)
            .then((result) => {

                const user = result.user;
                createfirrestoreuser(user, 'google')
            }).catch((error) => {
                console.log(error)
                setloading()
            });

    }








    return (
        <div className=' shadow-lg   dark:bg-slate-800 bg-white max-w-[400px] w-[95%] pb-3 mx-auto my-20 rounded-lg'>
            {loading}


            <h1 className=' text-2xl font-bold tracking-wide my-10 relative top-5 dark:text-white'>Signup</h1>
            <form onSubmit={(e) => signemaipass(e)}>
                <div>
                    <input placeholder='Name' className=' dark:bg-black dark:text-white dark:border-slate-700 block my-3 py-2 px-4 mx-auto w-[85%] rounded-md shadow-sm border-slate-400 border-[0.2px]' type="text" name='name' />

                    <input placeholder='Email' className=' dark:bg-black dark:text-white dark:border-slate-700 block my-3 py-2 px-4 mx-auto w-[85%] rounded-md shadow-sm border-slate-400 border-[0.2px]' type="email" name='email' />

                    <input placeholder='Password' className=' dark:bg-black dark:text-white dark:border-slate-700 block my-3 py-2 px-4 mx-auto w-[85%] rounded-md shadow-sm border-slate-400 border-[0.2px]' type="password" name='password' />
                    {lengthh}
                </div>


                <button type='submit' className=' w-[85%] bg-blue-600 text-white py-2 rounded-md my-5 hover:bg-blue-700 '>Signup</button>
            </form>
            <p className='dark:text-white'>already have an account ? <span className='text-blue-700 dark:text-blue-400 cursor-pointer' onClick={() => navigate('/signin')}>Signin</span></p>

            <div className=' flex justify-center items-center my-3'>
                <p className=' absolute bg-white px-1 dark:bg-slate-800 dark:text-white'>Or</p>
                <div className='h-[0.2px] w-[90%] my-3 bg-black/30 dark:bg-black rounded-md mx-auto'></div>
            </div>



            <button onClick={signinWithithub} className=' my-5 mx-auto  dark:bg-gray-900 dark:hover:bg-black bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center py-[6px] w-[85%] rounded-md'>signup with Github<i className="fa-brands fa-github text-2xl ml-2"></i></button>



            <button onClick={signinWithgoogle} className=' my-5 mx-auto bg-slate-400 hover:bg-slate-500 text-white flex items-center justify-center py-1 w-[85%] rounded-md'> signup with Google<i className="fa-brands fa-google text-2xl ml-2 text-slate-white"></i></button>




        </div>
    )
}

export default Signup