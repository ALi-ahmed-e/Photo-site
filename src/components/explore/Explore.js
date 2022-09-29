import React, { useEffect, useState, Fragment } from 'react'
import { endAt, doc, collection, updateDoc, arrayUnion, arrayRemove, getDocs, limit, orderBy, query, startAfter, deleteDoc, onSnapshot, getDoc } from "firebase/firestore";
import { Menu, Transition } from '@headlessui/react'
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { ChatBubbleLeftRightIcon, PencilIcon } from '@heroicons/react/24/outline';
const Explore = (x) => {

  const [posts, setposts] = useState([]);
  const [lastVisible, setlastVisible] = useState();
  const user = useSelector(state => state.auth.user)
  const classNames = (...classes) => { return classes.filter(Boolean).join(' ') }
  const [userdata, setuserdata] = useState();
  const [times, settimes] = useState(0);






  const getuserdata = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
      setuserdata(docSnap.data())
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    if (times == 0) {
      settimes(1)
    } else {
      settimes(1)
      showUpdates()
    }
  }, [x.update]);

  useEffect(() => {
    window.onscroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
        if (lastVisible) {
          getmoredata()
        }


      }
    }
  }, [lastVisible]);


  const getmoredata = async () => {
    const postslist = []
    const next = query(collection(db, "posts"),
      orderBy('timeStamp'),
      startAfter(lastVisible),
      limit(20)
    )

    const documentSnapshots = await getDocs(next);
    if (lastVisible != documentSnapshots.docs[documentSnapshots.docs.length - 1]) {
      documentSnapshots.forEach((doc) => {
        postslist.push(doc.data());
      })

      const newposts = posts.concat(postslist)
      setposts(newposts)

      setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
    }


  }

  const getalldata = async () => {


    const postslist = []

    const first = query(collection(db, "posts"), orderBy('timeStamp'), limit(20));
    const documentSnapshots = await getDocs(first)


    setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])


    documentSnapshots.forEach((doc) => {
      postslist.push(doc.data());
    })
    setposts(postslist)


  }


  useEffect(() => {
    getuserdata()
    getalldata()
  }, []);

  const deltepost = async (postId) => {

    const myposts = doc(db, "users", user.uid)
    await deleteDoc(doc(db, "posts", postId))
    await updateDoc(myposts, {
      posts: arrayRemove(postId)
    })
    showUpdates()

  }


  const showUpdates = async () => {

    if (lastVisible) {
      console.log('render')

      const q = query(collection(db, "posts"), orderBy('timeStamp'), endAt(lastVisible));

      onSnapshot(q, (querySnapshot) => {
        const postlists = [];

        querySnapshot.forEach((doc) => {
          postlists.push(doc.data());

        })
        setposts(postlists);
      })



    }
  }


  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        console.log('update')
        showUpdates()
      },
      (error) => {
        console.log(error)
      });
  }, []);





  const likepost = async (ele, postid) => {
    const post = doc(db, "posts", postid)
    if (ele.className == 'fa-solid fa-heart text-xl mx-3 text-red-600   cursor-pointer love') {

      ele.className = "fa-regular fa-heart text-xl mx-3 dark:text-white   cursor-pointer love"
      await updateDoc(post, {
        likedby: arrayRemove(user.uid)
      })
      showUpdates()

    } else {
      ele.className = 'fa-solid fa-heart text-xl mx-3 text-red-600   cursor-pointer love'
      await updateDoc(post, {
        likedby: arrayUnion(user.uid)
      })
      showUpdates()
    }
    

  }



  const saveposttofav = async (postId) => {
    const me = doc(db, "users", user.uid)

    if (userdata.favourites) {
      if (userdata.favourites.includes(postId)) {

        await updateDoc(me, {
          favourites: arrayRemove(postId)
        })
        getuserdata()
        showUpdates()
      } else {
        await updateDoc(me, {
          favourites: arrayUnion(postId)
        })
        getuserdata()
        showUpdates()
      }

    }

  }





  return (
    <div className=' pb-48'>
      {posts.map(post => <div key={Math.random()} className=' shadow-md rounded-lg my-10 mx-auto w-[95%] max-w-[500px]  bg-white'>
        {/* header */}
        <div className=' w-full h-14  dark:bg-slate-800  rounded-t-md flex items-center dark:text-white'>

          <div className=' border-b-[1px] border-slate-500/30 flex flex-row items-center justify-between w-full'>


            <div className='flex h-full  items-center'>

              <img src={post.image} className={` shadow-md  w-[40px] h-[40px] rounded-full ml-3`} alt="" />
              <div className=' flex flex-col  h-14'>
                <span className=' -ml-12 font-semibold mt-3'>{post.name}</span>
                <span className=' ml-8 mb-4 text-xs'>{post.postTime}</span>
              </div>

            </div>








            <Menu as="div" className="relative inline-block text-left w-fit h-fit">
              <div>
                <Menu.Button className='flex items-center '>

                  <i className="fa-solid fa-ellipsis mr-5 py-1 px-3 rounded-md cursor-pointer transition-all hover:bg-black/20"></i>


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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md dark:divide-black dark:bg-slate-800 bg-white shadow-lg ring-1 ring-black ring-opacity-5  border-[0.5px] border-slate-600/30 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <p

                          onClick={() => saveposttofav(post.postId)}
                          className={classNames(
                            active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                            'block px-4 py-2 text-sm  cursor-pointer'
                          )}
                        >

                          {userdata.favourites && userdata.favourites.includes(post.postId) ? <>unsave post <i className="fa-solid fa-bookmark"></i> </> : <>save post <i className="fa-regular fa-bookmark"></i></>}


                        </p>
                      )}
                    </Menu.Item>
                    {userdata && userdata.posts && userdata.posts.includes(post.postId) &&
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <p

                              onClick={() => deltepost(post.postId)}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                                'block px-4 py-2 text-sm  cursor-pointer'
                              )}
                            >
                              Delete Post <i className="fa-regular fa-trash-can"></i>
                            </p>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <p


                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                                'block px-4 py-2 text-sm  cursor-pointer'
                              )}
                            >
                              Edit Post <PencilIcon className=' w-4 h-4 inline' />
                            </p>
                          )}
                        </Menu.Item>
                      </>



                    }
                  </div>




                </Menu.Items>
              </Transition>
            </Menu>


          </div>


        </div>
        {/* Body */}

        <div className={` flex items-center justify-center flex-col  text-xl dark:bg-slate-800 dark:text-white`}>
          {
            post.media.type && post.media.type == 'img' ? <img src={post.media.file} className=' w-full max-h-[430px]' alt="" /> : post.media.type == 'vid' ? <video src={post.media.file} controls className=' w-full max-h-[430px]' /> : ''
          }
          <span className=' self-start mx-3 my-2 text-md '>{post.postBody}</span>

        </div>
        {/* footer */}

        <div className=' h-8 w-full  border-t-[1px] border-slate-500/30  dark:bg-slate-800 rounded-b-md flex items-center justify-between'>
          <div>
            <i className={post.likedby.includes(user.uid) ? 'fa-solid fa-heart text-xl mx-3 text-red-600   cursor-pointer love' : 'fa-regular fa-heart text-xl mx-3 dark:text-white   cursor-pointer love'} onClick={(e) => likepost(e.target, post.postId)}></i>

            <ChatBubbleLeftRightIcon className=' cursor-pointer hover:text-red-600 w-6 h-6 inline dark:text-white' />
          </div>

          <span className=' mr-2 dark:text-white'>{post.likedby.length} likes</span>
        </div>



      </div>


      )}


    </div>
  )
}

export default Explore;