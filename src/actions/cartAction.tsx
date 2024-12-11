import axios from 'axios';
import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_ITEM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  FETCH_CART_ITEMS,
  
  SAVE_DELIVERY_INFO,
  SET_RESTAURANT_ID,
 
} from '../constants/cartConstants'; 
import thunk, { ThunkAction } from 'redux-thunk';
import{getAuthConfig} from '../Apiconfig'

import { RootState } from '../store'; 
import { Dispatch } from 'redux';
import { AnyAction } from 'redux';
import { config } from 'process';
import api from '../Api'




export const addToCart = (foodItemId: string,userId?:string) => async (dispatch: Dispatch) => {
  debugger;
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });
    const config = getAuthConfig();

    const response = await api.post('http://localhost:5000/api/users/addtocart', {
      foodItemId,
      userId,
      quantity:1,
    });
    console.log(response.data,"addcart")
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      
    });
  }
};


export const removeCartItemApi = async (userId: string, itemId: string) => {
  debugger;
  try {
    console.log(userId,'userrrr');
    console.log(itemId,'itemmmid')
   
    const response = await api.delete('http://localhost:5000/api/users/removeItem', {
      params: { userId, itemId },
      
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearCartApi = async (userId: string) => {
  try {

    const response = await api.delete('http://localhost:5000/api/users/clearCart', {
      params: { userId },
      
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const removeItemFromCart  = (foodItemId: string,userId?:string) => async (dispatch: Dispatch) => {
  debugger;
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    
   
  } catch (error) {
   
  }
};

export const updateCartQuantity  = (foodItemId: string,userId?:string) => async (dispatch: Dispatch) => {
  debugger;
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    
   
  } catch (error) {
   
  }
};
export const clearCart  = (foodItemId: string,userId?:string) => async (dispatch: Dispatch) => {
  debugger;
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    
   
  } catch (error) {
   
  }
};
export const fetchCartItems = (userId: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(`/api/cart/${userId}`);
    dispatch({
      type: FETCH_CART_ITEMS,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};