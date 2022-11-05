import React, { Fragment, useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { addaction } from '../../store/reducers/addnewreducer'
import { useDispatch, useSelector } from 'react-redux'
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { subaddaction } from '../../store/reducers/submitadd';

const Addpost = () => {
  const dispatch = useDispatch()
  const { hide } = addaction
  const user = useSelector(state => state.auth.user)
  const postBody = useRef()
  const [txt, settxt] = useState();
  const [media, setmedia] = useState({ type: '', file: '' });
  const [spinner, setspinner] = useState('Post');
  const { subadd } = subaddaction
  const badwords = ["r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]
  const publicPost = async () => {
    let newval
    if (postBody.current.value || media.file) {
      badwords.map(word => {
        if (postBody.current.value.includes(word)) {

          newval = postBody.current.value.replace(word, '*'.repeat(word.length))
          postBody.current.value = newval


        }
      })
      

  
        setspinner(<><i className="fa-solid fa-circle-notch animate-spin text-lg text-white"></i></>)
        settxt()
        let pid = []
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i++) {

          pid.push(characters[Math.floor(Math.random() * 27)])
          pid.push(Math.floor(Math.random() * 9))
        }

        const data = {
          postBody: postBody.current.value ? postBody.current.value : '',
          name: user.name,
          image: user.image,
          timeStamp: serverTimestamp(),
          media: media ? media : 'no',
          postTime: Date().slice(0, 21),
          postId: pid.join(''),
          likedby: [],
          posterId: user.uid,
          comments: []
        }


        await setDoc(doc(db, "posts", pid.join('')), data)

        const userpostsarrref = doc(db, "users", user.uid)
        await updateDoc(userpostsarrref, {
          posts: arrayUnion(pid.join(''))
        });

        const action = hide()
        dispatch(action)
        setspinner('Post')
        dispatch(subadd(JSON.stringify(data)))
      

    }
  }


  useEffect(() => {
    postBody.current.focus()
  }, []);



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
    <div id='yes' onClick={(e) => e.target.id == 'yes' && dispatch(hide())} className=' z-10 fixed top-0 bottom-0 left-0 right-0 bg-glass flex  justify-center'>

      <div  className=' mt-14 h-fit pb-5 z-40 w-[90%] max-w-[600px]  bg-white dark:bg-black  rounded-2xl  '>
        <XMarkIcon  id='yes' className=' mx-2 my-2 w-6 h-6 dark:text-white cursor-pointer' />

        <div className='h-full flex flex-col items-center  w-full ml-1'>
          <div className=' self-start ml-3 mt-5 flex  h-fit items-center'>
            <img src={user.image} alt="" className=' border-[1px] border-black dark:border-white rounded-full w-10 h-10 ' />
            <div className=' font-semibold ml-2 dark:text-white'>{user.name}</div>
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
            {/* <button className={`px-3 py-1 ${txt ? ' opacity-100 hover:bg-indigo-600 cursor-pointer' : ' opacity-50 cursor-default'} ${txt} bg-indigo-500  text-white  rounded-md font-semibold mr-2`}>{spinner}</button> */}
            <button onClick={publicPost} className={`bn632-hover bn25 ${txt&& 'opacity-75'}`}>{spinner}</button>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Addpost
