import {
    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAIL,
    REMOVE_ITEM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    FETCH_CART_ITEMS,
    SAVE_DELIVERY_INFO,
    SET_RESTAURANT_ID
  } from '../constants/cartConstants';
  
  interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    userId?: string;
    totalPrice:number;
  }
  
  interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
    deliveryInfo: any;
    restaurantId: string | null;
    totalPrice:number

  }
  
  const initialState: CartState = {
    cartItems: [],
    loading: false,
    error: null,
    deliveryInfo: null,
    restaurantId: null,
    totalPrice:0
  };
  
  export const cartReducer = (state = initialState, action: any): CartState => {
    switch (action.type) {
        case ADD_TO_CART_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ADD_TO_CART_SUCCESS:
            const { item, userId } = action.payload;
            const itemExists = state.cartItems.find((cartItem) => cartItem._id === item._id);
  
            if (itemExists) {
                return {
                    ...state,
                    loading: false,
                    cartItems: state.cartItems.map((cartItem) =>
                        cartItem._id === item._id
                            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                            : cartItem
                    ),
                };
            } else {
                return {
                    ...state,
                    loading: false,
                    cartItems: [...state.cartItems, { ...item, userId }],
                };
            }
        case ADD_TO_CART_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            case FETCH_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload.items,
        totalPrice: action.payload.totalPrice,
      };
        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(cartItem => cartItem._id !== action.payload),
            };
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(cartItem =>
                    cartItem._id === action.payload.itemId
                        ? { ...cartItem, quantity: action.payload.quantity }
                        : cartItem
                ),
            };
        case CLEAR_CART:
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
  };
  
  export default cartReducer;
  