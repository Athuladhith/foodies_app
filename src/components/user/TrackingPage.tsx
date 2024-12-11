

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Api';
import { Stepper, Step, StepLabel } from '@mui/material';
import Headder from './Headder';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const TrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  const steps = ['Placed', 'Food Preparing', 'Food Ready', 'OUT FOR DELIVERY', 'DELIVERY COMPLETED'];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/api/users/orderdetails/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const handleAcceptOrder = (updatedOrder: any) => {
      if (order && order._id === updatedOrder.id) {
        setOrder((prevOrder: any) => ({
          ...prevOrder,
          orderStatus: updatedOrder.orderStatus,
        }));
      }
    };

    const handleCompleteOrder = (updatedOrder: any) => {
      if (order && order._id === updatedOrder.id) {
        setOrder((prevOrder: any) => ({
          ...prevOrder,
          orderStatus: updatedOrder.orderStatus,
        }));
      }
    };

    
    const handleReady = (updatedOrder: any) => {
      if (order && order._id === updatedOrder.id) {
        setOrder((prevOrder: any) => ({
          ...prevOrder,
          orderStatus: updatedOrder.orderStatus,
        }));
      }
    };

    
    const handlePreparing = (updatedOrder: any) => {
      if (order && order._id === updatedOrder.id) {
        setOrder((prevOrder: any) => ({
          ...prevOrder,
          orderStatus: updatedOrder.orderStatus,
        }));
      }
    };

    socket.on('acceptOrder', handleAcceptOrder);
    socket.on('completeOrder', handleCompleteOrder);
    socket.on('ordertouser', handleReady);
    socket.on('foodpreparing', handlePreparing);


    if (orderId) {
      fetchOrderDetails();
    }

    return () => {
      socket.off('acceptOrder', handleAcceptOrder);
      socket.off('completeOrder', handleCompleteOrder);
    };
  }, [orderId, order]);

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'FOOD PREPARING':
        return 1;
      case 'FOOD READY':
        return 2;
      case 'OUT FOR DELIVERY':
        return 3;
      case 'DELIVERY COMPLETED':
        return 4;
      default:
        return -1;
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Headder />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-6">Track Order</h1>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-green-600 mb-4">Order Status: {order.orderStatus}</h3>
          <Stepper activeStep={getStepIndex(order.orderStatus)} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className="mt-6">
          <h4 className="text-xl font-medium mb-2">Items:</h4>
          <ul className="list-disc list-inside space-y-1">
            {order.foodItems.map((item: any) => (
              <li key={item._id} className="text-gray-600">
                {item.foodItem.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
          <hr className="my-4 border-gray-300" />
          <h4 className="text-xl font-medium">Delivery Address:</h4>
          <p>{order.user.name}</p>
          <p>
            {order.address.street}, {order.address.city}, {order.address.state}, {order.address.postalCode}, {order.address.country}
          </p>
        </div>
      </div>
    </>
  );
};

export default TrackingPage;
