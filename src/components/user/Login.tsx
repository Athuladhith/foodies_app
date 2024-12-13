import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { RootState } from '../../store';
import { googleregister, login } from "../../actions/userAction";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Button, TextField, Grid, Typography, Paper, Box } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }
    if (error) {
      toast.error(error);
    }
  }, [dispatch, isAuthenticated, error]);

  const handleGoogleLoginSuccess = (response: any) => {
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
      dispatch(googleregister(decodedToken) as any);
    }
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google login failed");
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData) as any);
  };

  const color = "#be521f";  // Set the desired color here

  return (
    <GoogleOAuthProvider clientId="585727312599-1a379cv4rer263le64c75r4k5scvsu3k.apps.googleusercontent.com">
      <Box className="flex justify-center items-center min-h-screen bg-gray-50">
        <Paper className="w-full sm:w-96 p-8 shadow-lg rounded-lg">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            className="text-center" 
            style={{ color }}  // Apply the color to the heading
          >
            Login
          </Typography>

          <form onSubmit={submitHandler}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                  style={{ color }}  // Apply color to the text input
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                  style={{ color }}  // Apply color to the password input
                />
              </Grid>

              <Grid item xs={12} className="flex justify-between items-center">
                <Link 
                  to="/users/forgetPassword" 
                  className="text-sm hover:underline"
                  style={{ color }}  // Apply color to the forgot password link
                >
                  Forgot Password?
                </Link>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  className="py-3"
                  style={{ backgroundColor: color }}  // Apply the color to the login button
                >
                  {loading ? 'Logging in...' : 'LOGIN'}
                </Button>
              </Grid>

              <Grid item xs={12} className="flex justify-center items-center mt-4">
                <span className="text-gray-500" style={{ color }}>OR</span>
              </Grid>

              <Grid item xs={12} className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                />
              </Grid>

              <Grid item xs={12} className="text-center mt-4">
                <Link 
                  to="/register" 
                  className="text-sm hover:underline"
                  style={{ color }}  // Apply color to the register link
                >
                  NEW USER? Create an account
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;