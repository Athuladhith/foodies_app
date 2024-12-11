

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../Api';
import logo from '../../images/foodapp.webp';
import lens from '../../images/search.png';
import profile from '../../images/profileicon.webp';
import cart from '../../images/cart.jpg';
import { RootState } from '../../store';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('http://localhost:5000/api/admin/restaurants');
        setAllRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants([]);
    } else {
      const filtered = allRestaurants.filter((restaurant: any) =>
        restaurant?.restaurantName?.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, allRestaurants]);

  const handleLogout = () => {
    localStorage.removeItem('tokenss');
    localStorage.removeItem('user');
    localStorage.removeItem('userss');
    navigate('/login');
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 text-white">
        
        <div className="flex items-center space-x-4 animate-fade-in">
          <Link to="/home">
            <img src={logo} alt="Logo" className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform" />
          </Link>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-pink-200">Delivery to</span>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white">Your Location</span>
              <img src={lens} alt="Location" className="w-5 h-5" />
            </div>
          </div>
        </div>

  
        <div className="relative flex-1 max-w-lg mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for restaurants or dishes"
            className="w-full text-black bg-white border-2 border-pink-400 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {searchQuery && filteredRestaurants.length > 0 && (
            <ul className="absolute left-0 w-full text-black bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto z-10 shadow-lg">
              {filteredRestaurants.map((restaurant) => (
                <li
                  key={restaurant._id}
                  className="px-4 py-2 hover:bg-gery-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/restaurant/${restaurant._id}`);
                    setSearchQuery('');
                  }}
                >
                  {restaurant.restaurantName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center space-x-6">
       
          <Link
            to="/orders"
            className="text-sm font-medium hover:text-pink-300 hover:underline transition duration-300"
          >
            Orders
          </Link>

       
          <div className="relative">
            <Link to="/cart" className="flex items-center space-x-1">
              <img src={cart} alt="Cart" className="w-8 h-8 hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

   
          <div className="flex items-center space-x-4">
            <img
              src={profile}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer hover:ring-4 hover:ring-pink-300 transition duration-300"
              onClick={handleProfileClick}
            />
            <button
              onClick={handleLogout}
              className="text-sm font-medium bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full transition duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

