import React, { useLayoutEffect, useState } from 'react'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import List from '../list/List';
const OtherProfile = () => {
  const [user, setuser] = useState();
  const [me, setme] = useState();
  const mydata = useSelector(state => state.auth.user)


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




  const getuser = async () => {
    const docRef = doc(db, "users", sessionStorage.getItem('otherprofile'));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setuser(docSnap.data())
    } else {
      console.log("No such document!");
    }
  }
  useLayoutEffect(() => {
    getuser()
  }, [])


  const followuser = async (e) => {
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
      {user && <div>
        <div className=' w-full  pb-5'>

        <div className={` h-28 w-full `} style={{'background':user.cover}}></div>

          <div className=' w-full bg-white dark:bg-slate-900  pb-10'>
            <input type='button' className=' cursor-pointer absolute right-2 rounded-md text-white px-4 py-1 bg-indigo-500 hover:bg-indigo-600 mt-5' onClick={(e) => followuser(e)} value={me.following.includes(user.uid) ? 'Unfollow' : 'Follow'} ></input>

            <img src={user.image} className='w-[150px] h-[150px] rounded-full mx-auto border-8  dark:border-slate-900 border-white relative bottom-20 mb-[-60px]' alt="user img" />

            <h1 className=' text-2xl dark:text-slate-50 mb-10'>{user.name}</h1>
            <h1 className=' text-md dark:text-slate-50 mb-10'>{user.bio}</h1>

            <div className=' w-[90%] mx-auto h-[200px] border-t-[.5px] border-slate-600/50 flex flex-row justify-around items-center'>

              <h1 className='  dark:text-white mx-10 text-xl'>{user.followers.length} followers</h1>
              <h1 className='  dark:text-white mx-10 text-xl'>{user.following.length} following</h1>

            </div>
            <List mode={user.uid} />

          </div>
        </div>
      </div>}
    </div>
  )
}

export default OtherProfile