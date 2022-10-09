import React, { useLayoutEffect, useState } from 'react'
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { arrayRemove, arrayUnion, doc, updateDoc, collection, query, getDocs, getDoc } from "firebase/firestore";

const Search = () => {
    const navigate = useNavigate()
    const mydata = useSelector(state => state.auth.user)
    const [load, setload] = useState();
    const [me, setme] = useState();
    const [users, setusers] = useState([]);
    useLayoutEffect(() => {
        getuserdata()
    }, [])

    const getuserdata = async () => {
        const docRef = doc(db, "users", mydata.uid);
        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {
            setme(docSnap.data())
        } else {
            console.log("No such document!");
        }
    }


    const search = async (e) => {
        e.preventDefault()

        if (e.target.searchbar.value) {

            setload(<>
                <div className='  flex items-center  justify-between w-[95%] max-w-[600px] h-[70px] bg-white dark:bg-slate-800 my-4 rounded-md'>
                    <div className='animate-pulse flex items-center'>

                        <div className=' w-12 h-12 bg-slate-500 rounded-full ml-2 '></div>
                        <div className=' w-20 h-4 ml-4 bg-slate-500 rounded-md'></div>

                    </div>

                    <div className=' animate-pulse mr-4 w-14 h-8 rounded-md bg-slate-600'></div>

                </div>
                <div className='  flex items-center  justify-between w-[95%] max-w-[600px] h-[70px] bg-white dark:bg-slate-800 my-4 rounded-md'>
                    <div className='animate-pulse flex items-center'>

                        <div className=' w-12 h-12 bg-slate-500 rounded-full ml-2 '></div>
                        <div className=' w-20 h-4 ml-4 bg-slate-500 rounded-md'></div>
                    </div>

                    <div className=' animate-pulse mr-4 w-14 h-8 rounded-md bg-slate-600'></div>

                </div>
                <div className='  flex items-center  justify-between w-[95%] max-w-[600px] h-[70px] bg-white dark:bg-slate-800 my-4 rounded-md'>
                    <div className='animate-pulse flex items-center'>

                        <div className=' w-12 h-12 bg-slate-500 rounded-full ml-2 '></div>
                        <div className=' w-20 h-4 ml-4 bg-slate-500 rounded-md'></div>

                    </div>

                    <div className=' animate-pulse mr-4 w-14 h-8 rounded-md bg-slate-600'></div>

                </div>
                <div className='  flex items-center  justify-between w-[95%] max-w-[600px] h-[70px] bg-white dark:bg-slate-800 my-4 rounded-md'>
                    <div className='animate-pulse flex items-center'>

                        <div className=' w-12 h-12 bg-slate-500 rounded-full ml-2 '></div>
                        <div className=' w-20 h-4 ml-4 bg-slate-500 rounded-md'></div>

                    </div>

                    <div className=' animate-pulse mr-4 w-14 h-8 rounded-md bg-slate-600'></div>

                </div>

            </>)

            const q = query(collection(db, "users"));

            const querySnapshot = await getDocs(q);
            const lst = []
            querySnapshot.forEach((doc) => {
                if (doc.data().name.toLowerCase().includes(e.target.searchbar.value.toLowerCase())) {
                    lst.push(doc.data())
                }


            });
            setload()
            setusers(lst)
        }



    }

    const gotoprof = (Id) => {
        sessionStorage.setItem('otherprofile', Id)
        navigate('/otherprofile')
    }











    const followuser = async (e, user) => {
        if (me.following.includes(user.uid)) {

            const himref = doc(db, "users", sessionStorage.getItem('otherprofile'));
            await updateDoc(himref, {
                followers: arrayRemove(me.uid)
            })

            const meref = doc(db, "users", me.uid);
            await updateDoc(meref, {
                following: arrayRemove(user.uid)
            })
            e.target.value = 'Follow'
            getuserdata()
        } else {



            const himref = doc(db, "users", sessionStorage.getItem('otherprofile'));
            await updateDoc(himref, {
                followers: arrayUnion(me.uid)
            })

            const meref = doc(db, "users", me.uid);
            await updateDoc(meref, {
                following: arrayUnion(user.uid)
            })
            e.target.value = 'Unfollow'
            getuserdata()
        }

    }

    return (
        <div>
            <form onSubmit={(e) => search(e)} className=' w-full flex pl-1  h-[60px] items-center justify-around'>

                <input name='searchbar' type="text" className=' bg-slate-300 rounded-md dark:text-white px-1 py-2 focus:border-[0.5px]  focus:border-white border-[0.5px] border-white dark:border-black dark:bg-black w-[90%] transition-all' />

                <button type='submit' className=' bg-indigo-500 px-2 py-[8px] rounded-md  text-white hover:bg-indigo-600 transition-all mx-2'>Search</button>

            </form>
            <div className='w-full flex flex-col items-center '>
                {load}

                {users.map(user =>
                    <div key={Math.random()} className={`' flex items-center  justify-between w-[95%] max-w-[600px] h-[70px] bg-white dark:bg-slate-800 my-4 rounded-md ' border-0 border-l-2 `} style={{'borderColor':'#' + Math.floor(Math.random() * 16777215).toString(16)}}>
                        <div className='flex items-center cursor-pointer' onClick={() => gotoprof(user.uid)}>

                            <img className=' w-12 h-12 bg-slate-500 rounded-full ml-2 ' src={user.image} />
                            <div className=' dark:text-white ml-2  rounded-md'>{user.name}</div>

                        </div>

                        <input type='button' className=' cursor-pointer rounded-md text-white px-4 py-1 bg-green-600 hover:bg-green-700 mr-2' onClick={(e) => followuser(e, user)} value={me.following.includes(user.uid) ? 'Unfollow' : 'Follow'} ></input>
                    </div>
                )}


            </div>


        </div>
    )
}

export default Search