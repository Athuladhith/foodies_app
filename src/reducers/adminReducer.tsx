import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAIL,
    FETCH_RESTAURANTS_REQUEST,
    FETCH_RESTAURANTS_SUCCESS,
    FETCH_RESTAURANTS_FAIL,
    FETCH_DELIVERY_PERSONS_REQUEST,
    FETCH_DELIVERY_PERSONS_SUCCESS,
    FETCH_DELIVERY_PERSONS_FAIL,
    REGISTER_RESTAURANT_REQUEST,
    REGISTER_RESTAURANT_SUCCESS,
    REGISTER_RESTAURANT_FAIL,
    FETCH_SINGLE_RESTAURANT_REQUEST,
    FETCH_SINGLE_RESTAURANT_SUCCESS,
    FETCH_SINGLE_RESTAURANT_FAIL,
    UPDATE_RESTAURANT_REQUEST,
    UPDATE_RESTAURANT_SUCCESS,
    UPDATE_RESTAURANT_FAIL,
    BLOCK_UNBLOCK_RESTAURANT_REQUEST,
    BLOCK_UNBLOCK_RESTAURANT_SUCCESS,
    BLOCK_UNBLOCK_RESTAURANT_FAIL
} from '../constants/adminConstants';
import { AnyAction } from 'redux';

interface AdminState {
    loading: boolean;
    users: Array<any>;
    restaurants: Array<any>;
    deliveryPersons: Array<any>;
    error: string | null;
    token?: string | null;
    isAuthenticated: boolean;
    category: Array<any>;
    singleRestaurant?: any; 
}

interface RegisterrestaurantRequestAction {
    type: typeof REGISTER_RESTAURANT_REQUEST;
}
interface RegisterrestaurantSuccessAction {
    type: typeof REGISTER_RESTAURANT_SUCCESS;
    payload: any; 
}
interface RegisterrestaurantFailAction {
    type: typeof REGISTER_RESTAURANT_FAIL;
    payload: any; 
}
interface FetchUserRequestAction {
    type: typeof FETCH_USERS_REQUEST;
}  
interface FetchUserSuccessAction {
    type: typeof FETCH_USERS_SUCCESS;
    payload: any;    
}
interface FetchUserFailAction {
    type: typeof FETCH_USERS_FAIL;
    payload: any;    
}
interface FetchDeliveryPersonRequestAction {
    type: typeof FETCH_DELIVERY_PERSONS_REQUEST;      
}
interface FetchDeliveryPersonSucessAction {
    type: typeof FETCH_DELIVERY_PERSONS_SUCCESS;
    payload: any;    
}
interface FetchDeliveryPersonFailAction {
    type: typeof FETCH_DELIVERY_PERSONS_FAIL;
    payload: any;    
}
interface FetchRestaurantRequestAction {
    type: typeof FETCH_RESTAURANTS_REQUEST;      
}
interface FetchRestaurantSucessAction {
    type: typeof FETCH_RESTAURANTS_SUCCESS;
    payload: any;    
}
interface FetchRestaurantFailAction {
    type: typeof FETCH_RESTAURANTS_FAIL;
    payload: any;    
}
interface FetchSingleRestaurantRequestAction {
    type: typeof FETCH_SINGLE_RESTAURANT_REQUEST;
}
interface FetchSingleRestaurantSuccessAction {
    type: typeof FETCH_SINGLE_RESTAURANT_SUCCESS;
    payload: any;
}
interface FetchSingleRestaurantFailAction {
    type: typeof FETCH_SINGLE_RESTAURANT_FAIL;
    payload: any;
}
interface UpdateRestaurantRequestAction {
    type: typeof UPDATE_RESTAURANT_REQUEST;
}
interface UpdateRestaurantSuccessAction {
    type: typeof UPDATE_RESTAURANT_SUCCESS;
    payload: any;
}
interface UpdateRestaurantFailAction {
    type: typeof UPDATE_RESTAURANT_FAIL;
    payload: any;
}

type AuthActionTypes =
    | RegisterrestaurantRequestAction
    | RegisterrestaurantSuccessAction
    | RegisterrestaurantFailAction
    | FetchUserRequestAction
    | FetchUserSuccessAction
    | FetchUserFailAction
    | FetchDeliveryPersonRequestAction
    | FetchDeliveryPersonSucessAction
    | FetchDeliveryPersonFailAction
    | FetchRestaurantRequestAction
    | FetchRestaurantSucessAction
    | FetchRestaurantFailAction
    | FetchSingleRestaurantRequestAction
    | FetchSingleRestaurantSuccessAction
    | FetchSingleRestaurantFailAction
    | UpdateRestaurantRequestAction
    | UpdateRestaurantSuccessAction
    | UpdateRestaurantFailAction;

const initialState: AdminState = {
    loading: false,
    users: [],
    restaurants: [],
    deliveryPersons: [],
    error: null,
    isAuthenticated: false,
    category: [],
    singleRestaurant: null,
};

export const adminReducer = (state = initialState, action: AuthActionTypes): AdminState => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
        case FETCH_RESTAURANTS_REQUEST:
        case FETCH_DELIVERY_PERSONS_REQUEST:
        case FETCH_SINGLE_RESTAURANT_REQUEST:
        case UPDATE_RESTAURANT_REQUEST:
            return { ...state, loading: true };

        case REGISTER_RESTAURANT_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
            };
        case REGISTER_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                restaurants: action.payload,
            };
        case REGISTER_RESTAURANT_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                error: action.payload,
            };

        case FETCH_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload };

        case FETCH_RESTAURANTS_SUCCESS:
            return { ...state, loading: false, restaurants: action.payload };

        case FETCH_DELIVERY_PERSONS_SUCCESS:
            return { ...state, loading: false, deliveryPersons: action.payload };

        case FETCH_SINGLE_RESTAURANT_SUCCESS:
            return { ...state, loading: false, singleRestaurant: action.payload };

        case UPDATE_RESTAURANT_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurants: state.restaurants.map(restaurant =>
                    restaurant._id === action.payload._id ? action.payload : restaurant
                ),
            };

        case FETCH_USERS_FAIL:
        case FETCH_RESTAURANTS_FAIL:
        case FETCH_DELIVERY_PERSONS_FAIL:
        case FETCH_SINGLE_RESTAURANT_FAIL:
        case UPDATE_RESTAURANT_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
