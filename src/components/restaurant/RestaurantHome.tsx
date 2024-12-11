
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import MainLayout from './Mainlayout';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { FoodBank, Visibility } from '@mui/icons-material';

const socket = io('http://localhost:5000');

interface Order {
  id: string;
  user: string;
  foodItems: { foodItemName: string; quantity: number }[];
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  orderStatus: 'placed' | 'FOOD PREPARING' | 'FOOD READY' | 'Delivered';
}

const RestaurantHome: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const restaurantId = localStorage.getItem('restaurantid');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurant/orders/${restaurantId}`);
        const fetchedOrders = response.data.map((order: any) => ({
          id: order._id,
          user: order.user.name,
          foodItems: order.foodItems.map((item: any) => ({
            foodItemName: item.foodItem.name,
            quantity: item.quantity,
          })),
          totalAmount: order.totalAmount,
          deliveryAddress: order.address,
          paymentMethod: order.paymentMethod,
          orderStatus: order.orderStatus,
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    socket.emit('joinRoom', restaurantId);

    socket.on('orderNotification', (newOrder) => {
      setOrders((prevOrders) => [newOrder[0], ...prevOrders]);
    });

    socket.on('acceptOrder', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );
    });

    socket.on('completeOrder', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );
    });

    return () => {
      socket.off('orderNotification');
      socket.off('acceptOrder');
      socket.off('completeOrder');
    };
  }, [restaurantId]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'FOOD PREPARING' | 'FOOD READY') => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);

      await axios.post(`http://localhost:5000/api/restaurant/orderupdate/${orderId}`, { status: newStatus });

      const updatedOrder = updatedOrders.find((order) => order.id === orderId);

      if (updatedOrder) {
        socket.emit('deliveryNotification', {
          id: updatedOrder.id,
          orderStatus: newStatus,
          paymentMethod: updatedOrder.paymentMethod,
          totalAmount: updatedOrder.totalAmount,
          user: updatedOrder.user,
          deliveryAddress: updatedOrder.deliveryAddress,
          foodItems: updatedOrder.foodItems,
        });
        if (newStatus === 'FOOD READY') {
          socket.emit('orderReadyForDelivery', updatedOrder);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  return (
    <MainLayout>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Restaurant Orders
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle1">Food Items</Typography></TableCell>
              <TableCell align="center"><Typography variant="subtitle1">Total Amount</Typography></TableCell>
              <TableCell align="center"><Typography variant="subtitle1">Delivery Address</Typography></TableCell>
              <TableCell align="center"><Typography variant="subtitle1">Payment Method</Typography></TableCell>
              <TableCell align="center"><Typography variant="subtitle1">Status</Typography></TableCell>
              <TableCell align="center"><Typography variant="subtitle1">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  {order.foodItems.map((item) => (
                    <Typography key={item.foodItemName}>
                      {item.foodItemName} (x{item.quantity})
                    </Typography>
                  ))}
                </TableCell>
                <TableCell align="center">₹{order.totalAmount}</TableCell>
                <TableCell align="center">
                  <Typography>{order.deliveryAddress.street}</Typography>
                  <Typography>{order.deliveryAddress.city}, {order.deliveryAddress.state}</Typography>
                </TableCell>
                <TableCell align="center">{order.paymentMethod}</TableCell>
                <TableCell align="center">
                  <Typography
                    color={
                      order.orderStatus === 'placed'
                        ? 'warning.main'
                        : order.orderStatus === 'FOOD PREPARING'
                        ? 'info.main'
                        : 'success.main'
                    }
                  >
                    {order.orderStatus}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Set to Food Preparing">
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateOrderStatus(order.id, 'FOOD PREPARING')}
                      disabled={order.orderStatus !== 'placed'}
                      sx={{ mr: 1 }}
                    >
                      Preparing
                    </Button>
                  </Tooltip>
                  <Tooltip title="Set to Food Ready">
                    <Button
                      color="secondary"
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateOrderStatus(order.id, 'FOOD READY')}
                      disabled={order.orderStatus !== 'FOOD PREPARING'}
                      sx={{ mr: 1 }}
                    >
                      Ready
                    </Button>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Visibility />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedOrder && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <strong>Food Items:</strong>
            </Typography>
            {selectedOrder.foodItems.map((item) => (
              <Typography key={item.foodItemName} variant="body2">
                {item.foodItemName} (x{item.quantity})
              </Typography>
            ))}
            <Typography variant="body1">
              <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
            </Typography>
            <Typography variant="body1">
              <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city},{' '}
              {selectedOrder.deliveryAddress.state}, {selectedOrder.deliveryAddress.postalCode},{' '}
              {selectedOrder.deliveryAddress.country}
            </Typography>
            <Typography variant="body1">
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {selectedOrder.orderStatus}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default RestaurantHome;
