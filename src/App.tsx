import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/user/Login';
import Register from './components/user/Register';
import AdminLogin from './components/admin/Adminlogin';
import RestaurantLogin from './components/restaurant/Restaurantlogin';
import OtpVerification from './components/user/Otp';
import Home from './components/user/Home';
import AdminHomePage from './components/admin/AdminHomePage';
import RegisterRestaurant from './components/admin/RegisterRestaurant';
import RegisterDeliveryPerson from './components/admin/RegisterDeliveryPerson';
import UserTable from './components/admin/User';
import Restaurent from './components/admin/Restaurent'
import DeliveryBoy from './components/admin/DeliverBoy';
import RestaurantHome from './components/restaurant/RestaurantHome';
import Category from './components/restaurant/Category';
import Addcusine from './components/restaurant/Addcusine'
import AddFoodItem from './components/restaurant/Addfooditem';
import Categorylist from './components/restaurant/Catagorylist';
import FoodItemLists from './components/restaurant/FoodItemLists'
import Cuisine from './components/restaurant/Cuisine';
import Navbar1 from './components/user/Navbar1';
import Fooditem from './components/user/Fooditem';
import Restaurantdetails from './components/user/Restaurantdetails'
import Profile from './components/user/Profile';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Cart from './components/user/Cart'
import EditRestaurant from './components/admin/EditRestaurant';
import CheckoutPage from './components/user/CheckoutPage';

import { useNavigate } from 'react-router-dom';
import OrderDetailsPage from './components/user/orderDetailsPage';
import ProctorRoute from './ProctorRoute';
import EditFoodItem from './components/restaurant/editFooditem';
import OrdersPage from './components/user/orderPage';
import ChatPage from './components/user/Chat';
import DeliveryBoyHome from './components/deliveryboy/deliveryboyHome';
import DeliveryPersonTable from './components/admin/DeliverBoy';
import DeliveryBoylogin from './components/deliveryboy/Deliveryboy';
import TrackingPage from './components/user/TrackingPage'
import Dashboard from './components/restaurant/Dashboard';
import RestaurantChatPage from './components/restaurant/restaurantChat';


function ProtectedRoute({ children, isAuthenticated }: { children: JSX.Element; isAuthenticated: boolean }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function ProtectRoute({ children, isAuthenticated }: { children: JSX.Element; isAuthenticated: boolean }) {
  return isAuthenticated ? children : <Navigate to="/adminlogin" />;
}

function App() {

  const token = localStorage.getItem('tokenss');
  console.log(token,'token in the api.tsx')
  const admintoken =localStorage.getItem('admintoken')
  



  const adminAuthenticated=!!admintoken
  
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const{isAuthenticated,loading,error,user}=useSelector((state:RootState)=>state.auth)
  useEffect(()=> {
   
  },[user,admintoken])

 


  console.log(isAuthenticated, "auth")
  const isUserAuthenticated= token? true: false;
  const isaAdminAuthenticated=admintoken?true:false;
  console.log(isUserAuthenticated, "ïuuu")
  console.log(isaAdminAuthenticated,'adminlogin')
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={isUserAuthenticated ? <Navigate to="/home" /> : <Login />}
          />
        <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={isUserAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />   


          <Route
            path="/adminlogin"
            element={isaAdminAuthenticated ? <Navigate to="/adminhome" /> : <AdminLogin />}
          />
          <Route
            path="/adminhome"
            element={
              <ProtectRoute isAuthenticated={isaAdminAuthenticated}>
                <AdminHomePage />
              </ProtectRoute>
            }
          />
          <Route
  path="/adminhome"
  element={
    admintoken ? <AdminHomePage /> : <Navigate to="/adminlogin" />
  }
/>
          
           <Route path="/register" element={<Register />} />
            <Route path="/adminlogin" element={<AdminLogin/>} /> 
          <Route path="/restaurantlogin" element={<RestaurantLogin />} />
          <Route path="/deliveryboylogin" element={<DeliveryBoylogin/>} />
          <Route path='/otp' element={<OtpVerification/>}/>
         
          <Route path='/home' element={<ProctorRoute><Home/></ProctorRoute>}/>
           <Route path='/adminhome' element={adminAuthenticated?<AdminHomePage/>:<AdminLogin/>}/> 
          <Route path='/registerdeliveryboy' element={adminAuthenticated?<RegisterDeliveryPerson/>:<AdminLogin/>}/>
          <Route path='/registerrestaurant' element={adminAuthenticated?<RegisterRestaurant/>:<AdminLogin/>}/>
          <Route path='/user' element={adminAuthenticated?<UserTable/>:<AdminLogin />} />
        <Route path='/restaurant' element={adminAuthenticated?<Restaurent/>:<AdminLogin />} />
        <Route path='/deliveryboy' element={adminAuthenticated?<DeliveryBoy/>:<Login/>}/>
        <Route path ='/restauranthome' element={<RestaurantHome/>}/>
        <Route path='/addCategory' element={<Category/>}/>
        <Route path='/addcuisine' element={<Addcusine/>}/>
        <Route path='/addfooditem' element={<AddFoodItem/>}/>
        <Route path='/categorylist' element={<Categorylist/>}/>
       <Route path='/fooditem' element={<FoodItemLists/>}/>
       <Route path='/cuisine' element={<Cuisine/>}/>
       <Route path='/Navbar1' element={<ProctorRoute><Navbar1/></ProctorRoute>}/>
       <Route path="/category/:categoryId" element={<ProctorRoute><Fooditem/></ProctorRoute>}/>
       <Route path="/restaurant/:id" element={<ProctorRoute><Restaurantdetails/></ProctorRoute>}/>
       <Route path="/profile" element={<ProctorRoute><Profile /></ProctorRoute>} />
       <Route path='/cart' element={<ProctorRoute><Cart/></ProctorRoute>}/>
       <Route path='/editrestaurant/:id' element={<EditRestaurant/>}/>
       <Route path="/checkout" element={<ProctorRoute><CheckoutPage /></ProctorRoute>} />
       <Route path='/orderdetails' element={<ProctorRoute><OrderDetailsPage/></ProctorRoute>}/>
       <Route path='/orders' element={<OrdersPage/>}/>
       <Route path='/editfooditem/:id' element={<EditFoodItem/>}/>
        <Route path='/chat/:id' element={<ChatPage/>}/>
       <Route path='/deliveryboyhome' element={<DeliveryBoyHome/>}/> 
       <Route path="/track-order/:orderId" element={<TrackingPage />} /> 
       <Route path='/dashboard' element={<Dashboard/>}/>
       <Route path='/restaurantchat' element={<RestaurantChatPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
