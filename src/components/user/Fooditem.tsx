

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchFoodItemsByCategory } from '../../actions/categoryAction';
import { addToCart } from '../../actions/cartAction';
import { RootState } from '../../store';
import Header from './Headder';
import Footer from './Footer';
import { FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const FoodItems: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch();
  const { foodItem } = useSelector((state: RootState) => state.restaurant);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchFoodItemsByCategory(categoryId) as any);
    }
  }, [categoryId, dispatch]);

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

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Delicious Food Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {foodItem.map((item: any) => (
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
          ))}
        </div>
      </div>

     
      <button className="fixed bottom-10 right-10 p-4 bg-[#FF6347] rounded-full shadow-lg hover:bg-[#FF4500]">
        <FaShoppingCart className="text-white text-2xl" />
      </button>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default FoodItems;
