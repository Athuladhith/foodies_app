import {
    REGISTER_RESTAURANT_REQUEST,
    REGISTER_RESTAURANT_SUCCESS,
    REGISTER_RESTAURANT_FAIL,
    FETCH_RESTAURANTS_REQUEST,
    FETCH_RESTAURANTS_SUCCESS,
    FETCH_RESTAURANTS_FAIL,
    
}from '../constants/adminConstants'

import { 
     LOGIN_RESTAURANT_REQUEST,
    LOGIN_RESTAURANT_SUCCESS,
    LOGIN_RESTAURANT_FAIL,
    CUISINE_ADD_REQUEST,
     CUISINE_ADD_SUCCESS, 
     CUISINE_ADD_FAIL,
     ADD_FOOD_ITEM_REQUEST,
  ADD_FOOD_ITEM_SUCCESS,
  ADD_FOOD_ITEM_FAIL,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAIL,
  FETCH_CUISINE_REQUEST,
  FETCH_CUISINE_SUCCESS,
  FETCH_CUISINE_FAIL,
  FETCH_FOODITEM_REQUEST,
  FETCH_FOODITEM_SUCCESS,
  FETCH_FOODITEM_FAIL,
  DELETE_FOODITEM_REQUEST,
  DELETE_FOODITEM_SUCCESS,
  DELETE_FOODITEM_FAIL,
  DELETE_CUISINE_REQUEST,
  DELETE_CUISINE_SUCCESS,
  DELETE_CUISINE_FAIL,
  DELETE_CATAGORY_REQUEST,
  DELETE_CATAGORY_SUCCESS,
  DELETE_CATAGORY_FAIL,
  UPDATE_FOOD_ITEM_REQUEST,
  UPDATE_FOOD_ITEM_SUCCESS,
  UPDATE_FOOD_ITEM_FAIL,
  FETCH_SINGLE_FOOD_ITEM_REQUEST,
  FETCH_SINGLE_FOOD_ITEM_SUCCESS,
  FETCH_SINGLE_FOOD_ITEM_FAIL,

  } from '../constants/restaurantConstants';
 
import { Dispatch } from 'redux';
import { AnyAction } from 'redux';
import axios, { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import Api from '../restaurantApi'
import api from '../Api'
import {getAuthConfig} from '../Apiconfig'


export const restaurantlogin = (restaurantData: { email: string; password: string }) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({ type:  LOGIN_RESTAURANT_REQUEST });

    const { data } = await Api.post("/api/restaurant/restaurantlogin", restaurantData);
   
    console.log(data.token,"show")
    localStorage.setItem('restaurantid', data.restaurant._id)
    localStorage.setItem('restaurantToken', data.token)
    dispatch({
      type: LOGIN_RESTAURANT_SUCCESS,
      payload: {
          user: data.restaurant,
          token: data.token
      },
    });

    return data.restraunt;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type:  LOGIN_RESTAURANT_FAIL,
        payload: error.response?.data.message || 'An error occurred',
      });
    } else {
      dispatch({
        type:  LOGIN_RESTAURANT_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};


export const registerRestaurant = (userData: FormData) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        dispatch({ type: REGISTER_RESTAURANT_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };
       

        const { data } = await api.post("/api/admin/restaurantsignup", userData);

        dispatch({
            type: REGISTER_RESTAURANT_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            dispatch({
                type: REGISTER_RESTAURANT_FAIL,
                payload: error.response?.data.message || 'An error occurred',
            });
        } else {
            dispatch({
                type: REGISTER_RESTAURANT_FAIL,
                payload: 'An unknown error occurred',
            });
        }
    }
};




export const addCuisine = (formData: FormData) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    

    dispatch({ type: CUISINE_ADD_REQUEST });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await Api.post("/api/restaurant/addcuisine", formData, config);

    dispatch({
      type: CUISINE_ADD_SUCCESS ,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CUISINE_ADD_FAIL,
      payload:'An unknown error occurred',
    });
  }
};


export const addFoodItem= (formData: FormData) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    
    dispatch({ type: ADD_FOOD_ITEM_REQUEST });
 

 const config = {
   headers: {
     'Content-Type': 'multipart/form-data',
      
   },
 };

    const { data } = await Api.post("/api/restaurant/addfooditem", formData, config);

    dispatch({
      type: ADD_FOOD_ITEM_SUCCESS,
      payload: data,
    });
    return { success: true, data: data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: ADD_FOOD_ITEM_FAIL,
        payload: error.response?.data.message || 'An error occurred',
      });
    } else {
      dispatch({
        type: ADD_FOOD_ITEM_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};



export const fetchCategories = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
     
        dispatch({ type: FETCH_CATEGORIES_REQUEST });
        const { data } = await axios.get('http://localhost:5000/api/restaurant/categories',);
        console.log(data,'errroorororoororooroororonnoowoowwoow');
        dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_CATEGORIES_FAIL,
            payload: 'An error occurred while fetching categories',
        });
    }
};

export const fetchCuisine = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
      dispatch({ type: FETCH_CUISINE_REQUEST });
      const { data } = await Api.get('/api/restaurant/cuisine');
      dispatch({ type: FETCH_CUISINE_SUCCESS, payload: data });
  } catch (error) {
      dispatch({
          type: FETCH_CUISINE_FAIL,
          payload: 'An error occurred while fetching categories',
      });
  }
};


export const fetchFoodItem = (name?: string, category?: string): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
  debugger;
  try {
    dispatch({ type: FETCH_FOODITEM_REQUEST });

   
    const { data } = await Api.get('/api/restaurant/fooditem', {
      params: { name, category },
    });
    
    if (Array.isArray(data)) {
      dispatch({ type: FETCH_FOODITEM_SUCCESS, payload: data });
    } else {
   
      dispatch({ type: FETCH_FOODITEM_FAIL, payload: 'Invalid response format' });
    }
    
  } catch (error) {
    dispatch({
      type: FETCH_FOODITEM_FAIL,
      payload: 'An error occurred while fetching food items',
    });
  }
};



export const deleteitem = (Id: string) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    debugger;
    dispatch({ type: DELETE_FOODITEM_REQUEST });
    console.log("f1001")

    const { data } = await Api.delete(`/api/restaurant/fooditem/${Id}`);
    console.log(data,"f1002")
    dispatch({
      type: DELETE_FOODITEM_SUCCESS,
      payload: data,
    });

    
  } catch (error) {
    dispatch({
      type: DELETE_FOODITEM_FAIL,
      payload: 'An error occurred while updating the user status',
    });
  }
};


export const deletecuisine = (Id: string) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    debugger;
    dispatch({ type: DELETE_CUISINE_REQUEST });
    console.log("f1001")

    const { data } = await Api.delete(`/api/restaurant/cuisine/${Id}`);
    console.log(data,"f1002")
    dispatch({
      type: DELETE_CUISINE_SUCCESS,
      payload: data,
    });

   
  } catch (error) {
    dispatch({
      type: DELETE_CUISINE_FAIL,
      payload: 'An error occurred while updating the user status',
    });
  }
};
export const deletecatagory = (Id: string) => async (dispatch: Dispatch<AnyAction>) => {
  try {
    debugger;
    dispatch({ type: DELETE_CATAGORY_REQUEST });
    console.log("f1001")

    const { data } = await Api.delete(`/api/restaurant/catagory/${Id}`);
    console.log(data,"f1002")
    dispatch({
      type: DELETE_CATAGORY_SUCCESS,
      payload: data,
    });

   
  } catch (error) {
    dispatch({
      type: DELETE_CATAGORY_FAIL,
      payload: 'An error occurred while updating the user status',
    });
  }
};
export const fetchSingleFoodItem = (
  id: string
): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  try {
    dispatch({ type: FETCH_SINGLE_FOOD_ITEM_REQUEST });
    const { data } = await Api.get(`/api/admin/fooditem/${id}`);

    dispatch({
      type: FETCH_SINGLE_FOOD_ITEM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: FETCH_SINGLE_FOOD_ITEM_FAIL,
        payload: error.response?.data.message || 'An error occurred while fetching the food item',
      });
    } else {
      dispatch({
        type: FETCH_SINGLE_FOOD_ITEM_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};

export const updateFoodItem = (
  id: string,
  updateData: FormData
): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch: Dispatch<AnyAction>) => {
  debugger;
  try {
    dispatch({ type: UPDATE_FOOD_ITEM_REQUEST });
   

    const { data } = await Api.put(`/api/admin/updatefooditem/${id}`, updateData);

    dispatch({
      type: UPDATE_FOOD_ITEM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: UPDATE_FOOD_ITEM_FAIL,
        payload: error.response?.data.message || 'An error occurred while updating the food item',
      });
    } else {
      dispatch({
        type: UPDATE_FOOD_ITEM_FAIL,
        payload: 'An unknown error occurred',
      });
    }
  }
};






