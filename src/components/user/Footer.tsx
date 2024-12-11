

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; 

const Footer: React.FC = () => {
  return (
    <div className='bg-gradient-to-r from-gray-800 to-black w-full py-12'>
      <div className='max-w-screen-xl mx-auto text-center text-white'>
        <h1 className='font-extrabold text-3xl md:text-4xl mb-4'>
          Food Delivery App
        </h1>
        <h5 className='font-semibold text-lg mb-6'>
          @ 2024 Food Technologies Pvt. Ltd.
        </h5>
        
        
        <div className='flex justify-center gap-8 mb-8'>
          <a href="#" aria-label="Facebook" className='text-white hover:text-blue-500 transition-colors'>
            <FaFacebook size={24} />
          </a>
          <a href="#" aria-label="Twitter" className='text-white hover:text-blue-400 transition-colors'>
            <FaTwitter size={24} />
          </a>
          <a href="#" aria-label="Instagram" className='text-white hover:text-pink-500 transition-colors'>
            <FaInstagram size={24} />
          </a>
          <a href="#" aria-label="LinkedIn" className='text-white hover:text-blue-700 transition-colors'>
            <FaLinkedin size={24} />
          </a>
        </div>
        

        <div className="text-sm">
          <a href="#" className='hover:text-gray-400 mx-4 transition-colors'>Privacy Policy</a>
          <a href="#" className='hover:text-gray-400 mx-4 transition-colors'>Terms of Service</a>
          <a href="#" className='hover:text-gray-400 mx-4 transition-colors'>Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
