

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Menu from './Menu';
import Headder from './Headder';
import Footer from './Footer';
import { addToCart } from '../../actions/cartAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuthConfig } from '../../Apiconfig';
import api from '../../Api';
import { FaShoppingCart } from 'react-icons/fa';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filter, setFilter] = useState<string>('All');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchDetails = async (page = 1) => {
      try {
        const restaurantResponse = await api.get(`http://localhost:5000/api/users/restaurant/${id}`);
        setRestaurant(restaurantResponse.data);

        const foodItemsResponse = await api.get(`http://localhost:5000/api/users/fooditems?restaurant=${id}&page=${page}&limit=10`);
        
        setFoodItems(foodItemsResponse.data.foodItems);
        setPagination({
          currentPage: foodItemsResponse.data.pagination.currentPage,
          totalPages: foodItemsResponse.data.pagination.totalPages,
        });
      } catch (error) {
        console.error('Error fetching restaurant or food items:', error);
      }
    };

    fetchDetails(pagination.currentPage);
  }, [id, pagination.currentPage]);

  const handleAddToCart = (item: any) => {
    if (user) {
      dispatch(addToCart(item, user?.id) as any);
      toast.success(`${item.name} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('Please log in to add items to your cart', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleReportRestaurant = async () => {
    try {
      if (user) {
        await api.post(`http://localhost:5000/api/users/report/${id}`, { userId: user });
        toast.success('Restaurant reported successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Please log in to report this restaurant', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error reporting restaurant:', error);
      toast.error('Failed to report the restaurant');
    }
  };

  const handleChatWithRestaurant = () => {
    if (user) {
      navigate(`/chat/${id}`);
    } else {
      toast.error('Please log in to start chatting with the restaurant');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const filteredFoodItems = foodItems.filter((item) => {
    if (filter === 'All') {
      return true;
    }
    return item.foodType === filter;
  });

  return (
    <>
      <Headder />
      <div className="container mx-auto p-4">
        {restaurant && (
          <div className="flex flex-col md:flex-row mb-6 bg-white shadow-lg rounded-lg p-4">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <img
                className="w-full h-48 object-cover rounded-lg"
                src={restaurant.avatar}
                alt={restaurant.restaurantName}
              />
            </div>
            <div className="w-full md:w-2/3 md:pl-8 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{restaurant.restaurantName}</h1>
              <p className="text-gray-500 text-lg mb-4">{restaurant.address}</p>
              <p className="text-gray-600 mb-2">Contact: {restaurant.phoneNumber}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleReportRestaurant}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Report Restaurant
                </button>
                <button
                  onClick={handleChatWithRestaurant}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Chat with Restaurant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setFilter('All')}
            className={`px-6 py-3 rounded-lg ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Veg')}
            className={`px-6 py-3 rounded-lg ${filter === 'Veg' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Veg
          </button>
          <button
            onClick={() => setFilter('Non-Veg')}
            className={`px-6 py-3 rounded-lg ${filter === 'Non-Veg' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Non-Veg
          </button>
        </div>

        {/* Food Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFoodItems.length > 0 ? (
            filteredFoodItems.map((item) => (
              <div key={item._id} className="bg-white border rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#FF6347]">
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-500 ease-in-out"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">Price: Rs.{item.price}</p>
                  <p className="text-gray-600 text-sm mb-4">Quantity: {item.quantity}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full px-4 py-2 bg-[#FF6347] text-white rounded-full transition-colors duration-300 hover:bg-[#FF4500]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-lg text-gray-500">No food items available</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-6 py-3 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-6 py-3 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Floating Cart Button */}
        <div
          className="fixed bottom-8 right-8 bg-[#FF6347] p-4 rounded-full text-white shadow-xl hover:bg-[#FF4500] transition-all duration-300 cursor-pointer"
          onClick={() => navigate('/cart')}
        >
          <FaShoppingCart size={24} />
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default RestaurantDetail;
