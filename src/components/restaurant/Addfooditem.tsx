import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { addFoodItem, fetchCategories, fetchCuisine } from '../../actions/RestaurantAction';
import MainLayout from './Mainlayout';
import { ObjectId } from 'bson';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'

const AddFoodItem: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [foodImagePreview, setFoodImagePreview] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [restaurantid, setRestaurantid] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFoodType, setSelectedFoodType] = useState<string>('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
  );

  useEffect(() => {
    const restid = localStorage.getItem('restaurantid');
    if (restid) {
      try {
        const objectId = new ObjectId(restid);
        setRestaurantid(objectId.toHexString());
      } catch (error) {
        console.error("Invalid ObjectId string", error);
      }
    }
  }, []);

  const dispatch = useDispatch();
  const { category, cuisine, isAuthenticated, loading, error } = useSelector((state: RootState) => state.restaurant);

  useEffect(() => {
    dispatch(fetchCategories() as any);
    dispatch(fetchCuisine() as any);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
       toast.success("Food item added successfully!");
      setFoodName("");
      setFoodImage(null);
      setFoodImagePreview(null);
      setPrice(0);
      setQuantity(1);
      setSelectedCategory("");
      setSelectedCuisine("");
      setSelectedFoodType("")
      window.location.href = "/restauranthome";
    }
    if (error) {
      toast.error("Failed to add food item. Please try again.");
    }
  }, [dispatch, isAuthenticated, error]);

  const onChange = (cropper: CropperRef) => {
    const canvas = cropper.getCanvas();

    if (canvas) {
   
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
    
          setFoodImage(file);
        }
      })
    }
    console.log(cropper.getCoordinates(), cropper.getCanvas());
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFoodImage(selectedFile);
      setFoodImagePreview(URL.createObjectURL(selectedFile));
    }
  };
  console.log(foodImage, 'foodimage')
  const handleAddFoodItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (foodName.trim() === "") {
      newErrors.foodName = "Food name is required.";
    }

    if (price <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (quantity <= 0) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    if (selectedCategory === "") {
      newErrors.selectedCategory = "Please select a category.";
    }

    if (selectedCuisine === "") {
      newErrors.selectedCuisine = "Please select a cuisine.";
    }

    if (!foodImage) {
      newErrors.foodImage = "Please select an image for the food item.";
    }
    if (selectedFoodType === "") { 
      newErrors.selectedFoodType = "Please select Veg or Non-Veg.";
    }


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => toast.error(error));
      return;
    }

    const formData = new FormData();
    formData.append('name', foodName);
    formData.append('price', price.toString());
    formData.append('quantity', quantity.toString());
    formData.append('category', selectedCategory);
    formData.append('cuisine', selectedCuisine);
    formData.append('foodType', selectedFoodType); 

    if (foodImage) {
      formData.append('image', foodImage);
    }

    formData.append('restaurantid', restaurantid);

    dispatch(addFoodItem(formData) as any);
  };

  return (
    <MainLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={handleAddFoodItem}>
            <h1 className="mb-3">Add New Food Item</h1>


            <div className="form-group">
              <label htmlFor="food_name_field">Food Name</label>
              <input
                type="text"
                id="food_name_field"
                className={`form-control ${errors.foodName ? 'is-invalid' : ''}`}
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
              {errors.foodName && <div className="invalid-feedback">{errors.foodName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="price_field">Price</label>
              <input
                type="number"
                id="price_field"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity_field">Quantity</label>
              <input
                type="number"
                id="quantity_field"
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
              {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category_field">Category</label>
              <select
                id="category_field"
                className={`form-control ${errors.selectedCategory ? 'is-invalid' : ''}`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {category.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.selectedCategory && <div className="invalid-feedback">{errors.selectedCategory}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="cuisine_field">Cuisine</label>
              <select
                id="cuisine_field"
                className={`form-control ${errors.selectedCuisine ? 'is-invalid' : ''}`}
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                required
              >
                <option value="">Select Cuisine</option>
                {cuisine.map((cuisine) => (
                  <option key={cuisine._id} value={cuisine._id}>
                    {cuisine.name}
                  </option>
                ))}
              </select>
              {errors.selectedCuisine && <div className="invalid-feedback">{errors.selectedCuisine}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="food_type_field">Veg/Non-Veg</label>
              <select
                id="food_type_field"
                className={`form-control ${errors.selectedFoodType ? 'is-invalid' : ''}`}
                value={selectedFoodType}
                onChange={(e) => setSelectedFoodType(e.target.value)}
                required
              >
                <option value="">Select Food Type</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
              {errors.selectedFoodType && <div className="invalid-feedback">{errors.selectedFoodType}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="food_image_field">Food Image</label>
              <input
                type="file"
                id="food_image_field"
                className={`form-control ${errors.foodImage ? 'is-invalid' : ''}`}
                onChange={handleImageChange}
                name="image"
                required
              />
              {errors.foodImage && <div className="invalid-feedback">{errors.foodImage}</div>}
            </div>

            

            <Cropper
              src={foodImagePreview}
              onChange={onChange}
              className={'cropper'}
            />

            <button
              id="add_food_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Food Item'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddFoodItem;
