import React, { useEffect, useState, Fragment } from 'react'
import { endAt, doc, collection, updateDoc, arrayUnion, arrayRemove, getDocs, limit, orderBy, query, startAfter, deleteDoc, onSnapshot, getDoc } from "firebase/firestore";
import { Menu, Transition } from '@headlessui/react'
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { ChatBubbleLeftRightIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import List from '../list/List';
const Explore = (x) => {
  return (<List mode={'explore'} />)
}

export default Explore;