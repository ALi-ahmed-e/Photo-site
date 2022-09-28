import './App.css';
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sign from './components/signin/Sign';
import { useSelector } from 'react-redux';
import Home from './components/Home/Home';
import Signup from './components/signup/Signup';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import Profile from './components/Profile/Profile';
import Navbar from './components/navbar/Navbar';
import Settings from './components/settings/Settings';
import Explore from './components/explore/Explore';
import Addpost from './components/Addnew/Addpost';
import Error from './components/error/Error';


function App() {
  const User = useSelector(state => state.auth.user)

  const [theme, settheme] = useState();

  useEffect(() => {
    if (User.theme == 'dark') {
      settheme('dark')
      document.body.style.backgroundColor = "#111827"

    }


    else if (User.theme == 'light') {
      document.body.style.backgroundColor = "rgb(226 232 240)"
      settheme('')
    }

    else if (User.theme == 'system') {

     if(window.matchMedia('(prefers-color-scheme:dark)').matches){
      document.body.style.backgroundColor = "#111827"
      settheme('dark')
      
     }
     else{
      document.body.style.backgroundColor = "rgb(226 232 240)"
      settheme('')
     }

    }
    
    else{
      if(window.matchMedia('(prefers-color-scheme:dark)').matches){
        document.body.style.backgroundColor = "#111827"
        settheme('dark')
        
       }else{
        document.body.style.backgroundColor = "rgb(226 232 240)"
        settheme('')
       }
    }

  }, []);

  const getuserdata = async () => {
    const docRef = doc(db, "users", JSON.parse(localStorage.getItem('user')).uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      localStorage.setItem('user', JSON.stringify(docSnap.data()))
      localStorage.setItem('theme', docSnap.data().theme)

    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    if (User) {
      getuserdata()
    }
  }, []);


  const CheckAuth = ({ children }) => {
    if (User) {
      return (children)
    } else {
      return <Navigate to='/signin' />
    }
  }
  const ChecknotAuth = ({ children }) => {
    if (User) {
      return <Navigate to='/' />
    } else {
      return (children)

    }
  }



  return (
    <div className={`App  ${theme}`}>
      <BrowserRouter>
        {User && <Navbar />}
        <Routes>
          <Route path='/' element={<CheckAuth><Home /></CheckAuth>} />
          <Route path='/profile' element={<CheckAuth><Profile /></CheckAuth>} />
          <Route path='/explore' element={<CheckAuth><Explore /></CheckAuth>} />
          {/* <Route path='/addpost' element={<CheckAuth><Addpost /></CheckAuth>} /> */}
          <Route path='/settings' element={<CheckAuth><Settings /></CheckAuth>} />
          <Route path='/signin' element={<ChecknotAuth><Sign /></ChecknotAuth>} />
          <Route path='/signup' element={<ChecknotAuth><Signup /></ChecknotAuth>} />
          <Route path='*' element={<Error />} />
         
        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
