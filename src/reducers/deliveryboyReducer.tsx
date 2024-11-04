import {
    FETCH_DELIVERYBOYS_LOGIN_REQUEST,
    FETCH_DELIVERYBOYS_LOGIN_SUCCESS,
    FETCH_DELIVERYBOYS_LOGIN_FAIL,
    ADD_DELIVERYBOY_REQUEST,
    ADD_DELIVERYBOY_SUCCESS,
    ADD_DELIVERYBOY_FAIL,
    DELETE_DELIVERYBOY_REQUEST,
    DELETE_DELIVERYBOY_SUCCESS,
    DELETE_DELIVERYBOY_FAIL,
    UPDATE_DELIVERYBOY_REQUEST,
    UPDATE_DELIVERYBOY_SUCCESS,
    UPDATE_DELIVERYBOY_FAIL,
  } from "../constants/deliveryboyconstant";
  
  interface DeliveryBoyState {
    deliveryBoys: Array<any>;
    loading: boolean;
    error: string | null;
    singleDeliveryBoy?: any;
    token: string | null;
    isAuthenticated: boolean;
  }
  
  interface FetchDeliveryBoysRequestAction {
    type: typeof FETCH_DELIVERYBOYS_LOGIN_REQUEST;
  }
  
  interface FetchDeliveryBoysSuccessAction {
    type: typeof FETCH_DELIVERYBOYS_LOGIN_SUCCESS;
    payload: any;
  }
  
  interface FetchDeliveryBoysFailAction {
    type: typeof FETCH_DELIVERYBOYS_LOGIN_FAIL;
    payload: any;
  }
  
  interface AddDeliveryBoyRequestAction {
    type: typeof ADD_DELIVERYBOY_REQUEST;
  }
  
  interface AddDeliveryBoySuccessAction {
    type: typeof ADD_DELIVERYBOY_SUCCESS;
    payload: any;
  }
  
  interface AddDeliveryBoyFailAction {
    type: typeof ADD_DELIVERYBOY_FAIL;
    payload: any;
  }
  
  interface DeleteDeliveryBoyRequestAction {
    type: typeof DELETE_DELIVERYBOY_REQUEST;
  }
  
  interface DeleteDeliveryBoySuccessAction {
    type: typeof DELETE_DELIVERYBOY_SUCCESS;
    payload: any;
  }
  
  interface DeleteDeliveryBoyFailAction {
    type: typeof DELETE_DELIVERYBOY_FAIL;
    payload: any;
  }
  
  interface UpdateDeliveryBoyRequestAction {
    type: typeof UPDATE_DELIVERYBOY_REQUEST;
  }
  
  interface UpdateDeliveryBoySuccessAction {
    type: typeof UPDATE_DELIVERYBOY_SUCCESS;
    payload: any;
  }
  
  interface UpdateDeliveryBoyFailAction {
    type: typeof UPDATE_DELIVERYBOY_FAIL;
    payload: any;
  }
  
  type DeliveryBoyActionTypes =
    | FetchDeliveryBoysRequestAction
    | FetchDeliveryBoysSuccessAction
    | FetchDeliveryBoysFailAction
    | AddDeliveryBoyRequestAction
    | AddDeliveryBoySuccessAction
    | AddDeliveryBoyFailAction
    | DeleteDeliveryBoyRequestAction
    | DeleteDeliveryBoySuccessAction
    | DeleteDeliveryBoyFailAction
    | UpdateDeliveryBoyRequestAction
    | UpdateDeliveryBoySuccessAction
    | UpdateDeliveryBoyFailAction;
  
  const initialState: DeliveryBoyState = {
    deliveryBoys: [],
    loading: false,
    token: localStorage.getItem('token') || null,
    error: null,
    singleDeliveryBoy: null,
    isAuthenticated: false,
  };
  
  export const deliveryBoyReducer = (
    state = initialState,
    action: DeliveryBoyActionTypes
  ): DeliveryBoyState => {
    switch (action.type) {
      case FETCH_DELIVERYBOYS_LOGIN_REQUEST:
      case ADD_DELIVERYBOY_REQUEST:
      case DELETE_DELIVERYBOY_REQUEST:
      case UPDATE_DELIVERYBOY_REQUEST:
        return {
          ...state,
          loading: true,
          isAuthenticated:false,
        };
  
      case FETCH_DELIVERYBOYS_LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          isAuthenticated:true,
          deliveryBoys: action.payload,
        };
  
      case FETCH_DELIVERYBOYS_LOGIN_FAIL:
      case ADD_DELIVERYBOY_FAIL:
      case DELETE_DELIVERYBOY_FAIL:
      case UPDATE_DELIVERYBOY_FAIL:
        return {
          ...state,
          loading: false,
          isAuthenticated:false,
          error: action.payload,
        };
  
      case ADD_DELIVERYBOY_SUCCESS:
        return {
          ...state,
          loading: false,
          deliveryBoys: [...state.deliveryBoys, action.payload],
        };
  
      case DELETE_DELIVERYBOY_SUCCESS:
        return {
          ...state,
          loading: false,
          deliveryBoys: state.deliveryBoys.filter(
            (deliveryBoy) => deliveryBoy.id !== action.payload.id
          ),
        };
  
      case UPDATE_DELIVERYBOY_SUCCESS:
        return {
          ...state,
          loading: false,
          deliveryBoys: state.deliveryBoys.map((deliveryBoy) =>
            deliveryBoy.id === action.payload.id ? action.payload : deliveryBoy
          ),
        };
  
      default:
        return state;
    }
  };
  