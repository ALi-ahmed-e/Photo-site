import React, { useEffect, useRef, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, provider, Gitprovider, storage } from '../../firebase'
import { useSelector, useDispatch } from 'react-redux';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { deleteUser, reauthenticateWithPopup, reauthenticateWithCredential, signOut, updateProfile, signInWithPopup, EmailAuthProvider, sendPasswordResetEmail, GoogleAuthProvider, getIdToken, updatePassword } from 'firebase/auth';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { authaction } from '../../store/reducers/authreducer';
import Loading from '../loading/Loading';


const Settings = () => {
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const [photo, setphoto] = useState();
    const [uplbtn, setuplbtn] = useState(<>Upload image<ArrowUpTrayIcon className='w-[20px] ml-1 inline' /></>);
    const username = useRef()
    const Bio = useRef()
    const navigate = useNavigate()
    const ischeked = useRef()
    const ischeked2 = useRef()
    const ischeked3 = useRef()
    const [nowtheme, themeis] = useState();
    const { signin } = authaction
    const [loading, setloading] = useState();
    const [thepopup, setpopup] = useState();
    const [currentpass, setcurrentpass] = useState();
    const [wrng, setwrng] = useState();
    const passnew = useRef()
    const passcurrent = useRef()
    const colorval = useRef()

    useEffect(() => {
        username.current.value = user.name
        Bio.current.value = user.bio
        colorval.current.value = user.cover
        // if (emaill.current) { emaill.current.value = user.email }
        if (user.theme == 'system') {
            ischeked.current.checked = 'true'
        } else if (user.theme == 'light') {
            ischeked2.current.checked = 'true'
        } else if (user.theme == 'dark') {
            ischeked3.current.checked = 'true'
        }
    }, []);







    const verfiyemail = () => {
        // sendPasswordResetEmail(auth, user.email)
        // .then(() => {
        //   console.log('done')
        // })
        // .catch((error) => {
        //   const errorCode = error.code;
        //   const errorMessage = error.message;
        // console.log(error)
        // });


        // prmp()


    }

    const savepasschanges = () => {
        if (passnew.current.value && passcurrent.current.value) {
            setloading(<Loading />)
            const cre = EmailAuthProvider.credential(user.email, passcurrent.current.value)
            reauthenticateWithCredential(auth.currentUser, cre).then(() => {
                updatePassword(auth.currentUser, passnew.current.value).then(() => {
                    console.log('done')
                    setloading()
                }).catch((error) => {
                    console.log(error)
                    setloading()
                });
            }).catch((err) => {

                console.log(err)
                setloading()
            })

        }


    }



    const deleteacc = () => {

        if (user.Provider == 'password') {
            console.log('f')
            setpopup('show')
        } else {
            prmp()
        }


    }
    const dlt = async () => {
        setloading(<Loading />)
        await deleteDoc(doc(db, "users", user.uid))
        deleteUser(auth.currentUser).then(() => {
            dltdoc()
        }).catch((error) => {
            console.log(error)
            setloading()
        });


    }
    const dltdoc = async () => {

        localStorage.removeItem('user')
        window.location.reload()
        setloading()
    }


    const saveChanges = () => {

        if (auth.currentUser) {
            setloading(<Loading />)
            updateProfile(auth.currentUser, {
                displayName: username.current.value,
                photoURL: photo ? photo : user.image,
            }).then(() => {
                savechanges()
            }).catch((error) => {
                console.log(error)
                setloading()
            });
        } else {
            console.log(auth)
        }

    }

    const savechanges = async () => {
        const userref = doc(db, "users", user.uid);


        await updateDoc(userref, {
            name: username.current.value,
            image: photo ? photo : user.image,
            bio: Bio.current.value ? Bio.current.value : user.bio,
            theme: nowtheme ? nowtheme : user.theme,
            cover:colorval.current.value
        });
        getuserdata()
        setloading()
        navigate('/profile')

    }



    const getuserdata = async () => {
        const docRef = doc(db, "users", JSON.parse(localStorage.getItem('user')).uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            localStorage.setItem('user', JSON.stringify(docSnap.data()))
            localStorage.setItem('theme', docSnap.data().theme)

            const action = signin({ user: JSON.stringify(docSnap.data()) })
            dispatch(action)
            window.location.reload()

        } else {
            console.log("No such document!");
        }
    }




    const uploadimg = async (file) => {
        setuplbtn(<i className="fa-solid fa-circle-notch text-xl animate-spin"></i>)


        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: file.type
        };


        const storageRef = ref(storage, 'ProfileImages/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {

                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setphoto(downloadURL)
                    setuplbtn(<>Upload image<ArrowUpTrayIcon className='w-[20px] ml-1 inline' /></>)
                });
            }
        );
    }


    const prmp = () => {


        if (user.Provider == 'password') {
            console.log(currentpass)

            if (currentpass) {
                const cre = EmailAuthProvider.credential(user.email, currentpass)
                reauthenticateWithCredential(auth.currentUser, cre).then(() => {
                    setpopup()
                    dlt()
                }).catch((err) => {

                    console.log(err)
                    setwrng(<p className='text-red-600 block'>wrong password</p>)


                })

            }


        } else {



            let Provider
            if (user.Provider == 'google') {
                Provider = provider
            } else if (user.Provider == 'gihub') {
                Provider = Gitprovider
            }

            reauthenticateWithPopup(auth.currentUser, Provider).then(() => {
                setloading(<Loading />)
                deleteUser(auth.currentUser).then(() => {
                    dlt()
                }).catch((error) => {
                    console.log(error)
                    setloading()
                });
            })
        }
    }


    const confirm = () => {
        prmp()

    }



    return (
        <div>
            <div className={thepopup + ` hidden fixed z-50 top-0 bottom-0 left-0 right-0 bg-black/50`}>

                <div className='w-full h-full flex items-center justify-center'>

                    <div className=' w-[280px] h-[350px] bg-white rounded-md dark:bg-slate-800'>

                        <input type="password" onChange={(e) => setcurrentpass(e.target.value)} className=' bg-slate-200 mt-24 dark:bg-black dark:text-white py-1 px-2 w-[95%] rounded-md outline-none my-5 text-center' placeholder='current password' />
                        {wrng}
                        <button onClick={confirm} className='bg-red-600 hover:bg-red-700 py-1 px-2 rounded-md text-white mt-14'>Delete</button>

                    </div>

                </div>

            </div>

            {loading}


            <div className='w-[95%] max-w-[650px] pb-11  bg-white dark:bg-slate-800 mx-auto my-20 rounded-xl'>
                <h2 className=' dark:text-white text-xl pt-5'>Personal information</h2>
                <div className=' w-[90%] h-[0.3px] bg-slate-400/50 mx-auto my-5'></div>


                <div className='set  w-[80%] mx-auto pb-2 flex items-center justify-center flex-col'>
                    <div></div>
                    <img src={photo ? photo : user.image} alt="" className=' my-4 w-16 h-16 rounded-md' />

                    <label className=' bg-slate-400 py-1 px-2 rounded-md hover:bg-slate-500' htmlFor="myfile">{uplbtn}</label>
                    <input onChange={(e) => uploadimg(e.target.files[0])} accept="image/*" type="file" id="myfile" name="myfile" className=' hidden' />
                    <br />
                    <input type="color" ref={colorval} />
                </div>

                <input ref={username} placeholder='name' type="text" className={` text-center block my-7 mx-auto w-[80%] py-2 px-1 rounded-md outline-none bg-slate-300 dark:bg-black dark:text-white`} />
                <input ref={Bio} placeholder='Bio' type="text" className={` text-center block my-7 mx-auto w-[80%] py-2 px-1 rounded-md outline-none bg-slate-300 dark:bg-black dark:text-white`} />


            </div>

            <div className=' flex justify-around flex-col w-[95%] max-w-[650px] pb-11  bg-white dark:bg-slate-800 mx-auto my-20 rounded-xl'>
                <h2 className=' dark:text-white text-xl pt-5'>security information</h2>
                <div className=' w-[90%] h-[0.3px] bg-slate-400/50 mx-auto my-5'></div>


                {user.Provider == 'password' ? <>

                    <div className={` text-center block my-7 mx-auto w-[80%] py-2 px-1 rounded-md outline-none bg-slate-300 dark:bg-black dark:text-white`} >{user.email}</div>
                    <input ref={passcurrent} placeholder='Current password' type="password" className={` text-center block my-7 mx-auto w-[80%] py-2 px-1 rounded-md outline-none bg-slate-300 dark:bg-black dark:text-white`} />
                    <input ref={passnew} placeholder='new password' type="password" className={` text-center block my-7 mx-auto w-[80%] py-2 px-1 rounded-md outline-none bg-slate-300 dark:bg-black dark:text-white`} />
                    <div onClick={savepasschanges} className={` text-center block my-7 mx-auto w-[30%] py-2 px-1 rounded-md outline-none bg-green-600 dark:text-white hover:bg-green-700  cursor-pointer`}>Save new Password</div>


                </> : <>
                    <p className='text-red-500'>password cannot be changed as your account is linked to google</p>
                    <div className={` text-center block my-7 mx-auto w-[80%] py-2 px-1 rounded-md outline-none bg-slate-300 dark:bg-black dark:text-white`} >{user.email}</div>
                    <div className={` text-center block my-7 mx-auto w-[30%] py-2 px-1 rounded-md outline-none  bg-green-600  `}>Save new password</div>
                </>}



            </div>



            <div className='w-[95%] max-w-[650px] h-[350px]  bg-white dark:bg-slate-800 mx-auto my-20 rounded-xl' >

                <h2 className=' dark:text-white text-xl pt-5'>Appearance</h2>
                <div className=' w-[90%] h-[0.3px] bg-slate-400/50 mx-auto my-5'></div>
                <div className=' flex-col w-[80%] mx-auto h-[70%] flex justify-around items-start'>

                    <div className=' flex items-center '><input className=' w-5 h-5' type="radio" name='theme' ref={ischeked} onChange={() => themeis('system')} /> <span className=' text-lg ml-3 dark:text-white font-semibold'>use system settings (default)</span></div>
                    <div className=' flex items-center '><input className=' w-5 h-5' type="radio" name='theme' ref={ischeked2} onChange={() => themeis('light')} /> <span className=' text-lg ml-3 dark:text-white font-semibold'>light</span></div>
                    <div className=' flex items-center '><input className=' w-5 h-5' type="radio" name='theme' ref={ischeked3} onChange={() => themeis('dark')} /> <span className=' text-lg ml-3 dark:text-white font-semibold'>Dark</span></div>



                </div>

            </div>



            <div className='w-[90%] max-w-[650px] h-[50px]  bg-white dark:bg-slate-800 mx-auto my-20 rounded-xl'>
                <button className='w-[95%] bg-green-600 hover:bg-green-700 text-white py-2 mt-[5px] rounded-md' onClick={saveChanges}>save changes</button>
            </div>

            <div className='w-[90%] max-w-[650px] h-[50px]  bg-white dark:bg-slate-800 mx-auto my-20 rounded-xl'>
                <button className='w-[95%] bg-red-700 hover:bg-red-800 text-white py-2 mt-[5px] rounded-md' onClick={deleteacc}>Delete account</button>
            </div>
        </div >
    )
}

export default Settings