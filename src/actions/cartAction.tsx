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
      // payload: error.message,
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


// export const addItemToCart = (
//   id: string,
//   quantity: number
// ): ThunkAction<void, RootState, unknown, CartActionTypes> => async (dispatch, getState) => {
//   try {
//     const { data } = await axios.get(`/api/v1/eats/item/${id}`);
//     const fooditemData = data.data;

//     const image = fooditemData.images && fooditemData.images.length > 0
//       ? fooditemData.images[0].url
//       : '';

//     const item: CartItem = {
//       fooditem: fooditemData._id,
    
     
     
      
//       quantity
//     };

//     dispatch({
//       type: ADD_TO_CART,
//       payload: item
//     });

    
//   } catch (error) {
//     console.error('Failed to add item to cart:', error);
//     // Handle the error appropriately (e.g., dispatch an error action, show a notification)
//   }
// };

// export const updateCartQuantity = (
//   fooditemId: string,
//   quantity: number
// ): CartActionTypes => ({
//   type: UPDATE_CART_QUANTITY,
//   payload: { fooditemId, quantity }
// });

// export const removeItemFromCart = (
//   id: string
// ): ThunkAction<void, RootState, unknown, CartActionTypes> => async (dispatch, getState) => {
//   dispatch({
//     type: REMOVE_ITEM_CART,
//     payload: id
//   });
 
// };

// export const clearCart = (): CartActionTypes => ({
//   type: CLEAR_CART
// });

// export const saveDeliveryInfo = (deliveryInfo: DeliveryInfo): CartActionTypes => ({
//   type: SAVE_DELIVERY_INFO,
//   payload: deliveryInfo
// });

// export const updateDeliveryInfo = (deliveryInfo: DeliveryInfo): CartActionTypes => {
//   try {
//     return {
//       type: SAVE_DELIVERY_INFO,
//       payload: deliveryInfo
//     };
//   } catch (error) {
//     console.error('Failed to update delivery info:', error);
//     // Handle the error appropriately
//     return {
//       type: SAVE_DELIVERY_INFO,
//       payload: deliveryInfo // Default to payload if error occurs
//     };
//   }
// };

// export const setRestaurantId = (id: string): CartActionTypes => ({
//   type: SET_RESTAURANT_ID,
//   payload: id
// });


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