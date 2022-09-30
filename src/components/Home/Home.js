import { signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../../firebase';
import List from '../list/List';
import Navbar from '../navbar/Navbar';

const Home = () => {



  return (
    <div>
      <List mode={'home'} />
    </div>
  )
}

export default Home