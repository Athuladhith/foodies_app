import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import { fetchdeliveryboy } from '../../actions/DeliverypersonAction';

const DeliveryBoy: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch=useDispatch()

  const{isAuthenticated,error,loading}=useSelector((state:RootState)=>state.deliveryboy);

  useEffect(()=>{
    if(isAuthenticated){
      toast.success('login in success');
      setTimeout(() => {
        window.location.href='/deliveryboyhome'
      }, 1000);  
    }
    if(error){
      console.log(error)
      toast.error('Login failed')
    }
  },[dispatch,isAuthenticated,error])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const deliveryboydata={
    email,
    password
    }
   
    console.log("Delivery Boy login:", { email, password });

    dispatch(fetchdeliveryboy(deliveryboydata) as any)
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={handleLogin}>
          <h1 className="mb-3">Delivery Boy Login</h1>
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

export default DeliveryBoy;
