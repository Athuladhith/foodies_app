import axios from 'axios';
import { Dispatch } from 'redux';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import api from '../Api';
import{getAuthConfig} from '../Apiconfig'
import {
  LOGIN_ADMIN_REQUEST,
  LOGIN_ADMIN_SUCCESS,
  LOGIN_ADMIN_FAIL,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAIL,
  FETCH_RESTAURANTS_REQUEST,
  FETCH_RESTAURANTS_SUCCESS,
  FETCH_RESTAURANTS_FAIL,
  FETCH_DELIVERY_PERSONS_REQUEST,
  FETCH_DELIVERY_PERSONS_SUCCESS,
  FETCH_DELIVERY_PERSONS_FAIL,
  BLOCK_UNBLOCK_USER_REQUEST,
  BLOCK_UNBLOCK_USER_SUCCESS,
  BLOCK_UNBLOCK_USER_FAIL,
  BLOCK_UNBLOCK_RESTAURANT_REQUEST,
  BLOCK_UNBLOCK_RESTAURANT_SUCCESS,
  BLOCK_UNBLOCK_RESTAURANT_FAIL,
  BLOCK_UNBLOCK_DELIVERYBOY_REQUEST,
  BLOCK_UNBLOCK_DELIVERYBOY_SUCCESS,
  BLOCK_UNBLOCK_DELIVERYBOY_FAIL,
  FETCH_SINGLE_RESTAURANT_REQUEST,
    FETCH_SINGLE_RESTAURANT_SUCCESS,
    FETCH_SINGLE_RESTAURANT_FAIL,
    UPDATE_RESTAURANT_REQUEST,
    UPDATE_RESTAURANT_SUCCESS,
    UPDATE_RESTAURANT_FAIL
} from '../constants/adminConstants';

export const adminlogin = (userData: { email: string; password: string }): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
 
  try {
    dispatch({ type: LOGIN_ADMIN_REQUEST });

    const response = await api.post("/api/admin/adminlogin", userData);
    console.log(response.data.admin,'admindetails')

     localStorage.setItem('admintoken',response.data.token);
     localStorage.setItem('admin', JSON.stringify(response.data.admin));
    

    dispatch({
      type: LOGIN_ADMIN_SUCCESS,
      payload: {
        admin: response.data.admin,
        token: response.data.token
      },
    });

    return response.data.admin;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: LOGIN_ADMIN_FAIL,
        payload: error.response?.data.message || 'An error occurred',
      });
    } else {
      dispatch({
        type: LOGIN_ADMIN_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};

export const fetchUsers = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({ type: FETCH_USERS_REQUEST });
    const config = getAuthConfig();

    const { data } = await api.get('/api/admin/users',config);

    dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: FETCH_USERS_FAIL,
        payload: error.response?.data.message || 'An error occurred',
      });
    } else {
      dispatch({
        type: FETCH_USERS_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};

export const blockUnblockUser = (userId: string, newStatus: boolean): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({ type: BLOCK_UNBLOCK_USER_REQUEST });
    const config = getAuthConfig();

    const { data } = await api.put(`/api/admin/users/${userId}/block`, { isBlocked: newStatus },config);

    dispatch({
      type: BLOCK_UNBLOCK_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: BLOCK_UNBLOCK_USER_FAIL,
        payload: error.response?.data.message || 'An error occurred while updating the user status',
      });
    } else {
      dispatch({
        type: BLOCK_UNBLOCK_USER_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};

export const fetchRestaurants = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {

  try {
    dispatch({ type: FETCH_RESTAURANTS_REQUEST });
   
   
  

    

    const { data } = await api.get('/api/admin/restaurants',);

    dispatch({ type: FETCH_RESTAURANTS_SUCCESS, payload: data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: FETCH_RESTAURANTS_FAIL,
        payload: error.response?.data.message || 'An error occurred',
      });
    } else {
      dispatch({
        type: FETCH_RESTAURANTS_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};


export const blockUnblockRestaurant = (restaurantId: string, newStatus: boolean): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({ type: BLOCK_UNBLOCK_RESTAURANT_REQUEST });
    const config = getAuthConfig();
    const { data } = await api.put(`/api/admin/restaurants/${restaurantId}/block`, { isBlocked: newStatus },config);

    dispatch({
      type: BLOCK_UNBLOCK_RESTAURANT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: BLOCK_UNBLOCK_RESTAURANT_FAIL,
        payload: error.response?.data.message || 'An error occurred while updating the restaurant status',
      });
    } else {
      dispatch({
        type: BLOCK_UNBLOCK_RESTAURANT_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};

export const fetchDeliveryPersons = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
 
  try {
    dispatch({ type: FETCH_DELIVERY_PERSONS_REQUEST });
    const config = getAuthConfig();

    const { data } = await api.get('/api/admin/delivery-persons',config);

    dispatch({ type: FETCH_DELIVERY_PERSONS_SUCCESS, payload: data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: FETCH_DELIVERY_PERSONS_FAIL,
        payload: error.response?.data.message || 'An error occurred',
      });
    } else {
      dispatch({
        type: FETCH_DELIVERY_PERSONS_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};

export const blockUnblockDeliveryboy = (deliveryboyId: string, newStatus: boolean): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({ type: BLOCK_UNBLOCK_DELIVERYBOY_REQUEST });
    const config = getAuthConfig();
    const { data } = await api.put(`/api/admin/delivery-persons/${deliveryboyId}/block`, { isBlocked: newStatus },config);

    dispatch({
      type: BLOCK_UNBLOCK_DELIVERYBOY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: BLOCK_UNBLOCK_DELIVERYBOY_FAIL,
        payload: error.response?.data.message || 'An error occurred while updating the delivery boy status',
      });
    } else {
      dispatch({
        type: BLOCK_UNBLOCK_DELIVERYBOY_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};


export const fetchSingleRestaurant = (id: string): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  
  try {
      dispatch({ type: FETCH_SINGLE_RESTAURANT_REQUEST });
      const config = getAuthConfig();
      const { data } = await api.get(`/api/admin/restaurant/${id}`,config);
      console.log(data,'restaurant data in check')

      dispatch({
          type: FETCH_SINGLE_RESTAURANT_SUCCESS,
          payload: data,
      });
  } catch (error) {
      if (axios.isAxiosError(error)) {
          dispatch({
              type: FETCH_SINGLE_RESTAURANT_FAIL,
              payload: error.response?.data.message || 'An error occurred while fetching the restaurant',
          });
      } else {
          dispatch({
              type: FETCH_SINGLE_RESTAURANT_FAIL,
              payload: 'An unknown error occurred',
          });
      }
  }
};
export const updateRestaurant = (
  id: string,
  updateData: FormData
): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  debugger;
  try {
    dispatch({ type: UPDATE_RESTAURANT_REQUEST });
    console.log(updateData,'datafrom front')
    updateData.forEach((value, key) => {
      console.log(`In action - ${key}: ${value}`);
    });
    const config = getAuthConfig();

    const { data } = await api.put(`/api/admin/updaterestaurant/${id}`, updateData,config);
    console.log(data, 'from updaterest');

    dispatch({
      type: UPDATE_RESTAURANT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: UPDATE_RESTAURANT_FAIL,
        payload: error.response?.data.message || 'An error occurred while updating the restaurant',
      });
    } else {
      dispatch({
        type: UPDATE_RESTAURANT_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};
