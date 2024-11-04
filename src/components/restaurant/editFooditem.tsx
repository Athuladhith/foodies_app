import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSingleFoodItem, updateFoodItem, fetchCategories, fetchCuisine } from '../../actions/RestaurantAction';
import { AppDispatch, RootState } from '../../store';
import { Button, TextField, Paper, Typography, CircularProgress, Snackbar, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import MainLayout from './Mainlayout';

export default function EditFoodItem() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { singleFoodItem, loading, error } = useSelector((state: RootState) => state.restaurant);
  const { category, cuisine } = useSelector((state: RootState) => state.restaurant);

  const [name, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categorys, setCategory] = useState('');
  const [cuisines, setCuisine] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string >('/images/default-restaurant.png');

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleFoodItem(id));
    }
    dispatch(fetchCategories()); // Fetch categories
    dispatch(fetchCuisine()); // Fetch cuisines
  }, [dispatch, id]);

  useEffect(() => {
    if (singleFoodItem) {
      setFoodName(singleFoodItem.name);
      setPrice(singleFoodItem.price.toString());
      setQuantity(singleFoodItem.quantity.toString());
      setImagePreview(`data:image/jpeg;base64,${singleFoodItem.image}`)
      setImage(`data:image/jpeg;base64,${singleFoodItem.image}`)

      // Find the category name using the category ID
      const selectedCategory = category.find((cat) => cat._id === singleFoodItem.category);
      setCategory(selectedCategory ? selectedCategory._id : '');

      // Find the cuisine name using the cuisine ID
      const selectedCuisine = cuisine.find((cui) => cui._id === singleFoodItem.cuisine);
      setCuisine(selectedCuisine ? selectedCuisine._id : '');

    }
  }, [singleFoodItem, category, cuisine]);

  const handleUpdateFoodItem = async () => {
    if (id) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('category', categorys);
      formData.append('cuisine', cuisines);
      if (image) {
        formData.append('image', image);
      }
      try {
        await dispatch(updateFoodItem(id, formData));
        setOpenSnackbar(true);
        setTimeout(() =>navigate('/restauranthome'),1000);
      } catch (err) {
        console.error('Error updating food item:', err);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image") {
      const reader = new FileReader();
      reader.onload = () => {
          if (reader.readyState === 2) {
              setImagePreview(reader.result as string);
              setImage(reader.result as string);
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
        Edit Food Item
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <form>
        <TextField
          label="Food Name"
          value={name}
          onChange={(e) => setFoodName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Category Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={categorys}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {category.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cuisine Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="cuisine-label">Cuisine</InputLabel>
          <Select
            labelId="cuisine-label"
            value={cuisines}
            onChange={(e) => setCuisine(e.target.value)}
            label="Cuisine"
          >
            {cuisine.map((cui) => (
              <MenuItem key={cui._id} value={cui._id}>
                {cui.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div style={{ marginTop: '16px' }}>
          <Typography variant="body1">Image:</Typography>
          <img
            src={imagePreview ||image}
            alt="Food Item"
            style={{ width: '150px', height: '150px', objectFit: 'cover', marginTop: '8px', borderRadius: '50%' }}
          />
        </div>
        <input
          type="file"
          name="image"
           id="customFile"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: '16px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateFoodItem}
          sx={{ marginTop: 2 }}
        >
          Update Food Item
        </Button>
      </form>
    </Paper>
    </MainLayout>
  );
  
}
