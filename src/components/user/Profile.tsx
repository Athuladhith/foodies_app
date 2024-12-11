import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import Headder from './Headder';
import Footer from './Footer';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(user || {
    name: '',
    email: '',
    phonenumber: '',
    avatar: '',
    
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userData._id, ...userData }),  
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user data', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
    <Headder/>
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-10 flex">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                value={userData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Phone:</label>
              <input
                type="text"
                name="phonenumber"
                value={userData.phoneNumber || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Name:</label>
              <p className="text-gray-800">{userData.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email:</label>
              <p className="text-gray-800">{userData.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Phone:</label>
              <p className="text-gray-800">{userData.phoneNumber || 'N/A'}</p>
            </div>
           
            <button
              onClick={handleEdit}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Edit
            </button>
          </div>
        )}
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <img src={userData.avatar || '/default-avatar.png'} alt="Profile" className="w-48 h-48 rounded-full object-cover" />
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Profile;
