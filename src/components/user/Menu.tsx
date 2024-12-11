
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../actions/RestaurantAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';

const Menu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { category } = useSelector((state: RootState) => state.restaurant);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="flex items-center justify-center mt-12 overflow-x-auto no-swiggy-scrollbar space-x-6 px-4">
      {category.map((cat: any, index: number) => (
        <div
          key={index}
          className="flex-shrink-0 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FF6347] hover:border-2 rounded-lg overflow-hidden"
          onClick={() => handleCategoryClick(cat._id)}
        >
          <div className="relative group w-56 h-56">
            <img
              src={`data:image/jpeg;base64,${cat.avatar}`}
              alt={cat.name}
              className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black opacity-40 group-hover:opacity-50 transition-opacity duration-300 rounded-lg"></div>
          </div>
          <h1 className="font-extrabold text-gray-800 text-xl text-center mt-4 transition-colors duration-300 group-hover:text-[#FF6347]">
            {cat.name}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default Menu;
