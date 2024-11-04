import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { fetchOrders } from '../../actions/adminAction'; // Assuming you have an action to fetch orders
import { RootState, AppDispatch } from '../../store'; 
import MainLayout from './MainLayout';

const AdminHomePage: React.FC = () => {
    // const { totalOrders, pendingOrders, completedOrders, loading, error } = useSelector((state: RootState) => state.admin); // Assuming you have these in your state
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // dispatch(fetchOrders()); // Dispatching order fetching action
    }, [dispatch]);

    return (
        <MainLayout>
            <div className="admin-home bg-gray-100 min-h-screen p-6">
                <div className="admin-container max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="admin-header flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <div className="admin-actions space-x-4">
                            <Link to="/registerdeliveryboy" className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                Add Delivery Boy
                            </Link>
                            <Link to="/registerrestaurant" className="btn btn-primary bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                Add Restaurant
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold">Total Orders</h2>
                            <p className="text-4xl font-bold">{'demo' ? 'Loading...' : 'error' ? 'Error' :'totalorder'}</p>
                        </div>
                        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold">Pending Orders</h2>
                            <p className="text-4xl font-bold">{'loading' ? 'Loading...' : 'error' ? 'Error' : 'pendingOrders'}</p>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold">Completed Orders</h2>
                            <p className="text-4xl font-bold">{'loading' ? 'Loading...' : 'error' ? 'Error' : 'completedOrders'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminHomePage;
