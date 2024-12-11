import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { RootState } from '../../store';
import { googleregister, login } from "../../actions/userAction";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

interface AuthState {
  isAuthenticated: boolean;
  error: any; 
  loading: boolean;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch =useDispatch();
  const navigate =useNavigate()
  const{isAuthenticated,loading,error,user}=useSelector((state:RootState)=>state.auth)
  console.log(isAuthenticated,'hejkkkkkkkkkkkkkkk')
  console.log(user,'userrrrr')
 useEffect(()=>{
  
  if (isAuthenticated) {
    toast.success("Login successful!"); 
    setTimeout(() => {
      navigate ('/home');
    },0); 
  }
  if (error) {
    console.log(error,'erroorrrrhere');
    toast.error(error); 
  }
 },[dispatch,isAuthenticated,error])

  const handleGoogleLoginSuccess = (response: any) => {
    console.log("Google login success:", response);
  
    if (response.credential) {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
  
      const decodedToken = JSON.parse(jsonPayload);
      dispatch(googleregister(decodedToken)as any)
      console.log("Decoded JWT Token:", decodedToken);
  
      
      console.log("User email:", decodedToken.email);
      console.log("User name:", decodedToken.name);
      console.log("User picture:", decodedToken.picture);
  
      
    }
  };
  

  const handleGoogleLoginFailure = () => {
    console.error("Google login failed");
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    const userData = {
      email,
      password,
    };

    dispatch(login(userData) as any);
};
return (
  <GoogleOAuthProvider clientId="585727312599-1a379cv4rer263le64c75r4k5scvsu3k.apps.googleusercontent.com">
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler} >
          <h1 className="mb-3">Login</h1>
          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link to="/users/forgetPassword" className="float-right mb-4">
            Forgot Password
          </Link>
          <button
            id="login_button"
            type="submit"
            className="btn btn-block py-3"
          >
            LOGIN
          </button>
          <div className="or-separator">
            <span>OR</span>
          </div>
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </div>
          <Link to="/register" className="float-right mt-3">
            NEW USER?
          </Link>
        </form>
      </div>
    </div>
  </GoogleOAuthProvider>
);
};

export default Login;