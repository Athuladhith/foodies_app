import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchRestaurants } from '../../actions/adminAction';
import { useNavigate } from 'react-router-dom';
import rating from '../../images/rating.png';

const RestaurantList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { restaurants } = useSelector((state: RootState) => state.admin);

  React.useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  return (
    <div className='grid grid-cols-4 gap-4 w-11/12'>
      {restaurants.map((data: any) => (
        <div
          key={data._id}
          className="max-w-sm overflow-hidden mt-4 cursor-pointer"
          onClick={() => navigate(`/restaurant/${data._id}`)}
        >
          <img
            className="w-52 h-36 object-cover rounded-2xl"
            src={data.avatar}
            alt={data.restaurantName}
          />
          <div className="px-4 py-2">
            <div className="font-semibold text-xl text-gray-800">
              {data.restaurantName.slice(0, 10)}...
            </div>
            <div className='flex items-center'>
              <img src={rating} className='w-5 h-5 rounded-full' />
              <div className="font-semibold text-lg text-gray-800 ml-1">
                Rating
              </div>
            </div>
            <p className="text-gray-500 text-base">
              Cuisine<br />
              {data.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
