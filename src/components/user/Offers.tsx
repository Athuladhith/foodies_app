

import React from 'react';
import offer1 from '../../images/foodoffer.jpg';
import offer from '../../images/foodoffer2.jpg';

const Offers: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 py-10">
      <h2 className="text-4xl font-bold text-white text-center mb-6 animate-fade-in">
        Special Offers Just for You!
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 px-5 md:px-20">
        <div className="relative w-full md:w-5/12 h-64 group">
          <img
            src={offer}
            alt="Food Offer"
            className="w-full h-full rounded-3xl shadow-lg transform transition duration-300 group-hover:scale-105 group-hover:shadow-2xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 rounded-3xl">
            <p className="text-white text-lg font-medium text-center px-3">
              Get 20% off on your first order! Limited time offer.
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-5/12 h-64 group">
          <img
            src={offer1}
            alt="Food Offer 2"
            className="w-full h-full rounded-3xl shadow-lg transform transition duration-300 group-hover:scale-105 group-hover:shadow-2xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 rounded-3xl">
            <p className="text-white text-lg font-medium text-center px-3">
              Free delivery on orders above $50. Hurry now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
