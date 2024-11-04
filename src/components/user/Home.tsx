import React, { useEffect,useState } from 'react';
// import { getRestaurants, sortByRatings, sortByReviews, toggleVegOnly } from "../../actions/RestaurantAction";
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
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');

  // console.log(storedUser,'storeUser')
  //   if (storedUser) {
  //     console.log('User data from localStorage:', JSON.parse(storedUser));
  //   }
  // }, []);
  


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


  // const {
  //   loading: restaurantsLoading,
  //   error: restaurantsError,
  //   restaurants,
  //   showVegOnly,
  // } = useSelector((state: RootState) => state.restaurant);

  // useEffect(() => {
  //   if (restaurantsError) {
  //     return alert(restaurantsError); 
  //   }
  //   dispatch(getRestaurants(keyword) as any);
  // }, [dispatch, restaurantsError, keyword]);

  // const handleSortByRatings = () => {
  //   dispatch(sortByRatings() as any);
  // };

  // const handleSortByReviews = () => {
  //   dispatch(sortByReviews() as any);
  // };

  // const handleToggleVegOnly = () => {
  //   dispatch(toggleVegOnly() as any);
  // };
  // const handleLogout = () => {
   
  //   localStorage.removeItem('token');
    
  //   navigate('/login');
  //   window.location.reload();
  // };
  return (
   <>
<Main/>
  </>

  
    // <div>
    //   <Headder/>
    //    {/* <ButtonAppBar />
    // <div style={{display: "flex", width:'100%', justifyContent:"center", alignItems: "center", height: "100vh"}}>
    // <RecipeReviewCard /> 
   
    // </div> */}
    // </div>
  );
};

export default Home;
