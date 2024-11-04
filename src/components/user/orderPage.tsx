import { useEffect, useState } from "react";
import api from "../../Api";
import Headder from "./Headder";
import io from 'socket.io-client';
// const socket = io('http://localhost:5000')

const OrdersPage = () => {
  // Define state with correct types
  const [orders, setOrders] = useState<IOrder[]>([]);

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  // Define interfaces
  interface IFoodItem {
    _id: string;
    foodItem: {
      name: string;
      _id: string;
    };
    quantity: number;
  }

  interface IOrder {
    _id: string;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    foodItems: IFoodItem[];
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/api/users/orderss/${userId}`);
        
        console.log(response, "response from backend of order");
        console.log(response.data, "response data order");
        setOrders(response.data); // Assume response.data is correctly typed as IOrder[]
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <>
    <Headder/>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-600">Your Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-2 text-green-600">Order ID: {order._id}</h3>
              <p className="text-gray-700">
                <span className="font-bold">Total Amount:</span> <span className="text-red-500">${order.totalAmount}</span>
              </p>
              <p className={`text-gray-700 ${order.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}`}>
                <span className="font-bold">Payment Status:</span> {order.paymentStatus}
              </p>
              <p className={`text-gray-700 ${order.orderStatus === "Delivered" ? "text-green-500" : "text-yellow-500"}`}>
                <span className="font-bold">Order Status:</span> {order.orderStatus}
              </p>

              <h4 className="mt-4 mb-2 text-xl font-medium">Items:</h4>
              <ul className="list-disc list-inside space-y-1">
                {order.foodItems.map((item) => (
                  <li key={item._id} className="text-gray-600">
                    {item.foodItem.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
              <hr className="my-4 border-gray-300" />
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default OrdersPage;
