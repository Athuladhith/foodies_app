



import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import MainLayout from '../deliveryboy/Mainlayout';
import axios from 'axios';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';


interface Order {
  id: string;
  orderStatus: string;
  paymentMethod: string;
  totalAmount: number;
  user: string
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    _id: string;
  };
  foodItems: Array<{ foodItemName: string; quantity: number }>;
}

const DeliveryPersonHome: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusMap, setOrderStatusMap] = useState<{ [key: string]: boolean }>({}); 
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const deliveryBoyId = localStorage.getItem('deliveryBoyId') || '12345'; 
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);


    newSocket.emit('joinDeliveryRoom', deliveryBoyId);

    newSocket.on('orderReadyForDelivery', (updatedOrder) => {
      console.log('Received order from restaurant:', updatedOrder);
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex((order) => order.id === updatedOrder.id);

        if (existingOrderIndex !== -1) {
          
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex] = updatedOrder;
          return updatedOrders;
        }

        return [updatedOrder, ...prevOrders];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  const handleOutForDelivery = async (orderId: string) => {
const response= await axios.post(`http://localhost:5000/api/deliveryperson/orderupdates/${orderId}`)
const orders=response.data.order;
console.log(response.data.order,'response for out for delivery')

    if (socket) {
      socket.emit('acceptOrder',  orderId );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: 'Out for Delivery' } : order
        )
      );
      setOrderStatusMap((prev) => ({ ...prev, [orderId]: true })); 
    }
  };


  const handleCompleteOrder =async (orderId: string) => {
    const response= await axios.post(`http://localhost:5000/api/deliveryperson/orderupdatess/${orderId}`)
    if (socket) {
      socket.emit('completeOrder',  orderId );
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <MainLayout>
      <Typography variant="h4" align="center" gutterBottom>
        Delivery Orders
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Food Items</TableCell>
              <TableCell align="right">Delivery Address</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right">Payment Method</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {order.foodItems &&
                      order.foodItems.map((item) => (
                        <div key={item.foodItemName}>
                          {item.foodItemName} (x{item.quantity})
                        </div>
                      ))}
                  </TableCell>
                  <TableCell align="right">
                    {order.user}<br></br>
                    {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                    {order.deliveryAddress.postalCode}
                  </TableCell>
                  <TableCell align="right">Rs.{order.totalAmount}</TableCell>
                  <TableCell align="right">{order.paymentMethod}</TableCell>
                  <TableCell align="right">{order.orderStatus}</TableCell>
                  <TableCell align="right">
                    {order.orderStatus === 'FOOD READY' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOutForDelivery(order.id)}
                      >
                        Out for Delivery
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={!orderStatusMap[order.id]} 
                      sx={{ marginLeft: 1 }}
                    >
                      Delivery Completed
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainLayout>
  );
};

export default DeliveryPersonHome;
