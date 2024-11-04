import React, { useState } from 'react';
import Headder from './Headder';
import Menu from './Menu';
import Restaurantlist from './Restaurantlist';
import Footer from './Footer';
import Offers from './Offers';


const Main: React.FC = () => {
  
  
  return (
    <div>
      <Headder/>
      <div  className='ml-44 w-8/12'>
      <h1 className='mt-7 font-bold text-2xl'>Best Offers For You</h1>
      <Offers/>
        <h1 className='mt-7 font-bold text-2xl'>Whats's in your mind?</h1>
      <Menu/>  
      </div>

      <div  className='ml-44 w-9/12' >
      <h1 className='mt-7 font-bold text-2xl'>Restaurants with online food delivery in Location</h1>
      <Restaurantlist />
      </div>
      <Footer/>
     
    
    </div>
  );
};

export default Main;