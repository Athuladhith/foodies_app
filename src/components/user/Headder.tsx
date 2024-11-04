import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../Api';
import logo from '../../images/foodapp.webp';
import lens from '../../images/search.png';
import profile from '../../images/profileicon.webp';
import cart from '../../images/cart.jpg';
import { RootState } from '../../store';
import{getAuthConfig} from '../../Apiconfig'

const Headder: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]); // State to hold filtered restaurants
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]); // State to hold all restaurant data

  useEffect(() => {
    // Fetch all restaurants from the server when the component mounts
    const fetchRestaurants = async () => {
      try {

        const response = await api.get('http://localhost:5000/api/admin/restaurants',); // Replace with your API endpoint
        console.log('Fetched restaurants:', response.data); // Log the data received from the backend
        setAllRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Log the current state of allRestaurants
    console.log('All restaurants:', allRestaurants);

    // Filter restaurants based on the search query
    if (searchQuery.trim() === '') {
      setFilteredRestaurants([]);
    } else {
      const filtered = allRestaurants.filter((restaurant: any) =>
        // Check if restaurant.restaurantName exists and is a string
        restaurant?.restaurantName?.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      console.log('Filtered restaurants:', filtered); // Log the filtered results
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, allRestaurants]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenss');
    localStorage.removeItem('user');
    navigate('/login');
     window.location.reload();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md">
      {/* Left Section: Logo and Location */}
      <div className="flex items-center justify-between md:justify-start w-full md:w-auto mb-4 md:mb-0">
        <Link to="/home" className="flex items-center">
          <img src={logo} className="w-12 h-12 sm:w-16 sm:h-16 mr-4 cursor-pointer" alt="Logo" />
        </Link>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
          <span className="text-sm sm:text-lg font-medium">Others</span>
          <div className="flex items-center ml-0 md:ml-4">
            <span className="text-sm sm:text-lg font-medium">Location</span>
            <img src={lens} className="w-3 h-3 sm:w-4 sm:h-4 ml-2" alt="Arrow Icon" />
          </div>
        </div>
      </div>

      {/* Middle Section: Search */}
      <div className="relative flex items-center w-full md:w-auto mb-4 md:mb-0">
        <img src={lens} className="w-4 h-4 sm:w-5 sm:h-5 mr-2" alt="Search Icon" />
        <input
          type="text"
          placeholder="Search for restaurants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
          className="w-full md:w-auto border rounded-lg py-1 px-3 focus:outline-none focus:border-gray-500"
        />
        {/* Display filtered restaurant names */}
        {searchQuery && filteredRestaurants.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
            {filteredRestaurants.map((restaurant) => (
              <li
                key={restaurant._id}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  navigate(`/restaurant/${restaurant._id}`);
                  setSearchQuery(''); // Clear the search query after selection
                }}
              >
                {restaurant.restaurantName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Section: Profile, Cart, and SignOut */}
      <div className="flex items-center space-x-4">
        {/* Cart Section */}
        <Link to="/cart" className="relative flex items-center space-x-1 hover:text-blue-600 transition duration-200">
          <img src={cart} className="w-5 h-5 sm:w-7 sm:h-7" alt="Cart Icon" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {itemCount}
            </span>
          )}
          <span className="text-sm sm:text-lg font-medium">Cart</span>
        </Link>

        <Link to="/orders" className="relative flex items-center space-x-1 hover:text-blue-600 transition duration-200">
          <span className="text-sm sm:text-lg font-medium">Orders</span>
        </Link>

        {/* Profile and SignOut Section */}
        <div className="flex items-center space-x-1">
          <img
            src={profile}
            className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer"
            alt="Profile Icon"
            onClick={handleProfileClick}
          />
          <button
            className="text-sm sm:text-lg font-medium"
            onClick={handleLogout}
          >
            SignOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Headder;
