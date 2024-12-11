

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Api";
import Headder from "./Headder";
import { io } from 'socket.io-client';
import { Button, Card, CardContent, Typography, Chip, Divider } from "@mui/material";
import { ShoppingBagOutlined, DoneOutlined, ErrorOutlineOutlined } from "@mui/icons-material";
const socket = io('http://localhost:5000');

const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

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
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    socket.on('acceptOrder', (updatedOrder) => {
      console.log(updatedOrder, 'the data from the delivery boy');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder.id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );
    });

    socket.on('completeOrder', (updatedOrder) => {
      console.log(updatedOrder, 'LATEST DATT data from the delivery boy');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder.id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );
    });
    socket.on('foodpreparing', (updatedOrder) => {
      console.log(updatedOrder, 'preparing data from restttt');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder.id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );
    });

    socket.on('ordertouser', (updatedOrder) => {
      console.log(updatedOrder, 'LATE data data from the rest');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder.id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );
    });

    if (userId) {
      fetchOrders();
    }
    return () => {
      socket.off('acceptOrder');
      socket.off('completeOrder');
      socket.off('ordertouser')
      socket.off('foodpreparing')
    };
  }, [userId]);

  console.log(orders,'orderin the order page')

  return (
    <>
      <Headder />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <Typography variant="h4" component="h1" className="font-bold text-red-600">
            Your Orders
          </Typography>
          <Divider className="my-4" />
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <Typography variant="body1" className="text-center text-gray-500">
              No orders found.
            </Typography>
          ) : (
            orders.map((order) => (
              <Card
                key={order._id}
                className="hover:shadow-2xl transition-shadow duration-300 border border-gray-300 rounded-lg"
                elevation={3}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Typography variant="h6" component="h2" className="text-green-600">
                      <ShoppingBagOutlined className="mr-2" />
                      Order ID: {order._id}
                    </Typography>
                    <Chip
                      label={order.orderStatus}
                      color={order.orderStatus === "Delivered" ? "success" : "warning"}
                      className="font-semibold"
                    />
                  </div>
                  <Typography variant="body2" className="text-gray-700 mt-2">
                    <span className="font-bold">Total Amount:</span>{" "}
                    <span className="text-red-500">Rs.{order.totalAmount}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    
                  >
                    {/* <DoneOutlined className="mr-2" /> */}
                    Payment Status: {order.paymentStatus}
                  </Typography>

                  <Divider className="my-4" />

                  <Typography variant="subtitle1" className="text-gray-800 font-semibold">
                    Ordered Items:
                  </Typography>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {order.foodItems.map((item) => (
                      <li key={item._id} className="text-gray-600">
                        {item.foodItem.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>

                  <Divider className="my-4" />

                  <div className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">
                      Placed on: <span className="font-medium">2024-11-21</span>
                    </Typography>
                    <Link to={`/track-order/${order._id}`}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Track Order
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
