


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../Api";
import io from "socket.io-client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

const socket = io("http://localhost:5000");

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

  const { paymentId } = location.state || {};
  const [orderStatus, setOrderStatus] = useState<string>("Preparing");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [detailedFoodItems, setDetailedFoodItems] = useState<FoodItem[]>([]);
  const [final, setFinal] = useState<OrderDetails | null>(null);
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (!paymentId) {
      navigate("/checkout");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(
          `http://localhost:5000/api/users/orders/${paymentId}`
        );
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
          orderStatus: "pending",
        }));

        setOrderDetails(fetchedOrders);
        setFinal(fetchedOrders[0]);

        const foodname = String(
          fetchedOrders[0]?.foodItems[0]?.foodItemName || ""
        );
        const foodResponse = await api.get(
          `http://localhost:5000/api/users/${foodname}`
        );
        setImage(foodResponse.data.image);
        setOrderStatus(response.data.orderStatus);

        socket.emit("orderNotification", {
          restaurantId: fetchedOrders.id,
          orderDetails: fetchedOrders,
        });

        const foodItemPromises = fetchedOrders[0].foodItems.map(
          async (item: { foodItem: string; quantity: number }) => {
            const foodResponse = await api.get(
              `http://localhost:5000/api/users/${item.foodItem}`
            );
            return {
              id: foodResponse.data._id,
              name: foodResponse.data.name,
              image: foodResponse.data.image,
              quantity: item.quantity,
            };
          }
        );

        const foodItemsDetails = await Promise.all(foodItemPromises);
        setDetailedFoodItems(foodItemsDetails);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [paymentId, navigate]);

  if (!orderDetails) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress size={80} color="primary" />
      </Box>
    );
  }

  return (
    <Box className="container mx-auto p-6">
      <Typography
        variant="h4"
        className="text-center font-bold mb-8 text-gray-800"
      >
        Order Details
      </Typography>

      <Paper elevation={6} className="p-8 rounded-lg shadow-md">
        {/* Payment Details */}
        <Box className="mb-6">
          <Typography variant="h5" className="font-semibold mb-4">
            Payment Details
          </Typography>
          <Typography>
            <span className="font-semibold">Payment Method:</span>{" "}
            {final?.paymentMethod}
          </Typography>
          <Typography>
            <span className="font-semibold">Total Amount:</span> Rs.
            {final?.totalAmount}
          </Typography>
        </Box>

        {/* Order Status */}
        <Box className="mb-6">
          <Typography variant="h5" className="font-semibold mb-4">
            Order Status
          </Typography>
          <Typography>
            <span className="font-semibold">Current Status:</span>{" "}
            {final?.orderStatus}
          </Typography>
          {orderStatus === "Preparing" && (
            <Typography className="text-yellow-600 mt-2">
              Your order is being prepared. Estimated time: 30 minutes.
            </Typography>
          )}
          {orderStatus === "Out for Delivery" && (
            <Typography className="text-green-600 mt-2">
              Your order is out for delivery. Please be ready to receive it.
            </Typography>
          )}
          {orderStatus === "Delivered" && (
            <Typography className="text-blue-600 mt-2">
              Your order has been delivered. Enjoy your meal!
            </Typography>
          )}
        </Box>

        {/* Delivery Address */}
        <Box className="mb-6">
          <Typography variant="h5" className="font-semibold mb-4">
            Delivery Address
          </Typography>
          <Typography>
            {final?.deliveryAddress.street}, {final?.deliveryAddress?.city},{" "}
            {final?.deliveryAddress?.state}
          </Typography>
        </Box>

        {/* Ordered Items */}
        <Box>
          <Typography variant="h5" className="font-semibold mb-6">
            Ordered Items
          </Typography>
          <Grid container spacing={3}>
            {final?.foodItems.map((item: FoodItem, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="rounded-lg shadow-lg">
                  <CardMedia
                    component="img"
                    height="140"
                    image={`data:image/jpeg;base64,${image}`}
                    alt={item.foodItem}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="text-center font-bold"
                    >
                      {item.foodItem}
                    </Typography>
                    <Typography className="text-center">
                      Quantity: {item.quantity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Back to Home */}
        <Box className="mt-8 text-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderDetailsPage;
