import axios, { AxiosError } from 'axios';
import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    OTP_USER_REQUEST,
    OTP_USER_SUCCESS,
    OTP_USER_FAIL,
    REGISTER_GOOGLE_REQUEST,
    REGISTER_GOOGLE_SUCCESS,
    REGISTER_GOOGLE_FAIL,
    LOGIN_USER_REQUEST ,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL

} from '../constants/userConatants';
import { Dispatch } from 'redux';
import { AnyAction } from 'redux';
import{getAuthConfig} from '../Apiconfig'
import thunk, { ThunkAction } from 'redux-thunk';
import { ConfirmationNumberSharp } from '@mui/icons-material';



interface UserData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phoneNumber: string;
    avatar?: string;
}

export const register = (userData: FormData) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };
        console.log(userData,"byyeee")
        const entriesArray = Array.from(userData.entries());
        console.log("FormData entries:");
        entriesArray.forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });

        const { data } = await axios.post("http://localhost:5000/api/users/signup", userData);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            dispatch({
                type: REGISTER_USER_FAIL,
                payload: error.response?.data.message || 'An error occurred',
            });
        } else {
            dispatch({
                type: REGISTER_USER_FAIL,
                payload: 'An unknown error occurred',
            });
        }
    }
};


interface decodedToken {  
    id: string;  
    email: string;  
    name: string;  
    avatar?: string;  
    
  }

  interface userData {
    email: string;
    password: string;
    
}
export const login = (userData: { email: string; password: string }) => async (dispatch: Dispatch<AnyAction>) => {

    try {
      dispatch({ type:  LOGIN_USER_REQUEST });
    
  
      const response = await axios.post("http://localhost:5000/api/users/login", userData,{
        headers: {
          'Content-Type': 'application/json',
        }
      });
      localStorage.setItem('tokenss', response.data.token);
      console.log(response.data.token,'tokennnnnfrom backenddddd')
localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log(response.data.token,"show")
      console.log(response.data.user,'userdetails')
    //   localStorage.setItem('token', response.data.token);
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
            users: response.data.user,
            token: response.data.token,
        },
      });
      
  
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch({
          type:  LOGIN_USER_FAIL,
          payload: error.response?.data.message || 'An error occurred',
        });
      } else {
        dispatch({
          type:  LOGIN_USER_FAIL,
          payload: 'An unknown error occurred',
        });
      }
    }
  };
  

export const googleregister=(userData: decodedToken )=>async(dispatch:Dispatch<AnyAction>)=>{
    try {
        dispatch({type:REGISTER_GOOGLE_REQUEST})
        const {data}=await axios.post("http://localhost:5000/api/users/googlesignup", userData)
        dispatch({
            type:REGISTER_GOOGLE_SUCCESS,
            payload:data.user
        })
        return data.user
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            dispatch({
                type: REGISTER_GOOGLE_FAIL,
                payload: error.response?.data.message || 'An error occurred',
            });
        } else {
            dispatch({
                type: REGISTER_GOOGLE_FAIL,
                payload: 'An unknown error occurred',
            });
        }
    }
}


export const verifyOtp = (otp: string) => async (dispatch: Dispatch<AnyAction>) => {
    try {
        dispatch({ type: OTP_USER_REQUEST });
        console.log(otp,"ooooo")

        const { data } = await axios.post('http://localhost:5000/api/users/verify-otp', { receivedOtp: otp },
            { headers: { 'Content-Type': 'application/json' }}
         );

        dispatch({
            type: OTP_USER_SUCCESS,
            payload: data,
        });

    } catch (error: any) {
        dispatch({
            type: OTP_USER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
}