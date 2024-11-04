import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { addCuisine } from "../../actions/RestaurantAction";
import { toast } from 'react-toastify';
import MainLayout from "./Mainlayout";

const Cuisine: React.FC = () => {
  const [cuisineName, setCuisineName] = useState<string>("");
  const [cuisineDescription, setCuisineDescription] = useState<string>("");
  const [cuisineImage, setCuisineImage] = useState<File | null>(null);

  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.restaurant);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCuisineImage(e.target.files[0]);
    }
  };

  const handleAddCuisine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation checks
    if (cuisineName.trim() === "") {
      toast.error("Cuisine name is required.");
      return;
    }

    if (cuisineDescription.trim() === "") {
      toast.error("Cuisine description is required.");
      return;
    }

    if (!cuisineImage) {
      toast.error("Please select an image for the cuisine.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cuisineName);
    formData.append("description", cuisineDescription);
    formData.append("avatar", cuisineImage);

    dispatch(addCuisine(formData) as any);
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Cuisine added successfully!");
      setCuisineName("");
      setCuisineDescription("");
      setCuisineImage(null);
      window.location.href = "/restauranthome";
    }
    if (error) {
      console.log(error);
      toast.error("Failed to add cuisine. Please try again.");
    }
  }, [dispatch, isAuthenticated, error]);

  return (
    <MainLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={handleAddCuisine}>
            <h1 className="mb-3">Add New Cuisine</h1>
            
            <div className="form-group">
              <label htmlFor="cuisine_name_field">Cuisine Name</label>
              <input
                type="text"
                id="cuisine_name_field"
                className="form-control"
                value={cuisineName}
                onChange={(e) => setCuisineName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cuisine_description_field">Cuisine Description</label>
              <textarea
                id="cuisine_description_field"
                className="form-control"
                value={cuisineDescription}
                onChange={(e) => setCuisineDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cuisine_image_field">Cuisine Image</label>
              <input
                type="file"
                id="cuisine_image_field"
                className="form-control"
                onChange={handleImageChange}
                name="avatar"
                required
              />
            </div>
            
            <button
              id="add_cuisine_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Cuisine"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cuisine;
