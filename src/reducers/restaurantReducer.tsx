import {
  LOGIN_RESTAURANT_REQUEST,
  LOGIN_RESTAURANT_SUCCESS,
  LOGIN_RESTAURANT_FAIL,
  CUISINE_ADD_SUCCESS,
  CUISINE_ADD_REQUEST,
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
   LOGIN_RESTAURANTS_SUCCESS,
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
  FETCH_SINGLE_FOOD_ITEM_REQUEST,
  FETCH_SINGLE_FOOD_ITEM_SUCCESS,
  FETCH_SINGLE_FOOD_ITEM_FAIL,
  UPDATE_FOOD_ITEM_REQUEST,
  UPDATE_FOOD_ITEM_SUCCESS,
  UPDATE_FOOD_ITEM_FAIL,
} from "../constants/restaurantConstants";
import { 
  ADD_CATEGORY_REQUEST, 
  ADD_CATEGORY_SUCCESS, 
  ADD_CATEGORY_FAIL ,
  FETCH_FOODITEMS_REQUEST,
  FETCH_FOODITEMS_SUCCESS,
  FETCH_FOODITEMS_FAIL
} from "../constants/categoryConstants";

interface RestaurantState {
  restaurant: Array<any>;
  loading: boolean;
  token: string | null;
  error: string | null;
  DeliveryBoy: Array<any>;
  isAuthenticated: boolean;
  category:Array<any>
  cuisine:Array<any>
  foodItem:Array<any>
  singleFoodItem?: any;
}

interface RestaurantLoginRequestAction {
  type: typeof LOGIN_RESTAURANT_REQUEST;
}

interface RestaurantLoginSuccessAction {
  type: typeof LOGIN_RESTAURANT_SUCCESS;
  payload: any;
}
interface RestaurantSLoginSuccessAction {
  type: typeof LOGIN_RESTAURANTS_SUCCESS;
  payload: any;
}

interface RestaurantLoginFailAction {
  type: typeof LOGIN_RESTAURANT_FAIL;
  payload: any;
}
interface AddCategoryRequestAction{
  type:typeof ADD_CATEGORY_REQUEST;
}
interface AddCategorySuccessAction{
  type:typeof ADD_CATEGORY_SUCCESS;
  payload:any;
}
interface AddCategoryFailAction{
  type:typeof ADD_CATEGORY_FAIL;
  payload:any;
}
interface AddCuisineRequestAction{
  type:typeof CUISINE_ADD_REQUEST;
}
interface AddCUISINESuccessAction{
  type:typeof CUISINE_ADD_SUCCESS;
  payload:any;
}
interface AddCuisineFailAction{
  type:typeof CUISINE_ADD_FAIL;
  payload:any;
}
interface AddFooditemRequestAction{
  type:typeof ADD_FOOD_ITEM_REQUEST;
}
interface AddFooditemSuccessAction{
  type:typeof ADD_FOOD_ITEM_SUCCESS;
  payload:any;
}
interface AddFooditemFailAction{
  type:typeof ADD_FOOD_ITEM_FAIL;
  payload:any;
}

interface removeFooditemRequestAction{
  type:typeof DELETE_FOODITEM_REQUEST;
}
interface removeFooditemSuccessAction{
  type:typeof DELETE_FOODITEM_SUCCESS;
  payload:any;
}
interface removeFooditemFailAction{
  type:typeof DELETE_FOODITEM_FAIL;
  payload:any;
}


interface removeCUISINERequestAction{
  type:typeof DELETE_CUISINE_REQUEST;
}
interface removeCUISINESuccessAction{
  type:typeof DELETE_CUISINE_SUCCESS;
  payload:any;
}
interface removeCUISINEFailAction{
  type:typeof DELETE_CUISINE_FAIL;
  payload:any;
}

interface removeCATequestAction{
  type:typeof DELETE_CATAGORY_REQUEST;
}
interface removeCATSuccessAction{
  type:typeof DELETE_CATAGORY_SUCCESS;
  payload:any;
}
interface removeCATFailAction{
  type:typeof DELETE_CATAGORY_FAIL;
  payload:any;
}

interface FetchCatagoryRequestAction {
  type: typeof FETCH_CATEGORIES_REQUEST;      
}
interface FetchCatagorySucessAction {
  type: typeof FETCH_CATEGORIES_SUCCESS;
  payload:any;    
}
interface FetchCatagoryFailAction {
  type: typeof FETCH_CATEGORIES_FAIL;
  payload:any;    
}


interface FetchCUSINERequestAction {
  type: typeof FETCH_CUISINE_REQUEST;      
}
interface FetchCUSINESucessAction {
  type: typeof FETCH_CUISINE_SUCCESS;
  payload:any;    
}
interface FetchCUSINEFailAction {
  type: typeof FETCH_CUISINE_FAIL;
  payload:any;    
}
interface FetchfoditemRequestAction {
  type: typeof FETCH_FOODITEM_REQUEST;      
}
interface FetchfooditemSucessAction {
  type: typeof FETCH_FOODITEM_SUCCESS;
  payload:any;    
}
interface FetchfooditemFailAction {
  type: typeof FETCH_FOODITEM_FAIL;
  payload:any;    
}

interface FetchfoditemSRequestAction {
  type: typeof FETCH_FOODITEMS_REQUEST;      
}
interface FetchfooditemSSucessAction {
  type: typeof FETCH_FOODITEMS_SUCCESS;
  payload:any;    
}
interface FetchfooditemSFailAction {
  type: typeof FETCH_FOODITEMS_FAIL;
  payload:any;    
}

interface FetchsinglefooditemSRequestAction {
  type: typeof FETCH_SINGLE_FOOD_ITEM_REQUEST;      
}
interface FetchsinglefooditemSSucessAction {
  type: typeof FETCH_SINGLE_FOOD_ITEM_SUCCESS;
  payload:any;    
}
interface FetchsinglefooditemSFailAction {
  type: typeof FETCH_SINGLE_FOOD_ITEM_FAIL;
  payload:any;    
}
interface UpdatesinglefooditemSRequestAction {
  type: typeof UPDATE_FOOD_ITEM_REQUEST;      
}
interface UpdatesinglefooditemSSucessAction {
  type: typeof UPDATE_FOOD_ITEM_SUCCESS;
  payload:any;    
}
interface UpdatesinglefooditemSFailAction {
  type: typeof UPDATE_FOOD_ITEM_FAIL;
  payload:any;    
}


type AuthActionTypes =
  | RestaurantLoginSuccessAction
  | RestaurantLoginRequestAction
  | RestaurantLoginFailAction
  |AddCategoryRequestAction
  |AddCategorySuccessAction
  | AddCategoryFailAction
  |AddCuisineRequestAction
  |AddCUISINESuccessAction
  |AddCuisineFailAction
  |AddFooditemRequestAction
  |AddFooditemSuccessAction
  |AddFooditemFailAction
  |FetchCatagoryRequestAction
  |FetchCatagorySucessAction
  |FetchCatagoryFailAction
  |FetchCUSINERequestAction
  |FetchCUSINESucessAction
  |FetchCUSINEFailAction
  |RestaurantSLoginSuccessAction 
  |FetchfooditemFailAction 
  |FetchfooditemSucessAction
  |FetchfoditemRequestAction
  |removeFooditemRequestAction
  |removeFooditemSuccessAction
  |removeFooditemFailAction
  |removeCATFailAction
  |removeCATSuccessAction
  |removeCATequestAction
  |removeCUISINEFailAction
  |removeCUISINESuccessAction
  |removeCUISINERequestAction
  |FetchfooditemSFailAction 
  |FetchfooditemSSucessAction
  |FetchfoditemSRequestAction
  |FetchsinglefooditemSFailAction 
  |FetchsinglefooditemSSucessAction
  |FetchsinglefooditemSRequestAction
  |UpdatesinglefooditemSFailAction
  |UpdatesinglefooditemSRequestAction
  |UpdatesinglefooditemSSucessAction



const initialState: RestaurantState = {
  loading: false,
  restaurant: [],
  isAuthenticated: false,
  error: null,
  DeliveryBoy: [],
  token: localStorage.getItem('token') || null,
  category:[],
  cuisine:[],
  foodItem:[],
  singleFoodItem:null
};

export const restaurantReducer = (
  state = initialState,
  action: AuthActionTypes
): RestaurantState => {
  switch (action.type) {
    case FETCH_FOODITEMS_REQUEST:
    case FETCH_FOODITEM_REQUEST:
    case FETCH_CATEGORIES_REQUEST:
      case LOGIN_RESTAURANT_REQUEST:
          return {
              ...state,
              loading: true,
              isAuthenticated: false,
          };
      
          case LOGIN_RESTAURANT_SUCCESS:
            return{
              ...state,
              loading:false,
              isAuthenticated:true,
              restaurant:action.payload
            };
      case LOGIN_RESTAURANT_FAIL:
          return {
              ...state,
              loading: false,
              isAuthenticated: false,
              token: null,
              error: action.payload,
          };
          case ADD_CATEGORY_REQUEST:
                return {
                    ...state,
                    loading: true,
                    isAuthenticated: false,
                };
          
          case ADD_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                category: action.payload,
            };

            
            case FETCH_CATEGORIES_SUCCESS:
              localStorage.setItem('token', action.payload.token);
              return{
                ...state,
                loading:false,
                isAuthenticated: false,
                category: action.payload,
                

                
              }
            
              case FETCH_FOODITEM_SUCCESS:
                return{
                  ...state,
                  loading:false,
                  isAuthenticated: false,
                  foodItem: action.payload,
                  
                }


              
         case FETCH_CATEGORIES_FAIL:
          case ADD_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                category: action.payload,
            };
            case FETCH_CUISINE_REQUEST:
            case CUISINE_ADD_REQUEST:
                return {
                    ...state,
                    loading: true,
                    isAuthenticated: false,
                };
            case CUISINE_ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                cuisine: action.payload,
            };
            case FETCH_CUISINE_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                cuisine: action.payload,
            };
            case FETCH_CUISINE_FAIL:
            case CUISINE_ADD_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                cuisine: action.payload,
            };
            case ADD_FOOD_ITEM_REQUEST:
            return { ...state,isAuthenticated:true, loading: true };

            case ADD_FOOD_ITEM_SUCCESS:
           return { ...state,isAuthenticated:true, loading: false, foodItem: action.payload };
            
           case FETCH_FOODITEM_FAIL:
             case ADD_FOOD_ITEM_FAIL:
            return { ...state, isAuthenticated:false, loading: false, error: action.payload };
            case FETCH_FOODITEMS_SUCCESS:
              return {
                ...state,
                isAuthenticated:false, loading: false,
                foodItem: action.payload,
              };
            case FETCH_FOODITEMS_FAIL:
              return {
                ...state,
                isAuthenticated:false, loading: false,
                error: action.payload,
              };
              // Handling fetch single food item actions
    case FETCH_SINGLE_FOOD_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };

    case FETCH_SINGLE_FOOD_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        singleFoodItem: action.payload,
      };

    case FETCH_SINGLE_FOOD_ITEM_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    // Handling update single food item actions
    case UPDATE_FOOD_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: true,
      };

    case UPDATE_FOOD_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        foodItem: action.payload,
      };

    case UPDATE_FOOD_ITEM_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        error: action.payload,
      };

      default:
          return state;
  }
};
