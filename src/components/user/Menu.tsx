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
    <div className='flex items-center mt-10 overflow-x-scroll scrollbar-hide space-x-8 no-swiggy-scrollbar'>
      {category.map((cat: any, index: number) => (
        <div key={index} className='flex-shrink-0' onClick={() => handleCategoryClick(cat._id)}>
          <img 
            src={`data:image/jpeg;base64,${cat.avatar}`} 
            className='w-36 h-36 rounded-full object-cover' 
            alt={cat.name}
          />
          <h1 className='font-semibold text-gray-500 text-xl text-center mt-2'>{cat.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default Menu;
