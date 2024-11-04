import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchFoodItemsByCategory } from '../../actions/categoryAction';
import { addToCart } from '../../actions/cartAction';
import { RootState } from '../../store';
import Headder from './Headder';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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
      // Display the success toast notification
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
      <Headder />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Food Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {foodItem.map((item: any) => (
            <div key={item._id} className="border rounded-lg overflow-hidden shadow-md">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">Price: Rs.{item.price}</p>
                {/* <p className="text-gray-600">Quantity: {item.quantity}</p> */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </>
  );
};

export default FoodItems;
