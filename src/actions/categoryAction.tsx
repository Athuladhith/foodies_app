import axios from 'axios';
import thunk, { ThunkAction } from 'redux-thunk';

import { RootState } from '../store';
import { 
    ADD_CATEGORY_REQUEST, 
    ADD_CATEGORY_SUCCESS, 
    ADD_CATEGORY_FAIL ,
    FETCH_FOODITEMS_REQUEST,
    FETCH_FOODITEMS_SUCCESS,
    FETCH_FOODITEMS_FAIL
} from "../constants/categoryConstants";

import { Dispatch } from 'redux';
import { AnyAction } from 'redux';
import api from '../Api'
import {getAuthConfig} from '../Apiconfig'

export const addCategory = (categoryData: FormData) => async (dispatch: Dispatch<AnyAction>) => {
    debugger;
    try {
        dispatch({ type: ADD_CATEGORY_REQUEST });
        
        console.log('enteredddd')

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };

        const { data } = await api.post("/api/restaurant/addcategory", categoryData, config);


        dispatch({
            type: ADD_CATEGORY_SUCCESS,
            payload: data,
        });

        return data.category;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            dispatch({
                type: ADD_CATEGORY_FAIL,
                payload: error.response?.data.message || 'An error occurred',
            });
        } else {
            dispatch({
                type: ADD_CATEGORY_FAIL,
                payload: 'An unknown error occurred',
            });
        }
    }
};

export const fetchFoodItemsByCategory = (categoryId: string) => async (dispatch: Dispatch<AnyAction>) => {
    try {
      const config = getAuthConfig();
      
      dispatch({ type: FETCH_FOODITEMS_REQUEST });
  
      
      const response = await api.get(`/api/users/fooditem?category=${categoryId}`,config);
  
      dispatch({
        type: FETCH_FOODITEMS_SUCCESS,
        payload: response.data,
      });
  
      return response.data; 
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        dispatch({
          type: FETCH_FOODITEMS_FAIL,
          payload: error.response?.data.message || 'An error occurred while fetching food items',
        });
      } else {
        
        dispatch({
          type: FETCH_FOODITEMS_FAIL,
          payload: 'An unknown error occurred',
        });
      }
    }
  };
