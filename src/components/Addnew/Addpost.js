import React, { Fragment, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { addaction } from '../../store/reducers/addnewreducer'
import { useDispatch, useSelector } from 'react-redux'
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Addpost = () => {
  const dispatch = useDispatch()
  const { hide } = addaction
  const user = useSelector(state => state.auth.user)
  const postBody = useRef()
  const [txt, settxt] = useState();
  const [media, setmedia] = useState({ type: '', file: '' });
  const [spinner, setspinner] = useState('Post');


  const publicPost = async () => {

    if (postBody.current.value || media.file) {
      setspinner(<>Post <i className="fa-solid fa-circle-notch animate-spin text-lg text-white"></i></>)
      settxt()
      let pid = []
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 10; i++) {

        pid.push(characters[Math.floor(Math.random() * 27)])
        pid.push(Math.floor(Math.random() * 9))
      }



      await setDoc(doc(db, "posts", pid.join('')), {
        postBody: postBody.current.value ? postBody.current.value : '',
        name: user.name,
        image: user.image,
        timeStamp: serverTimestamp(),
        media: media ? media : 'no',
        postTime: Date().slice(0, 21),
        postId: pid.join(''),
        likedby: []
      })

      const userpostsarrref = doc(db, "users", user.uid)
      await updateDoc(userpostsarrref, {
        posts: arrayUnion(pid.join(''))
      });

      const action = hide()
      dispatch(action)
      setspinner('Post')

    }
  }






  const uploadmedia = (file) => {
    setspinner(<i className="fa-solid fa-circle-notch animate-spin text-lg text-white"></i>)


    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: file.type
    };

    const fileName = Date() + file.name

    let storageRef
    if (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png" || file.type == "image/jpg") {
      storageRef = ref(storage, 'images/' + fileName);


    } else if (file.type == "video/mp4") {
      storageRef = ref(storage, 'videos/' + fileName);

    }


    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {
        switch (snapshot.state) {
          case 'paused':

            break;
          case 'running':

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

          if (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png" || file.type == "image/jpg") {
            setmedia({
              type: 'img',
              file: downloadURL
            })
            settxt('img')
          } else if (file.type == "video/mp4") {
            setmedia({
              type: 'vid',
              file: downloadURL
            })
            settxt('vid')
          }
          setspinner('Post')

        });
      }
    );



  }















  return (
    <div className=' z-10 fixed top-0 bottom-0 left-0 right-0 bg-glass flex  justify-center'>

      <div className=' mt-14 h-fit pb-5 z-40 w-[90%] max-w-[600px]  bg-white dark:bg-black  rounded-2xl  '>
        <XMarkIcon onClick={() => {
          const action = hide()
          dispatch(action)
        }} className=' mx-2 my-2 w-6 h-6 dark:text-white cursor-pointer' />

        <div className='h-full flex flex-col items-center  w-full ml-1'>
          <div className=' self-start ml-3 mt-5 flex  h-fit items-center'>
            <img src={user.image} alt="" className=' border-[1px] border-black dark:border-white rounded-full w-10 h-10 ' />
            <div className=' font-semibold ml-2 dark:text-white'>Ali ahmed</div>
          </div>
          <textarea onChange={(e) => { settxt(e.target.value) }} ref={postBody} placeholder="What's in your mind" className=' font-semibold text-xl bg-transparent  w-[85%] outline-none mt-5  min-h-[150px] max-h-[150px] dark:text-white' />



          <div>
            {media.type && <Fragment>
              {media.type == 'img' ? <img src={media.file} className='media rounded-md mx-auto' alt="" />
                : <video controls src={media.file} className='media rounded-md mx-auto' alt="" />}

            </Fragment>

            }
          </div>

          <div className='w-[90%] bg-black/30 dark:bg-slate-200/30 my-3 h-[1px] mx-auto rounded-md'></div>



          <div className='  w-[90%] h-[40px]  items-center flex justify-between'>


            <div className='text-black  dark:text-white'>



              <label htmlFor="myfile"><i className="fa-solid fa-photo-film text-lg ml-3 cursor-pointer hover:bg-indigo-400/20 px-[10px] py-2 rounded-md transition-all"></i></label>
              <input onChange={(e) => { uploadmedia(e.target.files[0]) }} type="file" id="myfile" name="myfile" className=' hidden' />


            </div>
            <button onClick={publicPost} className={`px-3 py-1 ${txt ? ' opacity-100 hover:bg-indigo-600 cursor-pointer' : ' opacity-50 cursor-default'} ${txt} bg-indigo-500  text-white  rounded-md font-semibold mr-2`}>{spinner}</button>

          </div>
        </div>
      </div>
    </div>


  )
}

export default Addpost