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
    LOGIN_USER_FAIL,
} from '../constants/userConatants';
import {
    LOGIN_ADMIN_REQUEST,
    LOGIN_ADMIN_SUCCESS,
    LOGIN_ADMIN_FAIL,
    REGISTER_RESTAURANT_REQUEST,
    REGISTER_RESTAURANT_SUCCESS,
    REGISTER_RESTAURANT_FAIL,
    REGISTER_DELIVERY_PERSON_REQUEST,
    REGISTER_DELIVERY_PERSON_SUCCESS,
    REGISTER_DELIVERY_PERSON_FAIL
} from '../constants/adminConstants'
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    
}


interface AuthState {
    admin:User|null
    user: User|null; 
    loading: boolean;
    isAuthenticated: boolean;
    isadminAuthenticated: boolean;
    token?: string | null;
    error?: any; 
}


interface RegisterUserRequestAction {
    type: typeof REGISTER_USER_REQUEST;
}
interface RegistergoogleRequestAction {
    type: typeof REGISTER_GOOGLE_REQUEST;
}

interface RegistergoogleSuccessAction {
    type: typeof REGISTER_GOOGLE_SUCCESS;
    payload: any; 
}

interface RegistergoogleFailAction {
    type: typeof REGISTER_GOOGLE_FAIL;
    payload: any; 
}

interface RegisterUserSuccessAction {
    type: typeof REGISTER_USER_SUCCESS;
    payload: User; 
}

interface RegisterUserFailAction {
    type: typeof REGISTER_USER_FAIL;
    payload: any; 
}

interface OtpUserRequestAction {
    type: typeof OTP_USER_REQUEST;
}

interface OtpUserSuccessAction {
    type: typeof OTP_USER_SUCCESS;
    payload: any; 
}

interface OtpUserFailAction {
    type: typeof OTP_USER_FAIL;
    payload: any; 
}
interface LoginUserRequestAction {
    type: typeof LOGIN_USER_REQUEST;
}

interface LoginUserSuccessAction {
    type: typeof LOGIN_USER_SUCCESS;
    payload: {
        user: User;
        token: string;
    };
}

interface LoginUserFailAction {
    type: typeof LOGIN_USER_FAIL;
    payload: any; 
}

interface LoginAdminRequestAction {
    type: typeof LOGIN_ADMIN_REQUEST;
}

interface LoginAdminSuccessAction {
    type: typeof LOGIN_ADMIN_SUCCESS;
    payload: any; 
}

interface LoginAdminFailAction {
    type: typeof LOGIN_ADMIN_FAIL;
    payload: any; 
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
interface RegisterDeliverypersonRequestAction {
    type: typeof REGISTER_DELIVERY_PERSON_REQUEST;
}

interface RegisterDeliverypersonSuccessAction {
    type: typeof REGISTER_DELIVERY_PERSON_SUCCESS;
    payload: any; 
}

interface RegisterDeliverypersonFailAction {
    type: typeof REGISTER_DELIVERY_PERSON_FAIL;
    payload: any; 
}
// Union type for all possible actions
type AuthActionTypes =
    | RegisterUserRequestAction
    | RegisterUserSuccessAction
    | RegisterUserFailAction
    | OtpUserRequestAction
    | OtpUserSuccessAction
    | OtpUserFailAction
    |RegistergoogleRequestAction
    |RegistergoogleSuccessAction
    |RegistergoogleFailAction
    |LoginUserRequestAction
    |LoginUserSuccessAction
    |LoginUserFailAction
    |LoginAdminRequestAction
    |LoginAdminSuccessAction
    |LoginAdminFailAction
    |RegisterrestaurantRequestAction
    |RegisterrestaurantSuccessAction
    |RegisterrestaurantFailAction
    |RegisterDeliverypersonRequestAction
    |RegisterDeliverypersonSuccessAction
    |RegisterDeliverypersonFailAction
   


const initialState: AuthState = {
    admin:null,
    user: null, 
    loading: false,
    isAuthenticated: false,
    isadminAuthenticated: false,
    token: localStorage.getItem('token') || null,
};

export const authReducer = (
    state = initialState,
    action: AuthActionTypes
): AuthState => {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
            };
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
            };
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };
        case OTP_USER_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
            };
        case OTP_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
            };
        case OTP_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };
        case REGISTER_GOOGLE_REQUEST:
            return{
                ...state,
                loading:true,
                isAuthenticated:false,
            }
        case REGISTER_GOOGLE_SUCCESS:
            return{
                ...state,
                loading:false,
                isAuthenticated:true,
                user:action.payload
            }
        case REGISTER_GOOGLE_FAIL:
            return{
                ...state,
                loading:false,
                isAuthenticated:false,
                user:null,
                error:action.payload
            };
            case LOGIN_USER_REQUEST:
                return {
                  ...state,
                  loading: true,
                  isAuthenticated: false,
                };
              case LOGIN_USER_SUCCESS:
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.users));
                console.log('User logged in:', JSON.stringify(action.payload.users));
                console.log('User token:', JSON.stringify(action.payload.token));
                console.log('Admin logged in:', JSON.stringify(action.payload.admin));
                return {
                  ...state,
                  loading: false,
                  isAuthenticated: true,
                  user: action.payload.users,
                  admin:action.payload.admin,
                  token: action.payload.token,
                };
              case LOGIN_USER_FAIL:
                localStorage.removeItem('token');
                return {
                  ...state,
                  loading: false,
                  isAuthenticated: false,
                  user: null,
                  token: null,
                  error: action.payload,
                };
          
              // Admin login case
              case LOGIN_ADMIN_REQUEST:
                return {
                  ...state,
                  loading: true,
                  isadminAuthenticated: false,
                };
              case LOGIN_ADMIN_SUCCESS:
                localStorage.setItem('admintoken', action.payload.token);
                localStorage.setItem('admin', JSON.stringify(action.payload.admin));
                console.log('Admin logged in:', JSON.stringify(action.payload.admin));
                return {
                  ...state,
                  loading: false,
                  isadminAuthenticated: true,
                  admin: action.payload.admin,
                  token: action.payload.token,
                };
              case LOGIN_ADMIN_FAIL:
                localStorage.removeItem('admintoken');
                return {
                  ...state,
                  loading: false,
                  isadminAuthenticated: false,
                  admin: null,
                  token: null,
                  error: action.payload,
                };
                    
                        case REGISTER_DELIVERY_PERSON_REQUEST:
                            return {
                                ...state,
                                loading: true,
                                isAuthenticated: false,
                            };
                        case REGISTER_DELIVERY_PERSON_SUCCESS:
                            return {
                                ...state,
                                loading: false,
                                isAuthenticated: true,
                                user: action.payload,
                            };
                        case REGISTER_DELIVERY_PERSON_FAIL:
                            return {
                                ...state,
                                loading: false,
                                isAuthenticated: false,
                                user: null,
                                error: action.payload,
                            };            

        default:
            return state;
    }
};