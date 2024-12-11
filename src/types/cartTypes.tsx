
export interface CartItem {
    fooditem: string;
    quantity: number;

  }
  
  export interface DeliveryInfo {
    address: string;
    city: string;
   
  }
  

  export interface CartState {
    cartItems: CartItem[];
    deliveryInfo?: DeliveryInfo;
    restaurant?: string;
  }
  

  export const ADD_TO_CART = 'ADD_TO_CART';
  export const REMOVE_ITEM_CART = 'REMOVE_ITEM_CART';
  export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
  export const CLEAR_CART = 'CLEAR_CART';
  export const SAVE_DELIVERY_INFO = 'SAVE_DELIVERY_INFO';
  export const SET_RESTAURANT_ID = 'SET_RESTAURANT_ID';
  
  interface AddToCartAction {
    type: typeof ADD_TO_CART;
    payload: CartItem;
  }
  
  interface UpdateCartQuantityAction {
    type: typeof UPDATE_CART_QUANTITY;
    payload: {
      fooditemId: string;
      quantity: number;
    };
  }
  
  interface RemoveItemCartAction {
    type: typeof REMOVE_ITEM_CART;
    payload: string; 
  }
  
  interface SaveDeliveryInfoAction {
    type: typeof SAVE_DELIVERY_INFO;
    payload: DeliveryInfo;
  }
  
  interface ClearCartAction {
    type: typeof CLEAR_CART;
  }
  
  interface SetRestaurantIdAction {
    type: typeof SET_RESTAURANT_ID;
    payload: string;
  }
  
  // Union type for all actions
  export type CartActionTypes =
    | AddToCartAction
    | UpdateCartQuantityAction
    | RemoveItemCartAction
    | SaveDeliveryInfoAction
    | ClearCartAction
    | SetRestaurantIdAction;
  