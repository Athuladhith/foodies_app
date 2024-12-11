import React, { useState,useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {getAuthConfig} from '../../Apiconfig'
 import AddressForm from '../user/addressForm'; 
import { clearCartApi } from '../../actions/cartAction'; 
import Headder from './Headder';
import api from '../../Api'

interface CheckoutPageProps {}

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FoodItem {
  id: string;
  quantity: number;
}

interface OrderData {
  user: string;
  address: string;
  foodItems: FoodItem[];
  totalAmount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'cod';
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurant:string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  console.log(cartItems,'cartitemss')
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'cod'>('credit_card');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const [navigating, setNavigating] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as 'credit_card' | 'paypal' | 'cod');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      return;
    }
  
    const orderData: OrderData = {
      user: user.id,
      address: selectedAddress,
      foodItems: cartItems.map(item => ({
        id: item._id,
        quantity: item.quantity,
        restaurant:item.restaurant
      })),
      totalAmount: totalAmount,
      paymentMethod: paymentMethod
    };
  
    setIsLoading(true);
  
    try {
      if (paymentMethod === 'paypal') {
      
        const orderResponse = await api.post('http://localhost:5000/api/users/createOrder', {
          amount: totalAmount * 100,
          currency: 'INR',
          orderData,
        });
  
        const { orderId } = orderResponse.data;
  
        if (window.Razorpay) {
          
          const options = {
            key: 'rzp_test_PVHHgsU6rK1D5T',
            amount: totalAmount * 100,
            currency: 'INR',
            name: 'Your Company Name',
            order_id: orderId,
            handler: async (response: any) => {
              await api.post('http://localhost:5000/api/users/saveOrder', {
                paymentId: response.razorpay_payment_id,
                orderId: orderId,
                ...orderData,
              });
  
              await clearCart();
              navigate('/orderdetails', { state: { paymentId: response.razorpay_payment_id, paymentMethod: 'razorpay' } });
            },
            prefill: {
              name: 'Customer Name',
              email: 'customer@example.com',
            },
            theme: {
              color: '#3399cc',
            },
          };
  
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        }
      } else if (paymentMethod === 'cod') {
        const payid = crypto.randomUUID();
        
        const codOrderResponse = await api.post('http://localhost:5000/api/users/createOrder', {
          ...orderData,
          paymentMethod: 'COD',
          paymentId: payid
          
        });
  
        const { orderId } = codOrderResponse.data;
        await api.post('http://localhost:5000/api/users/saveOrder', {
          orderId: orderId,
          ...orderData,
          paymentId: payid
        });
  
        
        await clearCart();
        console.log('Navigating to orderdetails with COD');
      
        navigate('/orderdetails', { state: {paymentId:payid, orderId: orderId, paymentMethod: 'cod' } });
      } else {
        
        await api.post('http://localhost:5000/api/users/createOrder', orderData,);
  

        await clearCart();
        navigate('/orderdetails', { state: { paymentMethod: 'credit_card' } });
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };
  


  const clearCart = async () => {
    try {

      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      await clearCartApi(userId);


      localStorage.removeItem('cartItems');


    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  useEffect(() => {
    if (navigating) {
      console.log('Navigating to orderdetails');

      setNavigating(false);
    }
  }, [navigating]);
  return (
    <>
    <Headder />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
     
        <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Select Address</h2>
            <AddressForm setSelectedAddress={setSelectedAddress} />  
        </div>

      
        <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          <div className="border-b pb-4 mb-4">
            {cartItems.length === 0 ? (
              <p className="text-lg text-gray-600">No items in your cart.</p>
            ) : (
              <div>
                {cartItems.map((item: CartItem) => (
                  <div key={item._id} className="flex items-center space-x-4 py-4 border-b">
                    <img
                      src={`data:image/jpeg;base64,${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{item.name}</h2>
                      <p className="text-lg text-gray-700">
                        {item.quantity} x Rs.{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Select Payment Method</h2>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={handlePaymentMethodChange}
                />
                <span>Credit/Debit Card</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                />
                <span>PayPal</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={handlePaymentMethodChange}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Link
              to="/cart"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
            >
              Back to Cart
            </Link>
            <div className="text-xl font-bold">Total: Rs.{totalAmount.toFixed(2)}</div>
          </div>

          <button
            className="mt-6 w-full bg-green-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
            onClick={handlePlaceOrder}
            disabled={isLoading} 
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
