import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { adminlogin } from "../../actions/adminAction";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate=useNavigate()
  const dispatch=useDispatch()
  const{isAuthenticated,loading,error}=useSelector((state:RootState)=>state.auth)
 useEffect(()=>{
  if (isAuthenticated) {
    toast.success("AdminLogin successful!"); 
    setTimeout(() => {
      // window.location.href = '/adminhome';
      navigate('/adminhome');
    }, 1000); 
  }
  if (error) {
    console.log(error);
    toast.error("Login failed. Please try again."); 
  }
 },[dispatch,isAuthenticated,error])


  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    console.log("Admin login:", { email, password });
    const adminData={
      email,password
    }
    dispatch(adminlogin(adminData) as any)
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={handleLogin}>
          <h1 className="mb-3">Admin Login</h1>
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
          
          <button
            id="login_button"
            type="submit"
            className="btn btn-block py-3"
          >
            LOGIN
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
