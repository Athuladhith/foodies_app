import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className='bg-black w-screen h-52 mt-5 flex flex-col justify-center items-center'>
    <h1 className='font-extrabold text-2xl text-white'>Food Delivery App</h1>
    <h5 className='text-white font-semibold'>@ 2024 Food Technologies Pvt.Ltd</h5>
    </div>
  );
};

export default Footer;