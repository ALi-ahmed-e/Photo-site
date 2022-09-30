import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, db, Gitprovider, provider } from '../../firebase';
import { authaction } from '../../store/reducers/authreducer';
import Loading from '../loading/Loading';

const Sign = () => {
    const dispatch = useDispatch()
    const { signin } = authaction
    const navigate = useNavigate()
    const [wrong, setwrong] = useState('');
    const [loading, setloading] = useState();




    //create firestore user & dispatch

    const createfirrestoreuser = async (user, serviceprofider) => {
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName ? user.displayName : 'user',
            image: user.photoURL ? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            email: user.email,
            uid: user.uid,
            following: [],
            followers: [],
            theme: 'system',
            bio: '',
            Provider: serviceprofider,
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
            Provider: serviceprofider,
            verfied: false,
            favourites:[]
        }

        localStorage.setItem('user', JSON.stringify(data))
        const action = signin({ user: JSON.stringify(data) })
        dispatch(action)
        navigate('/')


    }

    const getuserdata = async (user, provider) => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            localStorage.setItem('user', JSON.stringify(docSnap.data()))
            const action = signin({ user: JSON.stringify(docSnap.data()) })
            dispatch(action)
            setloading()
            navigate('/')
        } else {
            createfirrestoreuser(user, provider)
        }
    }











    // sign in with email and password
    const signemaipass = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        if (email && password) {
            setloading(<Loading />)
            setwrong('')
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    localStorage.setItem('Credential',JSON.stringify(userCredential))

                    getuserdata(user, 'password')

                })
                .catch((error) => {
                    console.log(error)
                    setwrong(<p className='text-red-600'>Wrong email or password</p>)
                setloading()
                });
        } else {
            setwrong(<p className='text-red-600'>All fields must be filled in</p>)
        }



    }




    //sign in with github

    const signinWithithub = () => {
        setloading(<Loading />)
        signInWithPopup(auth, Gitprovider)
            .then((result) => {
                const user = result.user;

                getuserdata(user, 'github')

            }).catch((error) => {
                console.log(error)
                setloading()
            });
    }

    //sign in with google

    const signinWithgoogle = () => {
        setloading(<Loading />)
        signInWithPopup(auth, provider)
            .then((result) => {

                const user = result.user;
                localStorage.setItem('res',JSON.stringify(result))
                getuserdata(user, 'google')
            }).catch((error) => {
                console.log(error)
                setloading()
            });

    }






    return (
        <div className=' shadow-lg   dark:bg-slate-800 bg-white max-w-[400px] w-[95%] pb-3 mx-auto my-20 rounded-lg'>

            {loading}
            <h1 className=' text-2xl font-bold tracking-wide my-10 relative top-5 dark:text-white'>Login</h1>
            <form onSubmit={(e) => signemaipass(e)}>
                <div>
                    <input placeholder='Email' className=' dark:bg-black dark:text-white dark:border-slate-700 block my-3 py-2 px-4 mx-auto w-[85%] rounded-md shadow-sm border-slate-400 border-[0.2px]' type="email" name='email' />

                    <input placeholder='Password' className=' dark:bg-black dark:text-white dark:border-slate-700 block my-3 py-2 px-4 mx-auto w-[85%] rounded-md shadow-sm border-slate-400 border-[0.2px]' type="password" name='password' />
                    {wrong}
                </div>

                <p className=' text-blue-600'>forgot Password?</p>

                <button type='submit' className=' w-[85%] bg-blue-600 text-white py-2 rounded-md my-5 hover:bg-blue-700 '>Login</button>
            </form>
            <p onClick={() => navigate('/signup')} className='dark:text-white'>Don't have an account ? <span className='text-blue-700 dark:text-blue-400 cursor-pointer'>Signup</span></p>

            <div className=' flex justify-center items-center my-3'>
                <p className=' absolute bg-white px-1 dark:bg-slate-800 dark:text-white'>Or</p>
                <div className='h-[0.2px] w-[90%] my-3 bg-black/30 dark:bg-black rounded-md mx-auto'></div>
            </div>



            <button onClick={signinWithithub} className=' my-5 mx-auto  dark:bg-gray-900 dark:hover:bg-black bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center py-[6px] w-[85%] rounded-md'>Login with Github<i className="fa-brands fa-github text-2xl ml-2"></i></button>



            <button onClick={signinWithgoogle} className=' my-5 mx-auto bg-slate-400 hover:bg-slate-500 text-white flex items-center justify-center py-1 w-[85%] rounded-md'> Login with Google<i className="fa-brands fa-google text-2xl ml-2 text-slate-white"></i></button>



        </div>
    )
}

export default Sign