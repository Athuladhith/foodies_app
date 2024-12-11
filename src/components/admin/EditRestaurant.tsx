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


  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar1, setAvatar1] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(''); 
  const [avatarPreview1, setAvatarPreview1] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [avatar, setAvatar] = useState<string>("");
    const [avatarPreview, setAvatarPreview] = useState<string>("/images/default-restaurant.png");



  useEffect(() => {
    if (id) {
      dispatch(fetchSingleRestaurant(id));
    }
  }, [dispatch, id]);


  useEffect(() => {
    if (singleRestaurant) {
      setRestaurantName(singleRestaurant.restaurantName);
      setAddress(singleRestaurant.address);
      setPhoneNumber(singleRestaurant.phoneNumber);
      setAvatarUrl(singleRestaurant.avatar); 
      setAvatarPreview(singleRestaurant.avatar); 
    }
  }, [singleRestaurant]);


  const handleUpdateRestaurant = async () => {
    if (id) {
      const formData = new FormData();
      formData.append('restaurantName', restaurantName);
      formData.append('address', address);
      formData.append('phoneNumber', phoneNumber);


      if (avatar) {
        formData.append('avatar', avatar);
      }

      try {
        await dispatch(updateRestaurant(id, formData)); 
        setOpenSnackbar(true);
        setTimeout(() => navigate('/adminhome'), 1000);
      } catch (err) {
        console.error('Error updating restaurant:', err);
      }
    }
  };

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

    
        <div style={{ marginTop: '16px' }}>
          <Typography variant="body1">Avatar:</Typography>
          <img
            src={avatarPreview || avatarUrl}
            alt="Restaurant Avatar"
            style={{ width: '150px', height: '150px', objectFit: 'cover', marginTop: '8px', borderRadius: '50%' }}
          />
        </div>

 
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
