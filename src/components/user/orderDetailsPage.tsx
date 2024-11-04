// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';

// import axios from 'axios';
// import {getAuthConfig} from '../../Apiconfig'
// import api from '../../Api'
// const socket = io('http://localhost:5000')

// interface FoodItem {
//   id: string;
//   name: string;
//   quantity: number;
//   image: string; // Assuming this field contains the image URL or path
// }

// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
// }

// interface OrderDetails {
//   foodItems: {
//     foodItem: string; // ID of the food item
//     quantity: number;
//   }[];
//   address: Address;
//   totalAmount: number;
//   orderStatus: string;
// }

// interface DetailedFoodItem {
//   id: string;
//   name: string;
//   image: string;
// }

// const OrderDetailsPage: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { paymentId, paymentMethod } = location.state || {};
//   const [orderStatus, setOrderStatus] = useState<string>('Preparing');
//   const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
//   const [detailedFoodItems, setDetailedFoodItems] = useState<FoodItem[]>([]);

//   useEffect(() => {
//     if (!paymentId) {
//       navigate('/checkout');
//       return;
//     }

//     const fetchOrderDetails = async () => {
//       try {
        
//         // Fetch order details
//         const response = await api.get(`http://localhost:5000/api/users/orders/${paymentId}`);
//         const orderData = response.data;
//         const {
//           address: { _id: deliveryAddress },
//           totalAmount,
//           foodItems,
//           orderStatus,
//           paymentMethod,
//           _id
//         } = orderData;
//         setOrderDetails(orderData);
//         setOrderStatus(orderData.orderStatus);

 
//         // socket.emit('orderNotification', { 
//         //   deliveryAddress,
//         //   totalAmount,
//         //   foodItems,
//         //   orderStatus,
//         //   paymentMethod,
//         //   _id,
         
//         // });
//         // Fetch details for each food item
//         const foodItemPromises = orderData.foodItems.map(async (item: { foodItem: string; quantity: number }) => {
          
//           const foodResponse = await api.get(`http://localhost:5000/api/users/${item.foodItem}`);

//           console.log(foodResponse,'foodresponse from backend')
//           return {
//             id: foodResponse.data._id,
//             foodItemName: foodResponse.data.name,
           
//             image: foodResponse.data.image,
//             quantity: item.quantity
//           };

//         });
        
         
//         const foodItemsDetails = await Promise.all(foodItemPromises);
//         socket.emit('orderNotification', {
//           deliveryAddress,
//           totalAmount,
//           foodItems: foodItemsDetails,
//           orderStatus:'pending',
//           paymentMethod,
//           _id,
//         })
//         setDetailedFoodItems(foodItemsDetails);

//       } catch (error) {
//         console.error('Error fetching order details:', error);
//       }
//     };

   

//     fetchOrderDetails();
//   }, [paymentId, navigate]);

//   if (!orderDetails) {
//     return <div>Loading order details...</div>;
//   }

//   const { address, totalAmount, orderStatus: status } = orderDetails;
//   console.log(orderDetails, 'order detail in the orderdetails page');

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold mb-6">Order Details</h1>

//       <div className="border p-6 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
//         <div className="mb-4">
//           <p className="text-lg">
//             <span className="font-bold">Payment Method:</span> {paymentMethod}
//           </p>
//           <p className="text-lg">
//             <span className="font-bold">Payment ID:</span> {paymentId}
//           </p>
//           <p className="text-lg">
//             <span className="font-bold">Total Amount:</span> ₹{totalAmount}
//           </p>
//         </div>

//         <h2 className="text-2xl font-semibold mb-4">Order Status</h2>
//         <p className="text-lg">
//           <span className="font-bold">Current Status:</span> {status}
//         </p>

//         {/* Status Display */}
//         {orderStatus === 'Preparing' && (
//           <p className="text-yellow-600">Your order is being prepared. Estimated time: 30 minutes.</p>
//         )}
//         {orderStatus === 'Out for Delivery' && (
//           <p className="text-green-600">Your order is out for delivery. Please be ready to receive it.</p>
//         )}
//         {orderStatus === 'Delivered' && (
//           <p className="text-blue-600">Your order has been delivered. Enjoy your meal!</p>
//         )}

//         <h2 className="text-2xl font-semibold mt-6 mb-4">Delivery Address</h2>
//         <p className="text-lg">
//           {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
//         </p>

//         <h2 className="text-2xl font-semibold mt-6 mb-4">Ordered Items</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {detailedFoodItems.map((item: FoodItem) => (
//             <div key={item.id} className="border rounded-lg p-4 shadow-lg">
//               <img
//                 src={`data:image/jpeg;base64,${item.image}`} // Assuming the image field contains the filename or URL
//                 alt={item.name}
//                 className="w-full h-40 object-cover rounded-t-lg"
//               />
//               <div className="p-2">
//                 <h3 className="text-lg font-bold">{item.name}</h3>
//                 <p className="text-md">Quantity: {item.quantity}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-8">
//           <button
//             onClick={() => navigate('/home')}
//             className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsPage;











import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../Api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface FoodItem {
  foodItem: string;
  quantity: number;
  image?: string;
}

interface OrderDetails {
  _id: string;
  user: User;
  foodItems: FoodItem[];
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  orderStatus: string;
  paymentId: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { paymentId, paymentMethod } = location.state || {};
  const [orderStatus, setOrderStatus] = useState<string>('Preparing');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [detailedFoodItems, setDetailedFoodItems] = useState<FoodItem[]>([]);
  const [final, setFinal] = useState<OrderDetails | null>(null);
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (!paymentId) {
      navigate('/checkout');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`http://localhost:5000/api/users/orders/${paymentId}`);
        const orderData = response.data;
        const fetchedOrders = response.data.map((order: any) => ({
          id: order._id,
          user: order.user,
          foodItems: order.foodItems.map((item: any) => ({
            foodItemName: item.foodItem.name,
            quantity: item.quantity,
          })),
          totalAmount: order.totalAmount,
          deliveryAddress: order.address,
          paymentMethod: order.paymentMethod,
          orderStatus: 'pending',
        }));

        setOrderDetails(fetchedOrders);
        setFinal(fetchedOrders[0]);

        

        const name = fetchedOrders[0]?.foodItems[0].foodItemName;
        const foodResponse = await api.get(`http://localhost:5000/api/users/${name}`);
        setImage(foodResponse.data.image);
        setOrderStatus(orderData.orderStatus);

        socket.emit('orderNotification', {
          restaurantId: fetchedOrders.id,
          orderDetails: fetchedOrders,
        });

        const foodItemPromises = fetchedOrders[0].foodItems.map(async (item: { foodItem: string; quantity: number }) => {
          const foodResponse = await api.get(`http://localhost:5000/api/users/${item.foodItem}`);
          return {
            id: foodResponse.data._id,
            name: foodResponse.data.name,
            image: foodResponse.data.image,
            quantity: item.quantity,
          };
        });

        const foodItemsDetails = await Promise.all(foodItemPromises);
        setDetailedFoodItems(foodItemsDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [paymentId, navigate]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }
  console.log(final,'finalllllll')

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Order Details</h1>

      <div className="border p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
        <div className="mb-4">
          <p className="text-lg">
            <span className="font-bold">Payment Method:</span> {final?.paymentMethod}
          </p>
          <p className="text-lg">
            <span className="font-bold">Total Amount:</span> ₹{final?.totalAmount}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Order Status</h2>
        <p className="text-lg">
          <span className="font-bold">Current Status:</span> {final?.orderStatus}
        </p>

        {orderStatus === 'Preparing' && (
          <p className="text-yellow-600">Your order is being prepared. Estimated time: 30 minutes.</p>
        )}
        {orderStatus === 'Out for Delivery' && (
          <p className="text-green-600">Your order is out for delivery. Please be ready to receive it.</p>
        )}
        {orderStatus === 'Delivered' && (
          <p className="text-blue-600">Your order has been delivered. Enjoy your meal!</p>
        )}

        <h2 className="text-2xl font-semibold mt-6 mb-4">Delivery Address</h2>
        <p className="text-lg">
          {final?.deliveryAddress.street}, {final?.deliveryAddress?.city}, {final?.deliveryAddress?.state}
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Ordered Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {final?.foodItems.map((item: FoodItem, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-lg">
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt={item.foodItem}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-2">
                <h3 className="text-lg font-bold">{item.foodItem}</h3>
                <p className="text-md">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/home')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;


