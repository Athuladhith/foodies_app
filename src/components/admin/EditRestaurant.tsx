import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSingleRestaurant, updateRestaurant } from '../../actions/adminAction';
import { AppDispatch, RootState } from '../../store';
import { Button, TextField, Paper, Typography, CircularProgress, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import MainLayout from './MainLayout';

export default function EditRestaurant() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { singleRestaurant, loading, error } = useSelector((state: RootState) => state.admin);

  // State variables
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar1, setAvatar1] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(''); // For displaying the old avatar
  const [avatarPreview1, setAvatarPreview1] = useState(''); // For previewing new avatar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [avatar, setAvatar] = useState<string>("");
    const [avatarPreview, setAvatarPreview] = useState<string>("/images/default-restaurant.png");


  // Fetch restaurant data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleRestaurant(id));
    }
  }, [dispatch, id]);

  // Update local state when singleRestaurant is updated
  useEffect(() => {
    if (singleRestaurant) {
      setRestaurantName(singleRestaurant.restaurantName);
      setAddress(singleRestaurant.address);
      setPhoneNumber(singleRestaurant.phoneNumber);
      setAvatarUrl(singleRestaurant.avatar); // Set the existing avatar URL
      setAvatarPreview(singleRestaurant.avatar); // Initial preview
    }
  }, [singleRestaurant]);

  // Handle form submission
  const handleUpdateRestaurant = async () => {
    if (id) {
      const formData = new FormData();
      formData.append('restaurantName', restaurantName);
      formData.append('address', address);
      formData.append('phoneNumber', phoneNumber);

      // If a new avatar is selected, add it to formData
      if (avatar) {
        formData.append('avatar', avatar); // Append new avatar only if it's selected
      }

      try {
        await dispatch(updateRestaurant(id, formData)); // Dispatch formData to update restaurant
        setOpenSnackbar(true);
        setTimeout(() => navigate('/adminhome'), 1000);
      } catch (err) {
        console.error('Error updating restaurant:', err);
      }
    }
  };

  // Handle file input change and set preview
  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setAvatar(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAvatarPreview(reader.result as string); // Set preview URL
  //     };
  //     reader.readAsDataURL(file); // Read the file and convert to base64 for preview
  //   }
  // };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatar") {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result as string);
                setAvatar(reader.result as string);
            }
        };
        reader.readAsDataURL(e.target.files![0]);
    } 
};

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <MainLayout>
    <Paper sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Restaurant
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <form>
        <TextField
          label="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Show existing or preview avatar */}
        <div style={{ marginTop: '16px' }}>
          <Typography variant="body1">Avatar:</Typography>
          <img
            src={avatarPreview || avatarUrl} // Show preview if new avatar is selected, else show the old one
            alt="Restaurant Avatar"
            style={{ width: '150px', height: '150px', objectFit: 'cover', marginTop: '8px', borderRadius: '50%' }}
          />
        </div>

        {/* Input for new avatar */}
        <input
            type='file'
            name='avatar'
            className='custom-file-input'
             id="customFile"
            accept='image/*'
            onChange={onChange}
          />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateRestaurant}
          sx={{ marginTop: 2 }}
        >
          Update Restaurant
        </Button>
      </form>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Restaurant updated successfully!
        </Alert>
      </Snackbar>
    </Paper>
    </MainLayout>
  );
}
