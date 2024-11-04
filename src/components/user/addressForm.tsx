import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import api from '../../Api'


interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressFormProps {
  setSelectedAddress: (addressId: string) => void;
}

const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const AddressForm: React.FC<AddressFormProps> = ({ setSelectedAddress }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      api.get(`http://localhost:5000/api/users/addresses/${user.id}`)
        .then(response => {
          console.log('Fetched Addresses:', response.data);  // Debug log
          setAddresses(response.data);
        })
        .catch(error => {
          console.error('Error fetching addresses', error);
        });
    }
  }, []);

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  const handleNewAddressSubmit = (data: any) => {
    if (!user) {
      console.error('User is not logged in');
      return;
    }

    const requestData = { ...data, userId: user.id };
   
    api.post('http://localhost:5000/api/users/address', requestData)
      .then(response => {
        setAddresses(prevAddresses => [...prevAddresses, response.data]);
        setShowNewAddressForm(false);
        reset(); // Clear form fields
      })
      .catch(error => {
        console.error('Error adding address', error);
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Select Address</h2>
      
      {addresses.length > 0 ? (
        <>
          {addresses.map(address => (
            <div key={address._id} className="flex items-center mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="address"
                  value={address._id}
                  onChange={() => handleAddressSelection(address._id)}
                  className="form-radio text-green-600"
                />
                <span className="text-gray-700">{`${address.street}, ${address.city}, ${address.state}, ${address.country}`}</span>
              </label>
            </div>
          ))}
        </>
      ) : (
        <p className="text-gray-600">No saved addresses. Please add a new address.</p>
      )}

      <button
        onClick={() => setShowNewAddressForm(prev => !prev)}
        className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
      >
        {showNewAddressForm ? 'Cancel' : 'Add New Address'}
      </button>

      {showNewAddressForm && (
        <form onSubmit={handleSubmit(handleNewAddressSubmit)} className="mt-6 space-y-4">
          <input
            {...register('street', { required: true })}
            placeholder="Street"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            {...register('city', { required: true })}
            placeholder="City"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            {...register('state', { required: true })}
            placeholder="State"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            {...register('postalCode', { required: true })}
            placeholder="Postal Code"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            {...register('country', { required: true })}
            placeholder="Country"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-300"
          >
            Save Address
          </button>
        </form>
      )}
    </div>
  );
};

export default AddressForm;
