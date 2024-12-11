


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { Delete, Remove, Add } from '@mui/icons-material';
import Headder from './Headder';
import { getAuthConfig } from '../../Apiconfig';
import api from '../../Api';
import { removeCartItemApi, clearCartApi } from '../../actions/cartAction';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user && user.id) {
        try {
          const config = getAuthConfig();
          const response = await api.get('http://localhost:5000/api/users/usercart', {
            params: { userId: user.id },
          });
          const fetchedCartItems = response.data.items;

          const foodDetailsPromises = fetchedCartItems.map(async (item: any) => {
            try {
              const foodResponse = await api.get('http://localhost:5000/api/users/fooditemid', {
                params: { foodItemId: item.foodItem, restaurant: item.restaurant },
              });
              setQuantity(foodResponse.data.quantity);
              return {
                ...item,
                ...foodResponse.data,
                quantity: item.quantity || 1,
              };
            } catch (foodError) {
              console.error('Error fetching food item:', foodError);
              return item;
            }
          });

          const detailedCartItems = await Promise.all(foodDetailsPromises);
          setCartItems(detailedCartItems);
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        }
      }
    };

    fetchCartItems();
  }, [storedUser]);

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > quantity) {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = async (itemId: string) => {
    if (user?.id) {
      try {
        await removeCartItemApi(user.id, itemId);
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
      }
    }
  };

  const handleClearCart = async () => {
    if (user?.id) {
      try {
        await clearCartApi(user.id);
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  return (
    <>
      <Headder />
      <div className="container mx-auto p-6">
        <Typography variant="h4" className="font-bold text-center text-gray-800 mb-6">
          Your Cart
        </Typography>
        {cartItems.length === 0 ? (
          <Typography variant="h6" className="text-gray-600 text-center">
            Your cart is empty.
          </Typography>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="flex items-center p-4 shadow-lg">
                <CardMedia
                  component="img"
                  image={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="rounded-md object-cover"
                  style={{ height: '80px', width: '80px' }} 
                />
                <CardContent className="flex-1">
                  <Typography variant="h6" className="font-semibold text-gray-900">
                    {item.name}
                  </Typography>
                  <Typography variant="body1" className="text-gray-700">
                    Price: Rs.{item.price.toFixed(2)}
                  </Typography>
                  <div className="flex items-center mt-2 space-x-2">
                    <IconButton
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={isDisabled}
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="body1">{item.quantity}</Typography>
                    <IconButton
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      disabled={isDisabled}
                    >
                      <Add />
                    </IconButton>
                  </div>
                </CardContent>
                <IconButton
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-600"
                >
                  <Delete />
                </IconButton>
              </Card>
            ))}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
              <Typography variant="h6" className="font-semibold text-gray-800">
                Total Price: Rs.
                {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              className="mt-4 w-full"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
