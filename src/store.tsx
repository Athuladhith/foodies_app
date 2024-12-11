import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import {thunk}  from 'redux-thunk';

import { authReducer } from './reducers/userReducer';
import {adminReducer} from './reducers/adminReducer'
import {restaurantReducer} from './reducers/restaurantReducer'
import {cartReducer} from './reducers/cartReducer'
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { deliveryBoyReducer } from './reducers/deliveryboyReducer';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  admin:adminReducer,
  restaurant:restaurantReducer,
  cart:cartReducer,
  deliveryboy:deliveryBoyReducer
});

// Enhancer setup for Redux DevTools
const composeEnhancers =
  (window as any).REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;

// Create store with thunk middleware
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Define AppDispatch type, which includes ThunkDispatch
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

export default store;