import React, { useEffect, useState, Fragment } from 'react'
import { endAt, doc, collection, updateDoc, arrayUnion, arrayRemove, getDocs, limit, orderBy, query, startAfter, deleteDoc, onSnapshot, getDoc, where } from "firebase/firestore";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { ChatBubbleLeftRightIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';



const List = ({ mode }) => {

    const [posts, setposts] = useState([]);
    const [lastVisible, setlastVisible] = useState();
    const user = useSelector(state => state.auth.user)
    const classNames = (...classes) => { return classes.filter(Boolean).join(' ') }
    const [userdata, setuserdata] = useState();
    const navigate = useNavigate()
    const subadd = useSelector(state => state.subadd.subadd)
    const [nofr, setnofr] = useState();
    const [placeholders, setplaceholders] = useState();
    const [editpostl, seteditpostl] = useState();
    const [loadic, setloadic] = useState('Save');
    const edttxt = useRef()


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



        showUpdates()




    }, [subadd])

    useEffect(() => {
        window.onscroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
                if (lastVisible) {
                    getmoredata()
                }


            }
        }
    }, [lastVisible]);

    useEffect(() => {

        if (posts != '') {
            setplaceholders('')
        } else {
            setplaceholders(<><><div className=' shadow-md rounded-lg my-10 mx-auto w-[95%] max-w-[500px]  bg-white'>
                {/* header */}
                <div className=' w-full h-14  dark:bg-slate-800  rounded-t-md flex items-center dark:text-white'>

                    <div className='  animate-pulse border-b-[1px] border-slate-500/30 flex flex-row items-center justify-between w-full'>


                        <div className='  flex h-full  items-center'>

                            <div className={` shadow-md bg-slate-400 dark:bg-slate-700   w-[40px] h-[40px] rounded-full ml-3`} alt="" ></div>

                            <div className='  animate-pulse flex flex-col  h-14'>
                                <span className=' self-start ml-3 font-semibold mt-3 rounded-md bg-slate-400 dark:bg-slate-700  h-3 w-14'></span>
                                <span className=' ml-5 mb-4 text-xs bg-slate-400 rounded-md dark:bg-slate-700  h-3 w-24 mt-1 '></span>
                            </div>

                        </div>




                        <div className='  animate-pulse mr-5 w-9 rounded-md h-5 bg-slate-400 dark:bg-slate-700 '></div>






                    </div>


                </div>
                {/* Body */}

                <div className={` flex items-center justify-center flex-col  text-xl dark:bg-slate-800 dark:text-white`}>

                    <div className=' w-full h-[200px]' alt="" >
                        <div className=' w-[80%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        <div className=' w-[50%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        <div className=' w-[20%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        <div className=' w-[80%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        <div className=' w-[50%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        <div className=' w-[70%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                    </div>

                    <span className=' self-start mx-3 my-2 text-md '>
                        <div></div>
                    </span>

                </div>
                {/* footer */}

                <div className=' h-8 w-full  border-t-[1px] border-slate-500/30  dark:bg-slate-800 rounded-b-md flex items-center justify-between'>
                    <div className='flex  animate-pulse'>


                        <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                        <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                    </div>

                    <div className='  animate-pulse mr-2 bg-slate-400 dark:bg-slate-700  w-4 h-5 ml-2 rounded-md ' ></div>

                </div>



            </div>
                <div className=' shadow-md rounded-lg my-10 mx-auto w-[95%] max-w-[500px]  bg-white'>
                    {/* header */}
                    <div className=' w-full h-14  dark:bg-slate-800  rounded-t-md flex items-center dark:text-white'>

                        <div className='  animate-pulse border-b-[1px] border-slate-500/30 flex flex-row items-center justify-between w-full'>


                            <div className='  flex h-full  items-center'>

                                <div className={` shadow-md bg-slate-400 dark:bg-slate-700   w-[40px] h-[40px] rounded-full ml-3`} alt="" ></div>

                                <div className='  animate-pulse flex flex-col  h-14'>
                                    <span className=' self-start ml-3 font-semibold mt-3 rounded-md bg-slate-400 dark:bg-slate-700  h-3 w-14'></span>
                                    <span className=' ml-5 mb-4 text-xs bg-slate-400 rounded-md dark:bg-slate-700  h-3 w-24 mt-1 '></span>
                                </div>

                            </div>




                            <div className='  animate-pulse mr-5 w-9 rounded-md h-5 bg-slate-400 dark:bg-slate-700 '></div>






                        </div>


                    </div>
                    {/* Body */}

                    <div className={` flex items-center justify-center flex-col  text-xl dark:bg-slate-800 dark:text-white`}>

                        <div className=' w-full h-[100px]' alt="" >
                            <div className=' w-[80%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                            <div className=' w-[50%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                            <div className=' w-[20%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        </div>

                        <span className=' self-start mx-3 my-2 text-md '>
                            <div></div>
                        </span>

                    </div>
                    {/* footer */}

                    <div className=' h-8 w-full  border-t-[1px] border-slate-500/30  dark:bg-slate-800 rounded-b-md flex items-center justify-between'>
                        <div className='flex  animate-pulse'>


                            <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                            <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                        </div>

                        <div className='  animate-pulse mr-2 bg-slate-400 dark:bg-slate-700  w-4 h-5 ml-2 rounded-md ' ></div>

                    </div>



                </div>
                <div className=' shadow-md rounded-lg my-10 mx-auto w-[95%] max-w-[500px]  bg-white'>
                    {/* header */}
                    <div className=' w-full h-14  dark:bg-slate-800  rounded-t-md flex items-center dark:text-white'>

                        <div className='  animate-pulse border-b-[1px] border-slate-500/30 flex flex-row items-center justify-between w-full'>


                            <div className='  flex h-full  items-center'>

                                <div className={` shadow-md bg-slate-400 dark:bg-slate-700   w-[40px] h-[40px] rounded-full ml-3`} alt="" ></div>

                                <div className='  animate-pulse flex flex-col  h-14'>
                                    <span className=' self-start ml-3 font-semibold mt-3 rounded-md bg-slate-400 dark:bg-slate-700  h-3 w-14'></span>
                                    <span className=' ml-5 mb-4 text-xs bg-slate-400 rounded-md dark:bg-slate-700  h-3 w-24 mt-1 '></span>
                                </div>

                            </div>




                            <div className='  animate-pulse mr-5 w-9 rounded-md h-5 bg-slate-400 dark:bg-slate-700 '></div>






                        </div>


                    </div>
                    {/* Body */}

                    <div className={` flex items-center justify-center flex-col  text-xl dark:bg-slate-800 dark:text-white`}>

                        <div className=' w-full h-[100px]' alt="" >
                            <div className=' w-[80%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                            <div className=' w-[50%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                            <div className=' w-[20%] h-5 bg-slate-400 dark:bg-slate-700  m-3 rounded-md animate-pulse'></div>
                        </div>

                        <span className=' self-start mx-3 my-2 text-md '>
                            <div></div>
                        </span>

                    </div>
                    {/* footer */}

                    <div className=' h-8 w-full  border-t-[1px] border-slate-500/30  dark:bg-slate-800 rounded-b-md flex items-center justify-between'>
                        <div className='flex  animate-pulse'>


                            <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                            <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                        </div>

                        <div className='  animate-pulse mr-2 bg-slate-400 dark:bg-slate-700  w-4 h-5 ml-2 rounded-md ' ></div>

                    </div>



                </div>
                <div className=' shadow-md rounded-lg my-10 mx-auto w-[95%] max-w-[500px]  bg-white'>
                    {/* header */}
                    <div className=' w-full h-14  dark:bg-slate-800  rounded-t-md flex items-center dark:text-white'>

                        <div className='  animate-pulse border-b-[1px] border-slate-500/30 flex flex-row items-center justify-between w-full'>


                            <div className='  flex h-full  items-center'>

                                <div className={` shadow-md bg-slate-400 dark:bg-slate-700   w-[40px] h-[40px] rounded-full ml-3`} alt="" ></div>

                                <div className='  animate-pulse flex flex-col  h-14'>
                                    <span className=' self-start ml-3 font-semibold mt-3 rounded-md bg-slate-400 dark:bg-slate-700  h-3 w-14'></span>
                                    <span className=' ml-5 mb-4 text-xs bg-slate-400 rounded-md dark:bg-slate-700  h-3 w-24 mt-1 '></span>
                                </div>

                            </div>




                            <div className='  animate-pulse mr-5 w-9 rounded-md h-5 bg-slate-400 dark:bg-slate-700 '></div>






                        </div>


                    </div>
                    {/* Body */}

                    <div className={` flex items-center justify-center flex-col  text-xl dark:bg-slate-800 dark:text-white`}>

                        <div className=' w-full h-[250px]' alt="" >
                            <div className=' w-[95%] h-full bg-slate-400 dark:bg-slate-700 mx-auto  my-3 rounded-md animate-pulse'></div>
                        </div>

                        <span className=' self-start mx-3 my-2 text-md '>
                            <div></div>
                        </span>

                    </div>
                    {/* footer */}

                    <div className=' h-8 w-full  border-t-[1px] border-slate-500/30  dark:bg-slate-800 rounded-b-md flex items-center justify-between'>
                        <div className='flex  animate-pulse'>


                            <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                            <div className=' bg-slate-400 dark:bg-slate-700  w-6 h-5 ml-2 rounded-md ' ></div>
                        </div>

                        <div className='  animate-pulse mr-2 bg-slate-400 dark:bg-slate-700  w-4 h-5 ml-2 rounded-md ' ></div>

                    </div>



                </div></></>)
        }
    }, [posts]);


    const getmoredata = async () => {
        const postslist = []
        if (mode == 'home') {


            const next = query(collection(db, "posts"), where('posterId', 'in', userdata.following), orderBy('timeStamp'), startAfter(lastVisible), limit(20))

            const documentSnapshots = await getDocs(next);
            setplaceholders('')
            if (lastVisible != documentSnapshots.docs[documentSnapshots.docs.length - 1]) {

                documentSnapshots.forEach((doc) => {
                    postslist.push(doc.data());
                })

                const newposts = posts.concat(postslist)
                setposts(newposts)

                setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
            }
        }


        else if (mode == 'explore') {
            const next = query(collection(db, "posts"), orderBy('timeStamp'), startAfter(lastVisible), limit(20))

            const documentSnapshots = await getDocs(next);
            setplaceholders('')
            if (lastVisible != documentSnapshots.docs[documentSnapshots.docs.length - 1]) {

                documentSnapshots.forEach((doc) => {
                    postslist.push(doc.data());
                })

                const newposts = posts.concat(postslist)
                setposts(newposts)

                setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
            }
        }


        else if (mode == 'myProfile') {
            const next = query(collection(db, "posts"), where('posterId', '==', user.uid), orderBy('timeStamp'), startAfter(lastVisible), limit(20))

            const documentSnapshots = await getDocs(next);
            setplaceholders('')
            if (lastVisible != documentSnapshots.docs[documentSnapshots.docs.length - 1]) {

                documentSnapshots.forEach((doc) => {
                    postslist.push(doc.data());
                })

                const newposts = posts.concat(postslist)
                setposts(newposts)

                setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
            }
        }
        else if (mode == 'fav') {
            if (userdata) {
                const next = query(collection(db, "posts"), where('postId', 'in', userdata.favourites), orderBy('timeStamp'), startAfter(lastVisible), limit(20))

                const documentSnapshots = await getDocs(next);

                if (lastVisible != documentSnapshots.docs[documentSnapshots.docs.length - 1]) {

                    documentSnapshots.forEach((doc) => {
                        postslist.push(doc.data());
                    })

                    const newposts = posts.concat(postslist)
                    setposts(newposts)

                    setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
                    setplaceholders('')
                }
            }
        }
        else {
            if (mode) {
                const next = query(collection(db, "posts"), where('posterId', '==', mode), orderBy('timeStamp'), startAfter(lastVisible), limit(20))

                const documentSnapshots = await getDocs(next);
                setplaceholders('')
                if (lastVisible != documentSnapshots.docs[documentSnapshots.docs.length - 1]) {

                    documentSnapshots.forEach((doc) => {
                        postslist.push(doc.data());
                    })

                    const newposts = posts.concat(postslist)
                    setposts(newposts)

                    setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
                }
            }

        }
    }

    const getalldata = async () => {

        const postslist = []

        if (mode == 'home') {

            if (userdata) {

                if (userdata.following != '') {

                    const first = query(collection(db, "posts"), where('posterId', 'in', userdata.following), limit(20));





                    const documentSnapshots = await getDocs(first)

                    setplaceholders('')

                    setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])


                    documentSnapshots.forEach((doc) => {
                        postslist.push(doc.data());
                    })
                    setposts(postslist)
                } else {
                    setplaceholders('')
                    setnofr(<span className=' mt-20 text-xl dark:text-white'>You are not following anyone</span>)

                }
            }



        }

        else if (mode == 'explore') {

            const first = query(collection(db, "posts"), orderBy('timeStamp'), limit(20));
            const documentSnapshots = await getDocs(first)
            setplaceholders('')
            setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])


            documentSnapshots.forEach((doc) => {
                postslist.push(doc.data());
            })
            setposts(postslist)
        }

        else if (mode == 'myProfile') {
            if (userdata) {
                if (userdata.posts != '') {
                    const first = query(collection(db, "posts"), where('posterId', '==', user.uid), orderBy('timeStamp'), limit(20));
                    const documentSnapshots = await getDocs(first)
                    setplaceholders('')
                    setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])


                    documentSnapshots.forEach((doc) => {
                        postslist.push(doc.data());
                    })
                    setposts(postslist)
                } else {
                    setnofr(<span className=' mt-20 text-xl dark:text-white'>No posts</span>)
                    setplaceholders('')
                }
            }
        }
        else if (mode == 'fav') {

            if (userdata) {
                if (userdata.favourites) {
                    if (userdata.favourites != '') {
                        const first = query(collection(db, "posts"), where('postId', 'in', userdata.favourites), orderBy('timeStamp'), limit(20));
                        const documentSnapshots = await getDocs(first)
                        setplaceholders('')
                        setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])


                        documentSnapshots.forEach((doc) => {
                            postslist.push(doc.data());
                        })
                        setposts(postslist)
                    } else {
                        setnofr(<span className=' text-xl dark:text-white'>You have no saved items</span>)
                        setplaceholders('')
                    }
                }
            }
        }

        else {
            if (mode) {
                const first = query(collection(db, "posts"), where('posterId', '==', mode), orderBy('timeStamp'), limit(20));
                const documentSnapshots = await getDocs(first)
                setplaceholders('')
                if (documentSnapshots.docs != '') {
                    setlastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])


                    documentSnapshots.forEach((doc) => {
                        postslist.push(doc.data());
                    })
                    setposts(postslist)
                } else {
                    setnofr(<span className=' mt-20 text-xl dark:text-white'>No posts</span>)
                    setplaceholders('')
                }
            }
        }


    }

    useEffect(() => {
        getalldata()
    }, [userdata]);

    useEffect(() => {
        getuserdata()

    }, []);

    const deltepost = async (post) => {

        const myposts = doc(db, "users", user.uid)
        await deleteDoc(doc(db, "posts", post.postId))
        await updateDoc(myposts, { posts: arrayRemove(post.postId), favourites: arrayRemove(post.postId) })

        showUpdates()


    }


    const showUpdates = async () => {

        if (lastVisible) {

            if (mode == 'explore') {
                const q = query(collection(db, "posts"), orderBy('timeStamp'), endAt(lastVisible));

                const documentSnapshot = await getDocs(q)

                setplaceholders('')
                const postlists = [];
                documentSnapshot.forEach((doc) => {
                    postlists.push(doc.data());

                })
                setposts(postlists);


            } else if (mode == 'home') {
                const q = query(collection(db, "posts"), where('posterId', 'in', userdata.following), orderBy('timeStamp'), endAt(lastVisible));
                const documentSnapshot = await getDocs(q)
                setplaceholders('')
                const postlists = [];
                documentSnapshot.forEach((doc) => {
                    postlists.push(doc.data());

                })
                setposts(postlists);


            } else if (mode == 'myProfile') {
                const q = query(collection(db, "posts"), where('posterId', '==', user.uid), orderBy('timeStamp'), endAt(lastVisible));
                const documentSnapshot = await getDocs(q)
                setplaceholders('')
                const postlists = [];
                documentSnapshot.forEach((doc) => {
                    postlists.push(doc.data());

                })
                setposts(postlists);


            }
            else if (mode == 'fav') {
                if (userdata) {
                    if (userdata.favourites) {
                        if (userdata.favourites != '') {
                            const q = query(collection(db, "posts"), where('postId', 'in', userdata.favourites), orderBy('timeStamp'), endAt(lastVisible));
                            const documentSnapshot = await getDocs(q)
                            setplaceholders('')
                            const postlists = [];
                            documentSnapshot.forEach((doc) => {
                                postlists.push(doc.data());

                            })
                            setposts(postlists);
                            setplaceholders('')
                        } else {
                            setnofr(<span className=' text-xl dark:text-white'>You have no saved items</span>)
                            setplaceholders('')
                        }
                    } else {
                        setnofr(<span className=' text-xl dark:text-white'>You have no saved items</span>)
                        setplaceholders('')
                    }
                } else {
                    setnofr(<span className=' text-xl dark:text-white'>You have no saved items</span>)
                    setplaceholders('')
                }
            }
            else {
                if (mode) {
                    const q = query(collection(db, "posts"), where('posterId', '==', mode), orderBy('timeStamp'), endAt(lastVisible));
                    const documentSnapshot = await getDocs(q)
                    setplaceholders('')
                    const postlists = [];
                    documentSnapshot.forEach((doc) => {
                        postlists.push(doc.data());

                    })
                    setposts(postlists);


                }
            }




        }
    }


    useEffect(() => {

        if (lastVisible) {
            const q = query(collection(db, "posts"), endAt(lastVisible));

            onSnapshot(q, (querySnapshot) => {
                showUpdates()
            })
        }




    }, [lastVisible]);





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


    const likecomment = async (ele, thepost, comment) => {

        const newcom = comment
        const postid = thepost.postId
        const post = doc(db, "posts", postid)

        newcom.likedby.push(user.uid)



        if (ele.className == 'fa-solid fa-heart text-xl mx-3 text-red-600   cursor-pointer love') {

            ele.className = "fa-regular fa-heart text-xl mx-3 dark:text-white   cursor-pointer love"

            // await updateDoc(post, {
            //     comments: arrayRemove(user.uid)
            // })
            // showUpdates()

        } else {
            ele.className = 'fa-solid fa-heart text-xl mx-3 text-red-600   cursor-pointer love'
            // await updateDoc(post, {
            //     "comments.likedby": arrayUnion(user.uid)
            // })
            // showUpdates()
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
            }
            else {
                await updateDoc(me, {
                    favourites: arrayUnion(postId)
                })
                getuserdata()
                showUpdates()
            }

        } else {
            await updateDoc(me, {
                favourites: arrayUnion(postId)
            })
            getuserdata()
            showUpdates()
        }

    }

    const gotoprof = (Id) => {
        sessionStorage.setItem('otherprofile', Id)
        navigate('/otherprofile')
    }

    const sendComment = async (e, post) => {
        e.preventDefault()
        if (e.target.commentBody.value) {

            const comment = {
                body: e.target.commentBody.value,
                img: user.image,
                commenterName: user.name,
                commenterId: user.uid,
                likedby: []
            }

            const washingtonRef = doc(db, "posts", post.postId);

            await updateDoc(washingtonRef, {
                comments: arrayUnion(comment)
            })
            e.target.commentBody.value = ''
            showUpdates()
        }
    }




    const deletecomment = async (post, comment) => {
        const washingtonRef = doc(db, "posts", post.postId);

        await updateDoc(washingtonRef, {
            comments: arrayRemove(comment)
        })
        showUpdates()

    }

    const savepostchanges = async () => {



        if (edttxt.current.value != '') {
            setloadic(<i className="fa-solid fa-circle-notch animate-spin text-lg text-white"></i>)
            const washingtonRef = doc(db, "posts", editpostl.postId);
            await updateDoc(washingtonRef, {
                postBody: edttxt.current.value
                , name: user.name,
                image: user.image
            });
            seteditpostl()
            showUpdates()
            setloadic()
        }
    }


    return (
        <div className=' pb-48'>










            <div id='yes' onClick={(e) => e.target.id == 'yes'&&seteditpostl()} className={`z-10 fixed top-0 bottom-0 left-0 right-0 bg-glass flex  justify-center`} style={editpostl ? { 'display': 'flex' } : { 'display': 'none' }}>

                <div  className=' mt-14 h-fit pb-5 z-40 w-[90%] max-w-[600px]  bg-white dark:bg-black  rounded-2xl  '>
                    <XMarkIcon id='yes' className=' mx-2 my-2 w-6 h-6 dark:text-white cursor-pointer' />

                    <div className='h-full flex flex-col items-center  w-full ml-1'>
                        <div className=' self-start ml-3 mt-5 flex  h-fit items-center'>
                            <img src={user.image} alt="" className=' border-[1px] border-black dark:border-white rounded-full w-10 h-10 ' />
                            <div className=' font-semibold ml-2 dark:text-white'>{user.name}</div>
                        </div>
                        <textarea ref={edttxt} placeholder="What's in your mind" className=' font-semibold text-xl bg-transparent  w-[85%] outline-none mt-5  min-h-[150px] max-h-[150px] dark:text-white' />



                        {editpostl && <div>
                            {editpostl.media.type && <Fragment>
                                {editpostl.media.type == 'img' ? <img src={editpostl.media.file} className='media rounded-md mx-auto' alt="" />
                                    : <video controls src={editpostl.media.file} className='media rounded-md mx-auto' alt="" />}

                            </Fragment>

                            }
                        </div>}

                        <div className='w-[90%] bg-black/30 dark:bg-slate-200/30 my-3 h-[1px] mx-auto rounded-md'></div>



                        <div className='  w-[90%] h-[40px]  items-center flex justify-end'>




                            <button onClick={() => savepostchanges()} className={`bn632-hover bn25`}>{loadic}</button>
                        </div>
                    </div>
                </div>
            </div>




            {posts.map(post =>
                <div key={Math.random()} className=' shadow-md  my-10 mx-auto w-[95%] max-w-[500px] '>
                    {/* header */}
                    <div className=' w-full h-14 bg-slate-100  dark:bg-slate-800  rounded-t-md flex items-center dark:text-white'>

                        <div className=' border-b-[1px] border-slate-500/30 flex flex-row items-center justify-between w-full'>


                            <div onClick={() => { post.posterId == user.uid ? navigate('/profile') : gotoprof(post.posterId) }} className=' cursor-pointer flex h-full  items-center'>

                                <img src={post.image} className={` shadow-md  w-[40px] h-[40px] rounded-full ml-3`} alt="" />
                                <div className=' flex flex-col  h-14'>
                                    <span className=' self-start ml-3 font-semibold mt-3'>{post.name}</span>
                                    <span className=' ml-5 mb-4 text-xs'>{post.postTime}</span>
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

                                                                onClick={(e) => deltepost(post)}
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

                                                                onClick={() => {
                                                                    seteditpostl(post)

                                                                    edttxt.current.value = post.postBody
                                                                }}
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

                    <div className={` flex items-center justify-center flex-col bg-slate-100   text-xl dark:bg-slate-800 dark:text-white`}>
                        {
                            post.media.type && post.media.type == 'img' ? <img src={post.media.file} className=' w-full max-h-[430px]' alt="" /> : post.media.type == 'vid' ? <video src={post.media.file} controls className=' w-full max-h-[430px]' /> : ''
                        }
                        <span className=' self-start mx-3 my-2 text-md w-full h-fit  break-words pr-7 max-h-[430px] overflow-scroll'>
                            {post.postBody}

                        </span>

                    </div>

                    {/* footer */}

                    <div className=' h-8 w-full  border-y-[1px] border-slate-500/30  dark:bg-slate-800 bg-slate-100  flex items-center justify-between'>
                        <div>
                            <i className={post.likedby.includes(user.uid) ? 'fa-solid fa-heart text-xl mx-3 text-red-600   cursor-pointer love' : 'fa-regular fa-heart text-xl mx-3 dark:text-white   cursor-pointer love'} onClick={(e) => likepost(e.target, post.postId)}></i>




                        </div>

                        <div>
                            <span className=' mr-2 dark:text-white'>{post.likedby.length} likes</span>
                            <span className=' mr-2 dark:text-white'>{post.comments.length} comment</span>

                        </div>
                    </div>

                    <Disclosure>
                        <Disclosure.Button className=' w-full h-0 flex'>
                            <ChatBubbleLeftRightIcon className=' dark:text-white relative bottom-[27px] left-12 cursor-pointer hover:text-red-600 w-6 h-6 inline ' />

                        </Disclosure.Button>
                        <Disclosure.Panel className=" bg-slate-100 relative dark:bg-slate-800 py-5 overflow-y-scroll max-h-[200px]">
                            {post.comments != '' ? post.comments.map(comment =>

                                <div key={Math.random()} className='w-[95%] min-h-[100px] py-5 mx-auto flex my-3'>

                                    <img onClick={() => { comment.commenterId == user.uid ? navigate('/profile') : gotoprof(comment.commenterId) }} src={comment.img} className=' w-[40px] h-[40px] bg-black rounded-full mx-0.5' />

                                    <div onClick={() => { comment.commenterId == user.uid ? navigate('/profile') : gotoprof(comment.commenterId) }} className=' absolute ml-16 dark:text-white'>{comment.commenterName.length > 10 ? comment.commenterName.slice(0, 8) + '..' : comment.commenterName}</div>

                                    {comment.commenterId == user.uid && <Menu as="div" className=" text-left w-fit h-fit p-1">
                                        <div>
                                            <Menu.Button className='flex items-center '>

                                                <i className=" absolute mly  mt-5 dark:text-white  fa-solid fa-ellipsis mr-5 py-1 px-3 rounded-md cursor-pointer transition-all hover:bg-black/20"></i>


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
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-30 origin-top-right divide-y divide-gray-100 rounded-md dark:divide-black dark:bg-slate-800 bg-white shadow-lg ring-1 ring-black ring-opacity-5  border-[0.5px] border-slate-600/30 focus:outline-none">
                                                <div className="py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <p

                                                                onClick={() => deletecomment(post, comment)}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                                                                    'block px-4 py-2 text-sm  cursor-pointer'
                                                                )}
                                                            >

                                                                delete comment


                                                            </p>
                                                        )}
                                                    </Menu.Item>
                                                </div>




                                            </Menu.Items>
                                        </Transition>
                                    </Menu>}

                                    <div className=' dark:text-white flex items-center    justify-center w-[90%] bg-slate-300 pt-8  dark:bg-slate-700 rounded-md'>

                                        <p className=' break-words w-[90%] h-[90%] px-1  py-0.5 pb-4 self-start  max-h-[200px] overflow-y-scroll'>
                                            {comment.body}
                                        </p>






                                    </div>

                                </div>) : <div className='  dark:text-white'>No comments</div>}

                        </Disclosure.Panel>
                    </Disclosure>
                    <form onSubmit={e => sendComment(e, post)} className=' flex justify-around items-center rounded-b-lg w-full py-3 dark:bg-slate-800 bg-slate-100'>
                        <input name='commentBody' type="text" placeholder=' write a comment' className=' ml-2 outline-none py-1 px-2 w-[85%] rounded-lg dark:bg-slate-600 dark:text-white bg-slate-200' />
                        {/* <button type='submit' className=' bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-2 rounded-md mx-1'>Post</button> */}
                   
                        <button type='submit' className="relative inline-flex items-center justify-center py-0.5  mx-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                            <span className="relative px-3 py-1 transition-all ease-in duration-100 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 ">
                            Post
                             </span>
                        </button>
                    </form>


                </div>


            )
            }




            {placeholders}

            <br />
            <br />
            {nofr}












































        </div >
    )
}

export default List;
