

import React from 'react';
import Headder from './Headder';
import Menu from './Menu';
import Restaurantlist from './Restaurantlist';
import Footer from './Footer';
import Offers from './Offers';

const Main: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#f5f7fa] via-[#f0f4f8] to-[#e4e8ed] min-h-screen">
     
      <Headder />

     
      <div className="container mx-auto px-6 md:px-16 lg:px-20">
     
        <div className="mt-10">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-6">
            Best Offers For You
          </h1>
          <Offers />
        </div>

        <div className="mt-14">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-6">
            What's in your mind?
          </h1>
          <Menu />
        </div>

   
        <div className="mt-14">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-6">
            Restaurants with online food delivery in your location
          </h1>
          <Restaurantlist />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Main;
