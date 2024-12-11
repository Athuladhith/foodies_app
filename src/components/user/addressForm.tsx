

import React, { useState, useEffect } from 'react';

import axios from 'axios';

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AddressFormProps {
  setSelectedAddress: (addressId: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ setSelectedAddress }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);


  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log(storedUser,'storeduserrrrrr')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        setUser(null); 
      }
    }
  }, []);


  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/users/addresses/${user.id}`)
        .then((response) => {
          console.log('Fetched Addresses:', response.data);
          setAddresses(response.data);
        })
        .catch((error) => {
          console.error('Error fetching addresses', error);
        });
    }
  }, [user]);

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User is not logged in');
      return;
    }

    const requestData = { ...newAddress, userId: user.id };
    try {
      const response = await axios.post('http://localhost:5000/api/users/address', requestData);
      setAddresses((prevAddresses) => [...prevAddresses, response.data]);
      setShowNewAddressForm(false);
      setNewAddress({ street: '', city: '', state: '', postalCode: '', country: '' }); // Reset form
    } catch (error) {
      console.error('Error adding address', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Select Address</h2>

      {addresses.length > 0 ? (
        addresses.map((address) => (
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
        ))
      ) : (
        <p className="text-gray-600">No saved addresses. Please add a new address.</p>
      )}

      <button
        onClick={() => setShowNewAddressForm((prev) => !prev)}
        className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
      >
        {showNewAddressForm ? 'Cancel' : 'Add New Address'}
      </button>

      {showNewAddressForm && (
        <form onSubmit={handleNewAddressSubmit} className="mt-6 space-y-4">
          <input
            name="street"
            value={newAddress.street}
            onChange={handleNewAddressChange}
            placeholder="Street"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="city"
            value={newAddress.city}
            onChange={handleNewAddressChange}
            placeholder="City"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="state"
            value={newAddress.state}
            onChange={handleNewAddressChange}
            placeholder="State"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="postalCode"
            value={newAddress.postalCode}
            onChange={handleNewAddressChange}
            placeholder="Postal Code"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            name="country"
            value={newAddress.country}
            onChange={handleNewAddressChange}
            placeholder="Country"
            className="w-full p-2 border border-gray-300 rounded"
            required
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
