import React, { useEffect,useState } from 'react';

import Restaurant from "../user/Restaurant";
import Message from "../user/Message";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { RootState } from '../../store'; 

import Header from '../layout/Header';
import RecipeReviewCard from './Cards';
import ButtonAppBar from './Navbar';
import Headder from './Headder';
import { useNavigate } from 'react-router-dom';
import Main from './Main';
import { ObjectId } from 'bson';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams<{ keyword: string }>();
  const navigate = useNavigate();
  const [userid,setUserid]=useState<string>('')

  const{isAuthenticated,loading,error,user}=useSelector((state:RootState)=>state.auth)
  


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
  
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser); 
        setUserid(user._id); 
        console.log('User ID:', user.id);
        console.log('User Name:', user.name);
        console.log('User Email:', user.email);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);


  return (
   <>
<Main/>
  </>

  
   
  );
};

export default Home;
