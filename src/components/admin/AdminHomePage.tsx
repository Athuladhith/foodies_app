
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Person,
  Restaurant,
  ShoppingCart,
  AttachMoney,
  Star,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const AdminHomePage: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalRestaurants, setTotalRestaurants] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          usersResponse,
          restaurantsResponse,
          ordersResponse,
          revenueResponse,
          topRestaurantsResponse,
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/total-users'),
          axios.get('http://localhost:5000/api/admin/total-restaurants'),
          axios.get('http://localhost:5000/api/admin/total-orders'),
          axios.get('http://localhost:5000/api/admin/total-revenue'),
          axios.get('http://localhost:5000/api/admin/top-restaurants'),
        ]);
        console.log(revenueResponse.data,'revenu dattatttattattatta nnneeewbbwnwwww')

        setTotalUsers(usersResponse.data.totalUsers);
        setTotalRestaurants(restaurantsResponse.data.totalRestaurants);
        setTotalOrders(ordersResponse.data.totalOrders);
        setTotalRevenue(revenueResponse.data.totalRevenue);
        setTopRestaurants(topRestaurantsResponse.data.restaurants);


        setRevenueData(revenueResponse.data.monthlyRevenue || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const renderStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number | null,
    color: string
  ) => (
    <Card
      className="shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
      sx={{
        backgroundColor: color,
        color: '#fff',
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', padding: 4 }}>
        <div style={{ fontSize: 40, marginRight: 16 }}>{icon}</div>
        <div>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4">{value !== null ? value : <CircularProgress color="inherit" />}</Typography>
        </div>
      </CardContent>
    </Card>
  );

  console.log(revenueData,'revenu data ttaattata');
  const chartData = {
    labels: ['Total Revenue'], 
    datasets: [
      {
        label: 'Total Revenue (Rs)',
        data: [totalRevenue || 0],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.1)' },
        beginAtZero: true,
      },
    },
  };
  

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="container mx-auto bg-white rounded-lg p-6 shadow-lg">
          
          <div className="flex justify-between items-center mb-8">
            <Typography variant="h4" className="font-semibold">
              Admin Dashboard
            </Typography>
            <div className="flex gap-4">
              <Link to="/registerdeliveryboy">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Add Delivery Boy
                </button>
              </Link>
              <Link to="/registerrestaurant">
                <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                  Add Restaurant
                </button>
              </Link>
            </div>
          </div>

         
          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} md={6} lg={3}>
              {renderStatCard(<Person />, 'Total Users', totalUsers, '#1976d2')}
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {renderStatCard(<Restaurant />, 'Total Restaurants', totalRestaurants, '#2e7d32')}
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {renderStatCard(<ShoppingCart />, 'Total Orders', totalOrders, '#f9a825')}
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {renderStatCard(<AttachMoney />, 'Total Revenue', `Rs.${totalRevenue}`, '#d32f2f')}
            </Grid>
          </Grid>

        
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
            <Typography variant="h6" className="mb-4">
              Top Restaurants
            </Typography>
            <List>
              {topRestaurants.map((restaurant, index) => (
                <React.Fragment key={restaurant.ownerName}>
                  <ListItem>
                   
                    <ListItemAvatar>
            <Avatar
              alt={restaurant.restaurantName}
              src={restaurant.avatar} 
            />
          </ListItemAvatar>
                    <ListItemText
                  
                      primary={`${index + 1}. ${restaurant.restaurantName}`}
                      secondary={`Orders: ${restaurant.totalOrders}, Rating: ${restaurant.totalOrders}`}
                    />
                  </ListItem>
                  {index < topRestaurants.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </div>

        
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminHomePage;

