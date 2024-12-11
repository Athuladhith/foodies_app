

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from './Mainlayout';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'tailwindcss/tailwind.css';

Chart.register(...registerables);

interface FilteredOrder {
  _id: string;
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  user: {
    name: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  foodItems: {
    foodItem: {
      _id: string;
      name: string;
      price: number;
      category: string;
      cuisine: string;
    };
    quantity: number;
  }[];
}

interface RevenueByCategory {
  category: string;
  revenue: number;
}

interface FoodItem {
  foodItem: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  foodItems: FoodItem[];
}

const Dashboard: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<FilteredOrder[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategory[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const restaurantId = localStorage.getItem('restaurantid');

  useEffect(() => {
    if (!restaurantId) return;
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/restaurant/dashboard/${restaurantId}`);
        setTotalRevenue(data.totalRevenue);
        setOrders(data.orders || []); 
        setRecentOrders(data.orders?.slice(-10).reverse() || []); 
        setRevenueByCategory(data.revenueByCategory || []); 
        setError(null);
      } catch (error) {
        setError('Failed to fetch dashboard data.');
      }
    };

    fetchDashboardData();
  }, [restaurantId]);

  const handleDateFilter = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/restaurant/orders/${restaurantId}`,
        { params: { startDate, endDate } }
      );
      console.log(data,'filteredddd')
      setFilteredOrders(data || []); 
      setError(null);
    } catch (error) {
      setError('Error filtering orders by date.');
    }
    console.log(filteredOrders,'filtered ordeer in state clickkk')
  };
  console.log(filteredOrders,'filtered ordeer in state')

  const barChartData = {
    labels: revenueByCategory.map((item) => item.category),
    datasets: [
      {
        label: 'Revenue by Category',
        data: revenueByCategory.map((item) => item.revenue),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: orders.map((order) => new Date(order.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Revenue',
        data: orders.map((order) => order.totalAmount),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.6)',
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
        <Typography variant="h4" gutterBottom className="text-white font-extrabold">
          Restaurant Dashboard
        </Typography>

        {error && (
          <Typography color="error" className="mb-4">
            {error}
          </Typography>
        )}

       
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="bg-blue-500 hover:bg-blue-600 text-black shadow-xl">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h5">Rs.{totalRevenue}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="bg-green-500 hover:bg-green-600 text-black shadow-xl">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h5">{orders.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

    
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="bg-purple-500 text-white shadow-xl">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue by Category
                </Typography>
                <Bar data={barChartData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="bg-red-500 text-white shadow-xl">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Revenue
                </Typography>
                <Line data={lineChartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Recent Orders
          </Typography>
          <TableContainer component={Paper} className="shadow-xl">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Order Status</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Food Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>Rs.{order.totalAmount}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      {order.foodItems.map((item) => `${item.foodItem.name} (x${item.quantity})`).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

     
        <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button variant="contained" onClick={handleDateFilter}>
            Filter Orders
          </Button>
        </Box>

   
        {filteredOrders.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              Filtered Orders
            </Typography>
            <TableContainer component={Paper} className="shadow-xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Food Items</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>Rs.{order.totalAmount}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        {order.foodItems.map((item) => `${item.foodItem.name} (x${item.quantity})`).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
